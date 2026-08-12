import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { promises as fs } from "fs";
import path from "path";
import { campaign } from "@/lib/campaign";
import { getNeonDb } from "@/lib/db/neon";
import { participants, payments, type PaymentStatus } from "@/lib/db/schema";

export type StoredParticipant = {
  id: string;
  name: string;
  dni: string;
  email: string;
  phone: string;
  ticketCode: string;
  createdAt: string;
};

export type StoredPayment = {
  id: string;
  participantId: string;
  mpPaymentId: string | null;
  mpPreferenceId: string | null;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

type StoreData = {
  participants: StoredParticipant[];
  payments: StoredPayment[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

/** Fallback en memoria cuando el FS es de solo lectura (p. ej. Vercel sin Neon). */
let memoryStore: StoreData | null = null;

const emptyStore = (): StoreData => ({
  participants: [],
  payments: [],
});

function usesNeon(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function mapParticipant(row: typeof participants.$inferSelect): StoredParticipant {
  return {
    id: row.id,
    name: row.name,
    dni: row.dni,
    email: row.email,
    phone: row.phone,
    ticketCode: row.ticketCode,
    createdAt: toIso(row.createdAt),
  };
}

function mapPayment(row: typeof payments.$inferSelect): StoredPayment {
  return {
    id: row.id,
    participantId: row.participantId,
    mpPaymentId: row.mpPaymentId,
    mpPreferenceId: row.mpPreferenceId,
    status: row.status as PaymentStatus,
    amount: row.amount,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
  };
}

async function ensureStore(): Promise<StoreData> {
  if (memoryStore) return memoryStore;

  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const data = JSON.parse(raw) as StoreData;
    memoryStore = data;
    return data;
  } catch {
    const data = emptyStore();
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
    } catch {
      // Vercel / FS read-only: keep an in-memory store so pages can render.
    }
    memoryStore = data;
    return data;
  }
}

async function writeStore(data: StoreData): Promise<void> {
  memoryStore = data;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Persist only in memory for this instance when FS is not writable.
  }
}

function ticketCode(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `PR-${n}`;
}

export async function createParticipant(input: {
  name: string;
  dni: string;
  email: string;
  phone: string;
}): Promise<{ participant: StoredParticipant; payment: StoredPayment }> {
  const now = new Date();
  const participant: StoredParticipant = {
    id: randomUUID(),
    name: input.name,
    dni: input.dni,
    email: input.email,
    phone: input.phone,
    ticketCode: ticketCode(),
    createdAt: now.toISOString(),
  };
  const payment: StoredPayment = {
    id: randomUUID(),
    participantId: participant.id,
    mpPaymentId: null,
    mpPreferenceId: null,
    status: "pending",
    amount: campaign.ticketPrice,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) throw new Error("DATABASE_URL inválida");
    await db.insert(participants).values({
      id: participant.id,
      name: participant.name,
      dni: participant.dni,
      email: participant.email,
      phone: participant.phone,
      ticketCode: participant.ticketCode,
      createdAt: now,
    });
    await db.insert(payments).values({
      id: payment.id,
      participantId: payment.participantId,
      mpPaymentId: null,
      mpPreferenceId: null,
      status: payment.status,
      amount: payment.amount,
      createdAt: now,
      updatedAt: now,
    });
    return { participant, payment };
  }

  const data = await ensureStore();
  data.participants.push(participant);
  data.payments.push(payment);
  await writeStore(data);
  return { participant, payment };
}

export async function getParticipantById(
  id: string,
): Promise<StoredParticipant | null> {
  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(participants)
      .where(eq(participants.id, id))
      .limit(1);
    return rows[0] ? mapParticipant(rows[0]) : null;
  }

  const data = await ensureStore();
  return data.participants.find((p) => p.id === id) ?? null;
}

export async function getParticipantByTicket(
  ticketCodeValue: string,
): Promise<StoredParticipant | null> {
  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(participants)
      .where(eq(participants.ticketCode, ticketCodeValue))
      .limit(1);
    return rows[0] ? mapParticipant(rows[0]) : null;
  }

  const data = await ensureStore();
  return (
    data.participants.find(
      (p) => p.ticketCode.toLowerCase() === ticketCodeValue.toLowerCase(),
    ) ?? null
  );
}

export async function getPaymentById(
  id: string,
): Promise<StoredPayment | null> {
  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.id, id))
      .limit(1);
    return rows[0] ? mapPayment(rows[0]) : null;
  }

  const data = await ensureStore();
  return data.payments.find((p) => p.id === id) ?? null;
}

