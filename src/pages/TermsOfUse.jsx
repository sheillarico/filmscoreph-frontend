import Navbar from '../components/Navbar'
import CinematicBackground from '../components/CinematicBackground'
import Footer from '../components/Footer'

function TermsOfUse() {
  return (
    <div className="min-h-screen relative text-white">
      <CinematicBackground />
      <Navbar />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
        <p className="text-gray-500 text-sm mb-8">Last Updated: July 30, 2026</p>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          Welcome to FilmScorePH. By accessing or using this website, you agree to comply with these Terms of Use. If you do not agree with any part of these terms, please do not use the platform.
        </p>

        <Section title="1. Acceptance of Terms">
          By using FilmScorePH, you acknowledge that you have read, understood, and agreed to these Terms of Use.
        </Section>

        <Section title="2. Purpose of FilmScorePH">
          FilmScorePH is a community-driven platform that allows users to discover, rate, review, and discuss Filipino movies, series, and documentaries.
        </Section>

        <Section title="3. User Conduct">
          <p className="mb-2">You agree to use FilmScorePH responsibly and respectfully. Users must not:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 mb-2">
            <li>Post illegal, offensive, abusive, or hateful content.</li>
            <li>Harass or impersonate other users.</li>
            <li>Upload malicious software or attempt to disrupt the website.</li>
            <li>Violate intellectual property rights.</li>
            <li>Manipulate ratings or spam reviews.</li>
          </ul>
          <p>FilmScorePH reserves the right to remove content or suspend accounts that violate these rules.</p>
        </Section>

        <Section title="4. User Content">
          You retain ownership of reviews, comments, and ratings you submit. By posting content, you grant FilmScorePH permission to display, store, and distribute that content on the platform.
        </Section>

        <Section title="5. Intellectual Property">
          <p className="mb-2">Unless otherwise stated, the website design, logo, branding, and original content are the property of FilmScorePH.</p>
          <p>Movie posters, trailers, and other media belong to their respective copyright owners and are displayed for informational purposes only.</p>
        </Section>

        <Section title="6. Disclaimer">
          FilmScorePH provides information and community opinions for entertainment and educational purposes. We do not guarantee the accuracy, completeness, or availability of all content.
        </Section>

        <Section title="7. Limitation of Liability">
          FilmScorePH is not responsible for any damages or losses resulting from the use of this website or reliance on its content.
        </Section>

        <Section title="8. Changes to These Terms">
          We may update these Terms of Use at any time. Continued use of the website constitutes acceptance of the revised terms.
        </Section>

        <Section title="9. Contact">
          If you have questions regarding these Terms of Use, please contact us through our official support channels.
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

export default TermsOfUse