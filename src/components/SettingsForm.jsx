import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (val.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name is required",
        });
        return;
      }
      if (val.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name must be at least 2 characters.",
        });
      }
      if (val.length > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name must be under 50 characters.",
        });
      }
    }),
  email: z
    .string()
    .trim()
    .min(1, "Enter a valid email")
    .email("Enter a valid email"),
  notifications: z.boolean(),
});

const defaultValues = {
  displayName: "",
  email: "",
  notifications: true,
};

export default function SettingsForm({ onSave }) {
  const [toastVisible, setToastVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues,
    mode: "onBlur",
  });

  function onSubmit(data) {
    onSave?.(data);
    setToastVisible(true);
    window.clearTimeout(onSubmit._t);
    onSubmit._t = window.setTimeout(() => setToastVisible(false), 3000);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Account settings"
      style={styles.form}
    >
      <div style={styles.field}>
        <label htmlFor="displayName" style={styles.label}>
          Display name
        </label>
        <Controller
          name="displayName"
          control={control}
          render={({ field }) => (
            <input
              id="displayName"
              type="text"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!errors.displayName}
              aria-describedby={
                errors.displayName ? "displayName-error" : undefined
              }
              style={styles.input}
            />
          )}
        />
        {errors.displayName && (
          <span id="displayName-error" role="alert" style={styles.error}>
            {errors.displayName.message}
          </span>
        )}
      </div>

      <div style={styles.field}>
        <label htmlFor="email" style={styles.label}>
          Email
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              id="email"
              type="email"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              style={styles.input}
            />
          )}
        />
        {errors.email && (
          <span id="email-error" role="alert" style={styles.error}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div style={styles.checkboxRow}>
        <Controller
          name="notifications"
          control={control}
          render={({ field }) => (
            <input
              id="notifications"
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              style={styles.checkbox}
            />
          )}
        />
        <label htmlFor="notifications" style={styles.checkboxLabel}>
          Notify me by email
        </label>
      </div>

      <button type="submit" style={styles.submitBtn}>
        Save changes
      </button>

      {toastVisible && (
        <div role="status" aria-live="polite" style={styles.toast}>
          Settings saved.
        </div>
      )}
    </form>
  );
}

const styles = {
  form: { maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 13, fontWeight: 500 },
  input: {
    padding: "8px 10px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  error: { fontSize: 12, color: "#c0392b" },
  checkboxRow: { display: "flex", alignItems: "center", gap: 8 },
  checkbox: { width: 16, height: 16 },
  checkboxLabel: { fontSize: 14 },
  submitBtn: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#1f1e1b",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    width: "fit-content",
  },
  toast: {
    fontSize: 13,
    color: "#2e7d32",
    background: "#eaf6ea",
    padding: "8px 12px",
    borderRadius: 6,
  },
};
