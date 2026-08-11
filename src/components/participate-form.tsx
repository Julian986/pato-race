"use client";

import { useState } from "react";
import { campaign, formatARS } from "@/lib/campaign";

type FieldErrors = Partial<
  Record<"name" | "dni" | "email" | "phone" | "form", string>
>;

export function ParticipateForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      dni: String(form.get("dni") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        initPoint?: string;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!res.ok || !data.initPoint) {
        setErrors(
          data.fieldErrors ?? {
            form: data.error ?? "No se pudo iniciar el pago",
          },
        );
        setLoading(false);
        return;
      }

      window.location.href = data.initPoint;
    } catch {
      setErrors({ form: "Error de conexión. Intentá de nuevo." });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field
        label="Nombre y apellido"
        name="name"
        autoComplete="name"
        error={errors.name}
      />
      <Field
        label="DNI"
        name="dni"
        inputMode="numeric"
        placeholder="12345678"
        error={errors.dni}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={errors.email}
      />
      <Field
        label="Teléfono"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+54 11 1234-5678"
        error={errors.phone}
      />

      {errors.form ? (
        <p className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-foam">
          {errors.form}
        </p>
      ) : null}

      <div className="rounded-2xl border border-line bg-bg/40 p-4 text-sm text-ink-muted">
        Vas a pagar{" "}
        <strong className="text-duck">{formatARS(campaign.ticketPrice)}</strong>{" "}
        por Mercado Pago. Al confirmarse el pago, generamos tu ticket digital.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-duck px-6 py-3.5 text-base font-semibold text-bg transition hover:bg-duck-deep disabled:opacity-60"
      >
        {loading ? "Redirigiendo al pago…" : "Continuar al pago"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  ...props
}: {
  label: string;
  name: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink-muted">{label}</span>
      <input
        name={name}
        required
        className="w-full rounded-2xl border border-line bg-bg px-4 py-3 text-ink outline-none transition placeholder:text-ink-muted/50 focus:border-water"
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-coral">{error}</span> : null}
    </label>
  );
}
