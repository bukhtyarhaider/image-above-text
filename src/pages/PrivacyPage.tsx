import { useNavigate } from "react-router-dom";
import logoImg from "/src/assets/logo.png";

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4 sm:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Turquoise Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-brand-700">Turquoise</h1>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 text-sm font-medium transition-all duration-200"
        >
          Back to Home
        </button>
      </header>
      <main
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <h2 className="text-3xl font-bold text-brand-700 mb-6">
          Privacy Policy
        </h2>
        <section className="space-y-6 text-brand-600">
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              1. Introduction
            </h3>
            <p>
              At Turquoise, we value your privacy. This Privacy Policy explains
              how we collect, use, and protect your information when you use our
              image editing platform.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              2. Information We Collect
            </h3>
            <p>
              We collect:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  <strong>Account Information</strong>: Your Google account
                  details (name, email, profile picture) when you sign in.
                </li>
                <li>
                  <strong>User Content</strong>: Images and text you upload or
                  create on Turquoise.
                </li>
                <li>
                  <strong>Usage Data</strong>: Information about how you
                  interact with our platform, such as features used and session
                  duration.
                </li>
              </ul>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              3. How We Use Your Information
            </h3>
            <p>
              We use your information to:
              <ul className="list-disc pl-5 mt-2">
                <li>Provide and improve Turquoise’s services.</li>
                <li>Authenticate your account and ensure security.</li>
                <li>
                  Personalize your experience (e.g., display your name and
                  avatar).
                </li>
                <li>Analyze usage to enhance performance and features.</li>
              </ul>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              4. Sharing Your Information
            </h3>
            <p>
              We do not sell your data. We may share information:
              <ul className="list-disc pl-5 mt-2">
                <li>With Google for authentication purposes.</li>
                <li>As required by law or to protect our rights.</li>
                <li>
                  With service providers (e.g., Firebase) acting on our behalf.
                </li>
              </ul>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              5. Data Security
            </h3>
            <p>
              We use industry-standard measures to protect your data. However,
              no system is completely secure, and you use Turquoise at your own
              risk.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              6. Your Rights
            </h3>
            <p>
              You may:
              <ul className="list-disc pl-5 mt-2">
                <li>Access or delete your account data by contacting us.</li>
                <li>Stop using Turquoise at any time.</li>
              </ul>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              7. Cookies
            </h3>
            <p>
              We use cookies to manage authentication sessions. By using
              Turquoise, you consent to our use of cookies.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              8. Changes to This Policy
            </h3>
            <p>
              We may update this policy periodically. We will notify you of
              significant changes via email or in-app notices.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              9. Contact Us
            </h3>
            <p>
              For privacy questions, contact us at{" "}
              <a
                href="mailto:developedbybukhtyar@gmail.com"
                className="text-brand-500 hover:underline"
              >
                developedbybukhtyar@gmail.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPage;
