import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-red-950/10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-600 rounded-full" />
              About
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              FilmScorePH is a community-driven platform for discovering, rating, and discussing Filipino movies, series, and documentaries. Whether you're looking for your next watch or want to share your thoughts, FilmScorePH brings Filipino film enthusiasts together in one place to celebrate Philippine cinema.
            </p>
          </div>

          {/* Support */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center">
                <Heart size={16} className="text-red-500" />
              </div>
              <h3 className="text-white font-semibold text-base">Support FilmScorePH</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Support FilmScorePH and help keep it running without ads. Your contribution goes toward hosting, maintenance, and the development of new features for the community.
            </p>

            <Link to="/donate" className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-full transition-colors shadow-lg shadow-red-950/40">
              <Heart size={14} />
              Donate
            </Link>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-600 rounded-full" />
              Follow Us
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </div>
                <span className="text-sm">FilmScorePH</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span className="text-sm">@filmscoreph</span>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-sm">@filmscoreph</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-500 text-sm">
          <p className="flex items-center gap-1.5">
            Developed by Sheilla Mae Rico
            <span className="text-gray-700">·</span>
            © {new Date().getFullYear()} FilmScorePH
          </p>

          <div className="flex gap-6">
            <Link to="/report" className="hover:text-gray-300 transition-colors">Report a Problem</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer