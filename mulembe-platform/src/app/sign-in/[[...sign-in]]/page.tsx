import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4 position-relative"
      style={{
        background: "radial-gradient(ellipse at top, #0d3824 0%, #05160e 100%)",
      }}
    >
      <div className="position-absolute top-0 start-0 p-4">
        <Link
          href="/"
          className="btn btn-glass d-inline-flex align-items-center gap-2 text-decoration-none"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="text-center mb-4">
        <h1
          className="display-6 fw-bold mb-2"
          style={{
            fontFamily: "var(--font-serif)",
            background: "linear-gradient(135deg, #f5e6b3 0%, #d4af37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Mulembe National Platform
        </h1>
        <p className="text-white-50 small mb-0">
          Sign in to your verified community membership
        </p>
      </div>

      <div className="glass-card p-3 shadow-lg border-0" style={{ maxWidth: 460 }}>
        <SignIn
          appearance={{
            elements: {
              card: "bg-transparent shadow-none border-0",
              formButtonPrimary:
                "btn-gold fw-semibold shadow-sm text-dark border-0",
              footerActionLink: "text-warning",
            },
          }}
        />
      </div>
    </div>
  );
}
