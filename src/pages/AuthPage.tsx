import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import GoogleIcon from "../assets/google-logo.svg";
import logoImg from "/src/assets/logo.png";
import { Link } from "react-router-dom";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import toast, { Toaster } from "react-hot-toast";

const AuthPage = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [init, setInit] = useState(false);

  // Initialize particles with error handling
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      try {
        await loadSlim(engine);
        setInit(true);
      } catch (error) {
        console.error("Failed to initialize particles:", error);
        setInit(false);
      }
    }).catch((error) => {
      console.error("Particles engine error:", error);
      setInit(false);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-300 to-brand-500 bg-[length:200%_200%] animate-[gradientFlow_10s_ease_infinite] z-0 motion-reduce:bg-gradient-to-br motion-reduce:from-brand-50 motion-reduce:to-brand-100" />
      {init && (
        <Particles
          id="tsparticles"
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            particles: {
              number: {
                value: 100,
                density: { enable: true },
              },
              color: { value: ["#5de7f3", "#b3ffab", "#0d3b66"] },
              shape: { type: ["circle"] },
              opacity: {
                value: { min: 0.4, max: 0.8 },
              },
              size: { value: { min: 5, max: 8 } },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                outModes: { default: "bounce" },
              },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "grab" },
                onClick: { enable: true, mode: "push" },
              },
              modes: { grab: { distance: 150 }, push: { quantity: 2 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-1"
          aria-hidden="true"
        />
      )}
      {/* Main Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full animate-[fadeIn_0.6s_cubic-bezier(0.4,0,0.2,1)] z-10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300">
        <div className="flex justify-center mb-6">
          <img
            src={logoImg}
            alt="Turquoise Logo"
            className="h-16 animate-[logoBounce_1.2s_cubic-bezier(0.68,-0.55,0.27,1.55)]"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-brand-700 text-center mb-4 tracking-tight leading-tight">
          Welcome to Turquoise
        </h1>
        <p className="text-brand-500 text-center mb-8 text-lg font-medium">
          Sign in to unleash your creativity!
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-3.5 flex items-center justify-center gap-3 rounded-xl font-semibold text-base transition-all duration-200 ${
            loading
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
          } shadow-sm disabled:scale-100 focus:ring-2 focus:ring-brand-300 focus:ring-offset-2`}
          aria-label={loading ? "Signing in" : "Sign in with Google"}
        >
          {loading ? (
            <svg
              className="w-5 h-5 animate-spin text-brand-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
          ) : (
            <img
              src={GoogleIcon}
              alt="Google Logo"
              className="w-5 h-5"
              aria-hidden="true"
            />
          )}
          {loading ? "Signing In..." : "Sign in with Google"}
        </button>
        <p className="text-sm text-brand-500 text-center mt-6 leading-relaxed">
          By signing in, you agree to our{" "}
          <Link
            to="/terms"
            className="underline text-brand-600 hover:text-brand-700 font-semibold transition-colors duration-200"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline text-brand-600 hover:text-brand-700 font-semibold transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#0d3b66",
            border: "1px solid #5de7f3",
            borderRadius: "1rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "12px 16px",
          },
        }}
      />
    </div>
  );
};

export default AuthPage;
