import { CaretDownIcon, GoogleLogoIcon, XIcon } from "@phosphor-icons/react";
import { FirebaseError } from "firebase/app";
import { useMemo, useState } from "react";
import { upsertEmailSignupProfile } from "../../api/auth";
import { createGuideApplication, type GuideProfessionOption } from "../../api/guideApplications";
import logoDark from "../../assets/Logo Dark.png";
import { useAuth } from "../../auth/AuthProvider";

type Audience = "explore" | "guide";
type ExploreTab = "login" | "signup";
type GuideTab = "login" | "signup";
type EmailAuthMode = "login" | "signup";

type LoginModalContentProps = {
  onClose?: () => void;
  onSuccess?: () => void;
  initialAudience?: Audience;
};

type ExploreAuthViewProps = {
  onSuccess?: () => void;
};

type GuideAuthViewProps = {
  onSuccess?: () => void;
};

const GUIDE_PROFESSION_OPTIONS: readonly GuideProfessionOption[] = [
  "Registered Forest Guide",
  "Private Naturalist",
] as const;

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80";

function isStrongPassword(password: string): boolean {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasMinLength && hasUpper && hasLower && hasDigit && hasSpecial;
}

function mapEmailAuthError(error: unknown, mode: EmailAuthMode): string {
  if (!(error instanceof FirebaseError)) {
    return "Email authentication failed. Please verify your credentials.";
  }
  switch (error.code) {
    case "auth/operation-not-allowed":
      return "Email/password sign-in is disabled for this Firebase project. Ask admin to enable it in Firebase Authentication.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 8 characters.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up first.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return mode === "login" ? "Incorrect email or password." : "Signup failed due to invalid credentials.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    default:
      return mode === "signup" ? "Signup failed. Please try again." : "Login failed. Please try again.";
  }
}

function EmailAuthForm({
  mode,
  onBack,
  onSuccess,
}: {
  mode: EmailAuthMode;
  onBack: () => void;
  onSuccess?: () => void;
}) {
  const { loginWithEmailPassword, signupWithEmailPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await loginWithEmailPassword(form.email.trim(), form.password);
      } else {
        const fullName = form.fullName.trim();
        if (fullName.length < 2) {
          setError("Please enter your full name.");
          return;
        }
        if (!isStrongPassword(form.password)) {
          setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Password and confirm password must match.");
          return;
        }
        await signupWithEmailPassword(form.email.trim(), form.password, fullName);
        await upsertEmailSignupProfile({
          full_name: fullName,
          phone_number: form.phoneNumber.trim() || undefined,
        });
      }
      onSuccess?.();
    } catch (err: unknown) {
      setError(mapEmailAuthError(err, mode));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={onSubmit}>
      {mode === "signup" ? (
        <>
          <input
            type="text"
            className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
            placeholder="Enter Full Name"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
            minLength={2}
            required
          />
          <input
            type="tel"
            className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
            placeholder="Phone Number (optional)"
            value={form.phoneNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
          />
        </>
      ) : null}
      <input
        type="email"
        className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
        placeholder="Enter Email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        required
      />
      <input
        type="password"
        className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
        placeholder="Enter Password"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        minLength={8}
        required
      />
      {mode === "signup" ? (
        <input
          type="password"
          className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          minLength={8}
          required
        />
      ) : null}
      <button
        type="submit"
        className="h-14 w-full rounded bg-(--color-wildbook-teal) text-[18px] leading-none font-semibold text-white disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Please wait..." : mode === "login" ? "Login with Email" : "Create account"}
      </button>
      <button
        type="button"
        className="h-12 w-full rounded border border-black/10 bg-white text-[16px] text-[#2f2b28]"
        onClick={onBack}
      >
        Back
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}

