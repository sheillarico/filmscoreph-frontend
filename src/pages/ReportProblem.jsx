import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { submitReport } from '../services/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function ReportProblem() {
  const { user, token } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!message.trim()) {
      setError('Please describe the problem before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await submitReport(token, message.trim())
      setSubmitted(true)
      setMessage('')
    } catch (err) {
      setError(
        'Something went wrong submitting your report. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative text-white">
      <Navbar />

      <main className="relative max-w-2xl mx-auto px-6 py-14">
        <h1 className="text-3xl font-bold mb-2">
          Report a Problem
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Found a bug, broken link, or something not working right?
          Let us know below.
        </p>

        {!user ? (
          <div className="bg-gray-950/80 border border-gray-900 rounded-xl p-6 text-center">
            <p className="text-gray-300 text-sm mb-5">
              You need to be logged in to submit a report. This helps
              us follow up with you if we need more details.
            </p>

            <a
              href="https://filmscoreph-backend-production.up.railway.app/oauth2/authorization/google"
              onClick={() =>
                localStorage.setItem(
                  'preLoginPath',
                  window.location.pathname
                )
              }
              className="inline-block px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-red-950/40"
            >
              Continue with Google
            </a>
          </div>
        ) : submitted ? (
          <div className="bg-gray-950/80 border border-gray-900 rounded-xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center">
              <span className="text-green-400 text-xl">✓</span>
            </div>

            <h2 className="text-lg font-semibold mb-2">
              Report Submitted
            </h2>

            <p className="text-gray-300 text-sm mb-5">
              Thanks for the report! Our team will review it and
              follow up if needed.
            </p>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setError('')
              }}
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-950/80 border border-gray-900 rounded-xl p-6"
          >
            <label
              htmlFor="report-message"
              className="text-sm text-gray-400 mb-2 block"
            >
              Describe the issue
            </label>

            <textarea
              id="report-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (error) setError('')
              }}
              placeholder="Tell us what went wrong..."
              className="w-full bg-gray-900 border border-gray-800 focus:border-red-900/50 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors resize-none"
              rows={6}
              maxLength={2000}
              required
            />

            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-600 text-xs">
                {message.length}/2000
              </p>

              {error && (
                <p className="text-red-400 text-xs">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-full text-sm font-semibold transition-all hover:scale-105 shadow-lg shadow-red-950/40 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send Report'}
            </button>

            <p className="text-gray-600 text-xs mt-3">
              This will be sent directly to our team through the
              system.
            </p>
          </form>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ReportProblem