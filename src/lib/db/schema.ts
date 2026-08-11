import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const participants = pgTable("participants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dni: text("dni").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  ticketCode: text("ticket_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: text("id").primaryKey(),
  participantId: text("participant_id")
    .notNull()
    .references(() => participants.id),
  mpPaymentId: text("mp_payment_id"),
  mpPreferenceId: text("mp_preference_id"),
  status: text("status").notNull().default("pending"),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Participant = typeof participants.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled";
