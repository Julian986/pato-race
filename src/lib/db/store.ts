import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { campaign } from "@/lib/campaign";
import type { PaymentStatus } from "@/lib/db/schema";

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

const emptyStore = (): StoreData => ({
  participants: [],
  payments: [],
});

async function ensureStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const data = emptyStore();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

async function writeStore(data: StoreData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
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
  const data = await ensureStore();
  const now = new Date().toISOString();
  const participant: StoredParticipant = {
    id: randomUUID(),
    name: input.name,
    dni: input.dni,
    email: input.email,
    phone: input.phone,
    ticketCode: ticketCode(),
    createdAt: now,
  };
  const payment: StoredPayment = {
    id: randomUUID(),
    participantId: participant.id,
    mpPaymentId: null,
    mpPreferenceId: null,
    status: "pending",
    amount: campaign.ticketPrice,
    createdAt: now,
    updatedAt: now,
  };
  data.participants.push(participant);
  data.payments.push(payment);
  await writeStore(data);
  return { participant, payment };
}

export async function getParticipantById(
  id: string,
): Promise<StoredParticipant | null> {
  const data = await ensureStore();
  return data.participants.find((p) => p.id === id) ?? null;
}

export async function getParticipantByTicket(
  ticketCode: string,
): Promise<StoredParticipant | null> {
  const data = await ensureStore();
  return (
    data.participants.find(
      (p) => p.ticketCode.toLowerCase() === ticketCode.toLowerCase(),
    ) ?? null
  );
}

export async function getPaymentById(
  id: string,
): Promise<StoredPayment | null> {
  const data = await ensureStore();
  return data.payments.find((p) => p.id === id) ?? null;
}

export async function getPaymentByParticipantId(
  participantId: string,
): Promise<StoredPayment | null> {
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
  const data = await ensureStore();
  const approved = data.payments.filter((p) => p.status === "approved");
  const raised = approved.reduce((sum, p) => sum + p.amount, 0);
  const goal = campaign.goalAmount;
  return {
    participants: approved.length,
    raised,
    goal,
    progress: goal > 0 ? Math.min(100, (raised / goal) * 100) : 0,
    ticketPrice: campaign.ticketPrice,
  };
}
