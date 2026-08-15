import React, { useState } from "react";

const TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const initialValues = {
  fullName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  bio: "",
  timezone: "UTC",
  emailNotifications: true,
  productUpdates: false,
};

function validateField(name, values) {
  const v = values[name];

  switch (name) {
    case "fullName":
      if (!v.trim()) return "Enter your name.";
      if (v.trim().length < 2) return "Name must be at least 2 characters.";
      return "";

    case "email":
      if (!v.trim()) return "Enter your email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return "Enter a valid email address.";
      return "";

    case "username":
      if (!v.trim()) return "Choose a username.";
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(v))
        return "3–20 characters: letters, numbers, underscores only.";
      return "";

    case "password":
      if (!v) return "Create a password.";
      if (v.length < 8) return "Must be at least 8 characters.";
      if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v))
        return "Include at least one letter and one number.";
      return "";

    case "confirmPassword":
      if (!v) return "Confirm your password.";
      if (v !== values.password) return "Passwords don't match.";
      return "";

    case "bio":
      if (v.length > 280) return "Keep your bio under 280 characters.";
      return "";

    default:
      return "";
  }
}

const FIELD_ORDER = [
  "fullName",
  "email",
  "username",
  "password",
  "confirmPassword",
  "bio",
];

export default function SettingsForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    const nextValue = type === "checkbox" ? checked : value;
    const nextValues = { ...values, [name]: nextValue };
    setValues(nextValues);
    setSubmitted(false);

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, nextValues),
        ...(name === "password" && touched.confirmPassword
          ? { confirmPassword: validateField("confirmPassword", nextValues) }
          : {}),
      }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, values) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    FIELD_ORDER.forEach((name) => {
      nextErrors[name] = validateField(name, values);
    });
    setErrors(nextErrors);
    setTouched(
      FIELD_ORDER.reduce((acc, name) => ({ ...acc, [name]: true }), {})
    );

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (!hasErrors) {
      setSubmitted(true);
    }
  }

  const bioCount = values.bio.length;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Account settings</h1>
          <p style={styles.subtitle}>
            Update your profile, credentials, and notification preferences.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Section title="Profile">
            <Field
              label="Full name"
              name="fullName"
              value={values.fullName}
              error={touched.fullName && errors.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ada Lovelace"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={values.email}
              error={touched.email && errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ada@example.com"
            />
            <Field
              label="Username"
              name="username"
              value={values.username}
              error={touched.username && errors.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ada_lovelace"
              prefix="@"
            />
            <div style={styles.field}>
              <div style={styles.labelRow}>
                <label style={styles.label} htmlFor="bio">
                  Bio
                </label>
                <span
                  style={{
                    ...styles.hint,
                    color: bioCount > 280 ? "#c0392b" : "#8a8a86",
                  }}
                >
                  {bioCount}/280
                </span>
              </div>
              <textarea
                id="bio"
                name="bio"
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell people a little about yourself."
                rows={3}
                style={{
                  ...styles.textarea,
                  ...(touched.bio && errors.bio ? styles.inputError : {}),
                }}
              />
              {touched.bio && errors.bio && (
                <span style={styles.error}>{errors.bio}</span>
              )}
            </div>
            <div style={styles.field}>
              <label style={styles.label} htmlFor="timezone">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={values.timezone}
                onChange={handleChange}
                style={styles.select}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </Section>

          <Section title="Password">
            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">
                New password
              </label>
              <div style={styles.passwordRow}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="At least 8 characters"
                  style={{
                    ...styles.input,
                    ...(touched.password && errors.password
                      ? styles.inputError
                      : {}),
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={styles.toggleBtn}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {touched.password && errors.password && (
                <span style={styles.error}>{errors.password}</span>
              )}
            </div>
            <Field
              label="Confirm password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={values.confirmPassword}
              error={touched.confirmPassword && errors.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
            />
          </Section>

          <Section title="Notifications">
            <Checkbox
              name="emailNotifications"
              checked={values.emailNotifications}
              onChange={handleChange}
              label="Email notifications"
              description="Account activity, security alerts, and receipts."
            />
            <Checkbox
              name="productUpdates"
              checked={values.productUpdates}
              onChange={handleChange}
              label="Product updates"
              description="Occasional news about new features."
            />
          </Section>

          <div style={styles.footer}>
            {submitted && (
              <span style={styles.success}>Settings saved.</span>
            )}
            <button type="submit" style={styles.submitBtn}>
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, name, error, prefix, ...inputProps }) {
  return (
    <div style={styles.field}>
      <label style={styles.label} htmlFor={name}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {prefix && <span style={styles.prefix}>{prefix}</span>}
        <input
          id={name}
          name={name}
          {...inputProps}
          style={{
            ...styles.input,
            ...(prefix ? { paddingLeft: 24 } : {}),
            ...(error ? styles.inputError : {}),
          }}
        />
      </div>
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
}

function Checkbox({ name, checked, onChange, label, description }) {
  return (
    <label style={styles.checkboxRow} htmlFor={name}>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={styles.checkbox}
      />
      <span>
        <span style={styles.checkboxLabel}>{label}</span>
        <span style={styles.checkboxDesc}>{description}</span>
      </span>
    </label>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f3ef",
    padding: "40px 16px",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "#ffffff",
    border: "1px solid #e5e3dc",
    borderRadius: 14,
    padding: "32px 32px 24px",
  },
  header: { marginBottom: 8 },
  title: {
    fontSize: 22,
    fontWeight: 600,
    margin: 0,
    color: "#1f1e1b",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: 14,
    color: "#6f6d66",
    margin: "6px 0 0",
    lineHeight: 1.5,
  },
  section: {
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid #ece9e1",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "#8a8a86",
    margin: "0 0 16px",
  },
  field: { marginBottom: 16 },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#3a3934",
    marginBottom: 6,
  },
  hint: { fontSize: 12 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #d8d5cb",
    outline: "none",
    background: "#fdfcfa",
    color: "#1f1e1b",
  },
  inputError: {
    border: "1px solid #c0392b",
    background: "#fdf3f1",
  },
  prefix: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    color: "#8a8a86",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #d8d5cb",
    outline: "none",
    background: "#fdfcfa",
    color: "#1f1e1b",
    resize: "vertical",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #d8d5cb",
    outline: "none",
    background: "#fdfcfa",
    color: "#1f1e1b",
  },
  passwordRow: { display: "flex", gap: 8 },
  toggleBtn: {
    flexShrink: 0,
    padding: "0 14px",
    fontSize: 13,
    fontWeight: 500,
    borderRadius: 8,
    border: "1px solid #d8d5cb",
    background: "#fdfcfa",
    color: "#3a3934",
    cursor: "pointer",
  },
  error: {
    display: "block",
    marginTop: 5,
    fontSize: 12,
    color: "#c0392b",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
    cursor: "pointer",
  },
  checkbox: { marginTop: 3, width: 16, height: 16, flexShrink: 0 },
  checkboxLabel: {
    display: "block",
    fontSize: 14,
    fontWeight: 500,
    color: "#1f1e1b",
  },
  checkboxDesc: {
    display: "block",
    fontSize: 12,
    color: "#8a8a86",
    marginTop: 2,
  },
  footer: {
    marginTop: 24,
    paddingTop: 20,
    borderTop: "1px solid #ece9e1",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 14,
  },
  success: { fontSize: 13, color: "#3b6d11", fontWeight: 500 },
  submitBtn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#1f1e1b",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
