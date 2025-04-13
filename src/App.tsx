import { AuthProvider, useAuth } from "./context/AuthContext";
import Editor from "./components/Editor";
import AuthPage from "./components/AuthPage";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-50">
        <div className="text-brand-500 text-center">
          <div className="w-12 h-12 mb-2 relative mx-auto">
            <div className="absolute w-full h-full rounded-full animate-spin border-2 border-transparent [border-top-color:theme(colors.brand.300)] [border-bottom-color:theme(colors.brand.100)]">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0%,theme(colors.brand.300)_30%,theme(colors.brand.100)_70%,transparent_100%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
              <div className="absolute inset-[3px] bg-brand-100 rounded-full" />
            </div>
          </div>
          Loading...
        </div>
      </div>
    );
  }

  return user ? <Editor /> : <AuthPage />;
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