function ExploreAuthView({ onSuccess }: ExploreAuthViewProps) {
  const { loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<ExploreTab>("login");
  const [emailMode, setEmailMode] = useState<EmailAuthMode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleLogin() {
    setError(null);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }

  if (emailMode) {
    return <EmailAuthForm mode={emailMode} onBack={() => setEmailMode(null)} onSuccess={onSuccess} />;
  }

  return (
    <div className="mt-7 space-y-4">
      <div className="grid h-13 grid-cols-2 gap-2 rounded bg-[#ecebe7] p-1">
        <button
          type="button"
          className={`rounded text-[18px] leading-none font-medium ${
            tab === "login" ? "bg-[#cbe6dc] text-[#0b6e66]" : "text-[#777]"
          }`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`rounded text-[18px] leading-none font-medium ${
            tab === "signup" ? "bg-[#cbe6dc] text-[#0b6e66]" : "text-[#777]"
          }`}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>
      <button
        type="button"
        className="flex h-16 w-full items-center justify-center gap-3 rounded border border-black/8 bg-white text-[20px] leading-none font-medium text-[#2f2b28]"
        onClick={handleGoogleLogin}
      >
        <GoogleLogoIcon size={28} />
        Continue with Google
      </button>
      <button
        type="button"
        className="h-16 w-full rounded border border-black/8 bg-white text-[20px] leading-none font-medium text-[#2f2b28]"
        onClick={() => setEmailMode(tab === "signup" ? "signup" : "login")}
      >
        Continue with Email
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function GuideAuthView({ onSuccess }: GuideAuthViewProps) {
  const { loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<GuideTab>("login");
  const [emailMode, setEmailMode] = useState<EmailAuthMode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guideForm, setGuideForm] = useState({
    fullname: "",
    location: "",
    profession: "Registered Forest Guide" as GuideProfessionOption,
    contact_number: "",
    email: "",
  });

  async function handleGoogleLogin() {
    setError(null);
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  }

  async function handleGuideSignupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createGuideApplication(guideForm);
      onSuccess?.();
    } catch {
      setError("Could not submit guide details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (emailMode) {
    return <EmailAuthForm mode={emailMode} onBack={() => setEmailMode(null)} onSuccess={onSuccess} />;
  }

  return (
    <div className="mt-7">
      <div className="grid h-13 grid-cols-2 gap-2 rounded bg-[#ecebe7] p-1">
        <button
          type="button"
          className={`rounded text-[18px] leading-none font-medium ${
            tab === "login" ? "bg-[#cbe6dc] text-[#0b6e66]" : "text-[#777]"
          }`}
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`rounded text-[18px] leading-none font-medium ${
            tab === "signup" ? "bg-[#cbe6dc] text-[#0b6e66]" : "text-[#777]"
          }`}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>

      {tab === "login" ? (
        <div className="mt-7 space-y-4">
          <button
            type="button"
            className="flex h-16 w-full items-center justify-center gap-3 rounded border border-black/8 bg-white text-[20px] leading-none font-medium text-[#2f2b28]"
            onClick={handleGoogleLogin}
          >
            <GoogleLogoIcon size={28} />
            Continue with Google
          </button>
          <button
            type="button"
            className="h-16 w-full rounded border border-black/8 bg-white text-[20px] leading-none font-medium text-[#2f2b28]"
            onClick={() => setEmailMode("login")}
          >
            Continue with Email
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>
      ) : (
        <form className="mt-6 space-y-3.5" onSubmit={handleGuideSignupSubmit}>
          <p className="rounded border border-[#b6decf] bg-[#d9efe4] p-4 text-[13px] leading-[1.4] text-[#1e6757]">
            If you are a government-registered forest guide or a private naturalist who wants to share your knowledge
            and lead wildlife experiences, join our network and our team will personally reach out to help set up your
            profile within 24 hours.
          </p>
          <label className="block text-[16px] font-medium text-[#323232]">Full Name *</label>
          <input
            className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
            placeholder="Enter Full Name"
            value={guideForm.fullname}
            onChange={(event) => setGuideForm((prev) => ({ ...prev, fullname: event.target.value }))}
            required
          />
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="mb-2 block text-[16px] font-medium text-[#323232]">Location *</label>
              <input
                className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
                placeholder="e.g. Tadoba"
                value={guideForm.location}
                onChange={(event) => setGuideForm((prev) => ({ ...prev, location: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-[16px] font-medium text-[#323232]">Profession *</label>
              <div className="relative">
                <select
                  className="h-14 w-full appearance-none rounded border border-[#0b6e66] bg-white px-4 pr-12 text-[15px] text-[#2f2b28]"
                  value={guideForm.profession}
                  onChange={(event) =>
                    setGuideForm((prev) => ({
                      ...prev,
                      profession: event.target.value as GuideProfessionOption,
                    }))
                  }
                >
                  {GUIDE_PROFESSION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={24}
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#333]"
                />
              </div>
            </div>
          </div>
          <label className="block text-[16px] font-medium text-[#323232]">Contact Number *</label>
          <input
            className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
            placeholder="Enter Contact Info"
            value={guideForm.contact_number}
            onChange={(event) => setGuideForm((prev) => ({ ...prev, contact_number: event.target.value }))}
            required
          />
          <input
            type="email"
            className="h-14 w-full rounded border border-black/8 bg-white px-4 text-[15px] text-[#2f2b28]"
            placeholder="Enter Email"
            value={guideForm.email}
            onChange={(event) => setGuideForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <button
            type="submit"
            className="h-14 w-full rounded bg-(--color-wildbook-teal) text-[18px] leading-none font-semibold text-white disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit my Details"}
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      )}
    </div>
  );
}

export function LoginModalContent({ onClose, onSuccess, initialAudience = "explore" }: LoginModalContentProps) {
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const title = useMemo(() => "Login or sign up", []);
  const tabButton = (active: boolean) =>
    `h-12 rounded px-4 text-[16px] leading-none font-semibold transition-colors ${
      active ? "bg-(--color-wildbook-teal) text-white" : "bg-transparent text-[#767676]"
    }`;

  return (
    <section className="flex w-full max-w-[1120px] overflow-hidden bg-transparent shadow-2xl">
      <aside className="relative hidden min-h-[700px] w-[47%] lg:block">
        <img src={HERO_IMAGE_URL} alt="Wild landscape" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 p-12 text-white">
          <img src={logoDark} alt="wildbook" className="mb-10 w-auto" />
          <h3 className="max-w-[420px] text-[52px] leading-[0.95] font-bold tracking-[-0.03em]">
            Your gateway to the wild
          </h3>
          <p className="mt-6 max-w-[430px] text-[15px] leading-tight text-white/90">
            Sign in to explore, connect, and be part of a growing wildlife community.
          </p>
        </div>
      </aside>

      <div className="w-full bg-[#f7f6f2] px-9 py-10 lg:w-[53%]">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-[48px] leading-[0.95] font-bold text-[#121212]">{title}</h2>
          {onClose ? (
            <button type="button" onClick={onClose} aria-label="Close login popup" className="text-[#4a4a4a]">
              <XIcon size={34} />
            </button>
          ) : null}
        </header>

        <div className="grid h-16 grid-cols-2 gap-2 rounded bg-[#ecebe7] p-2">
          <button type="button" className={tabButton(audience === "explore")} onClick={() => setAudience("explore")}>
            I want to Explore
          </button>
          <button type="button" className={tabButton(audience === "guide")} onClick={() => setAudience("guide")}>
            I want to Guide
          </button>
        </div>

        {audience === "explore" ? (
          <ExploreAuthView key="explore-view" onSuccess={onSuccess} />
        ) : (
          <GuideAuthView key="guide-view" onSuccess={onSuccess} />
        )}
      </div>
    </section>
  );
}
