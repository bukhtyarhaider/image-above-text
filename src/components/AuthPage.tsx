import { useAuth } from "../context/AuthContext";
import GoogleIcon from "../assets/google-logo.svg";
import logoImg from "/src/assets/logo.png";

const AuthPage = () => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error("Sign-in error:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img src={logoImg} alt="Turquoise Logo" className="h-12" />
        </div>
        <h1 className="text-3xl font-bold text-brand-700 text-center mb-4">
          Welcome to Turquoise
        </h1>
        <p className="text-brand-500 text-center mb-8">
          Sign in to start creating amazing designs!
        </p>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={`w-full py-3 flex items-center justify-center gap-3 rounded-lg font-semibold text-base transition-all duration-300 ${
            loading
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white border border-brand-200 text-brand-700 hover:bg-brand-50"
          } shadow-sm`}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
          {loading ? "Signing In..." : "Sign in with Google"}
        </button>
        <p className="text-xs text-brand-400 text-center mt-6">
          By signing in, you agree to our{" "}
          <a href="/terms" className="underline hover:text-brand-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-brand-600">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
