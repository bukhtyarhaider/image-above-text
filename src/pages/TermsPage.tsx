// src/components/TermsPage.tsx
import { useNavigate } from "react-router-dom";
import logoImg from "/src/assets/logo.png";

const TermsPage: React.FC = () => {
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
          Terms and Conditions
        </h2>
        <section className="space-y-6 text-brand-600">
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using Turquoise, you agree to be bound by these
              Terms and Conditions and our Privacy Policy. If you do not agree,
              please do not use our services.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              2. Use of Services
            </h3>
            <p>
              Turquoise provides an image editing platform. You may use our
              services for lawful purposes only. You agree not to upload or
              create content that is illegal, offensive, or infringes on others'
              rights.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              3. User Accounts
            </h3>
            <p>
              You must sign in with a Google account to access Turquoise. You
              are responsible for maintaining the confidentiality of your
              account and any activities under it.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              4. Intellectual Property
            </h3>
            <p>
              Content you create on Turquoise remains your property. By
              uploading content, you grant Turquoise a non-exclusive,
              royalty-free license to display and process it for the purpose of
              providing our services.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              5. Termination
            </h3>
            <p>
              We may suspend or terminate your account if you violate these
              terms. You may stop using Turquoise at any time.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              6. Limitation of Liability
            </h3>
            <p>
              Turquoise is provided “as is.” We are not liable for any damages
              arising from your use of our services, including data loss or
              service interruptions.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              7. Changes to Terms
            </h3>
            <p>
              We may update these terms periodically. Continued use of Turquoise
              after changes constitutes acceptance of the new terms.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-brand-700 mb-2">
              8. Contact Us
            </h3>
            <p>
              For questions about these terms, contact us at{" "}
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

export default TermsPage;