export async function getPaymentByParticipantId(
  participantId: string,
): Promise<StoredPayment | null> {
  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(payments)
      .where(eq(payments.participantId, participantId))
      .limit(1);
    return rows[0] ? mapPayment(rows[0]) : null;
  }

  const data = await ensureStore();
  return data.payments.find((p) => p.participantId === participantId) ?? null;
}

export async function updatePayment(
  id: string,
  patch: Partial<
    Pick<
      StoredPayment,
      "status" | "mpPaymentId" | "mpPreferenceId" | "updatedAt"
    >
  >,
): Promise<StoredPayment | null> {
  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) return null;
    const now = new Date();
    await db
      .update(payments)
      .set({
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        ...(patch.mpPaymentId !== undefined
          ? { mpPaymentId: patch.mpPaymentId }
          : {}),
        ...(patch.mpPreferenceId !== undefined
          ? { mpPreferenceId: patch.mpPreferenceId }
          : {}),
        updatedAt: now,
      })
      .where(eq(payments.id, id));
    return getPaymentById(id);
  }

  const data = await ensureStore();
  const idx = data.payments.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  data.payments[idx] = {
    ...data.payments[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  await writeStore(data);
  return data.payments[idx];
}

export async function approvePaymentByPreference(
  preferenceId: string,
  mpPaymentId?: string,
): Promise<{ participant: StoredParticipant; payment: StoredPayment } | null> {
  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) return null;
    const rows = await db.select().from(payments);
    const paymentRow = rows.find((p) => p.mpPreferenceId === preferenceId);
    if (!paymentRow) return null;
    const now = new Date();
    await db
      .update(payments)
      .set({
        status: "approved",
        mpPaymentId: mpPaymentId ?? paymentRow.mpPaymentId,
        updatedAt: now,
      })
      .where(eq(payments.id, paymentRow.id));
    const participant = await getParticipantById(paymentRow.participantId);
    const payment = await getPaymentById(paymentRow.id);
    if (!participant || !payment) return null;
    return { participant, payment };
  }

  const data = await ensureStore();
  const payment = data.payments.find((p) => p.mpPreferenceId === preferenceId);
  if (!payment) return null;
  payment.status = "approved";
  payment.mpPaymentId = mpPaymentId ?? payment.mpPaymentId;
  payment.updatedAt = new Date().toISOString();
  const participant = data.participants.find(
    (p) => p.id === payment.participantId,
  );
  if (!participant) return null;
  await writeStore(data);
  return { participant, payment };
}

export async function approvePaymentById(
  paymentId: string,
  mpPaymentId?: string,
): Promise<{ participant: StoredParticipant; payment: StoredPayment } | null> {
  if (usesNeon()) {
    const payment = await getPaymentById(paymentId);
    if (!payment) return null;
    await updatePayment(paymentId, {
      status: "approved",
      ...(mpPaymentId ? { mpPaymentId } : {}),
    });
    const participant = await getParticipantById(payment.participantId);
    const updated = await getPaymentById(paymentId);
    if (!participant || !updated) return null;
    return { participant, payment: updated };
  }

  const data = await ensureStore();
  const payment = data.payments.find((p) => p.id === paymentId);
  if (!payment) return null;
  payment.status = "approved";
  if (mpPaymentId) payment.mpPaymentId = mpPaymentId;
  payment.updatedAt = new Date().toISOString();
  const participant = data.participants.find(
    (p) => p.id === payment.participantId,
  );
  if (!participant) return null;
  await writeStore(data);
  return { participant, payment };
}

export type PublicStats = {
  participants: number;
  raised: number;
  goal: number;
  progress: number;
  ticketPrice: number;
};

export async function getPublicStats(): Promise<PublicStats> {
  const goal = campaign.goalAmount;

  if (usesNeon()) {
    const db = getNeonDb();
    if (!db) {
      return {
        participants: 0,
        raised: 0,
        goal,
        progress: 0,
        ticketPrice: campaign.ticketPrice,
      };
    }
    const rows = await db.select().from(payments);
    const approved = rows.filter((p) => p.status === "approved");
    const raised = approved.reduce((sum, p) => sum + p.amount, 0);
    return {
      participants: approved.length,
      raised,
      goal,
      progress: goal > 0 ? Math.min(100, (raised / goal) * 100) : 0,
      ticketPrice: campaign.ticketPrice,
    };
  }

  const data = await ensureStore();
  const approved = data.payments.filter((p) => p.status === "approved");
  const raised = approved.reduce((sum, p) => sum + p.amount, 0);
  return {
    participants: approved.length,
    raised,
    goal,
    progress: goal > 0 ? Math.min(100, (raised / goal) * 100) : 0,
    ticketPrice: campaign.ticketPrice,
  };
}
