import Navbar from '../components/Navbar'
import CinematicBackground from '../components/CinematicBackground'
import Footer from '../components/Footer'

function PrivacyPolicy() {
  return (
    <div className="min-h-screen relative text-white">
      <CinematicBackground />
      <Navbar />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: July 30, 2026</p>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          FilmScorePH respects your privacy and is committed to protecting your personal information.
        </p>

        <Section title="1. Information We Collect">
          <p className="mb-2">We may collect:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Name or username</li>
            <li>Email address</li>
            <li>Ratings and reviews you submit</li>
            <li>Comments and interactions</li>
            <li>Technical information such as browser type, device information, and IP address</li>
            <li>Cookies and usage analytics</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <p className="mb-2">Your information is used to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Create and manage your account</li>
            <li>Display your reviews and ratings</li>
            <li>Improve website functionality</li>
            <li>Respond to inquiries and support requests</li>
            <li>Prevent fraud and maintain platform security</li>
          </ul>
        </Section>

        <Section title="3. Cookies">
          <p className="mb-2">FilmScorePH may use cookies to improve your browsing experience, remember preferences, and analyze website traffic.</p>
          <p>You may disable cookies through your browser settings, although some features may not function properly.</p>
        </Section>

        <Section title="4. Sharing Information">
          <p className="mb-2">We do not sell your personal information.</p>
          <p className="mb-2">We may share information only when:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Required by law</li>
            <li>Necessary to protect our rights or users</li>
            <li>Working with trusted service providers that help operate the website</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          We take reasonable security measures to protect your information from unauthorized access, alteration, or disclosure. However, no online system can guarantee absolute security.
        </Section>

        <Section title="6. Third-Party Services">
          FilmScorePH may include links to third-party websites, trailers, or social media platforms. Their privacy practices are governed by their own policies.
        </Section>

        <Section title="7. Your Rights">
          <p className="mb-2">Depending on applicable laws, you may have the right to:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and personal data</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </Section>

        <Section title="8. Children's Privacy">
          FilmScorePH is not intended for children under the age required by applicable law. We do not knowingly collect personal information from children.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy periodically. Any changes will be posted on this page with the updated revision date.
        </Section>

        <Section title="10. Contact Us">
          If you have questions about this Privacy Policy or your personal information, please contact us through our official support channels.
        </Section>
      </div>

      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <span className="w-1 h-4 bg-red-600 rounded-full" />
        {title}
      </h2>
      <div className="text-gray-300 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export default PrivacyPolicy