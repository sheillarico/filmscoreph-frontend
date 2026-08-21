import {
  useState,
} from 'react'

import {
  Ban,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

const API_BASE =
  'http://localhost:8081/api'

function BlockedAccount() {
  const navigate =
    useNavigate()

  const [message, setMessage] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)

  const [submitted, setSubmitted] =
    useState(false)

  const [error, setError] =
    useState('')

  const handleSubmit =
    async (e) => {
      e.preventDefault()

      const trimmedMessage =
        message.trim()

      if (!trimmedMessage) {
        setError(
          'Please enter a message before submitting.'
        )

        return
      }

      setSubmitting(true)
      setError('')

      try {
        const response =
          await fetch(
            `${API_BASE}/reports/blocked-account`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type':
                  'application/json',
              },
              body: JSON.stringify({
                message:
                  trimmedMessage,
              }),
            }
          )

        const data =
          await response
            .json()
            .catch(() => null)

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              'Unable to submit your message.'
          )
        }

        setSubmitted(true)
        setMessage('')
      } catch (error) {
        console.error(
          'Failed to submit blocked account report:',
          error
        )

        setError(
          error?.message ||
            'Unable to submit your message. Please try again.'
        )
      } finally {
        setSubmitting(false)
      }
    }

  return (
    <div className="relative z-[100] min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-sm">

        {/* ==================================================
            CARD
        ================================================== */}

        <div className="bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="px-5 py-5 text-center border-b border-gray-800">

            <div className="mx-auto w-11 h-11 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center">

              {submitted ? (
                <CheckCircle2
                  size={21}
                  className="text-emerald-400"
                />
              ) : (
                <Ban
                  size={21}
                  className="text-red-400"
                />
              )}

            </div>

            <h1 className="text-lg font-semibold text-white mt-3">
              {submitted
                ? 'Message Submitted'
                : 'Unable to Log In'}
            </h1>

            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              {submitted
                ? 'Your message has been sent to the FilmScore PH administrators for review.'
                : 'Your account has been blocked and cannot currently access FilmScore PH or some of its features.'}
            </p>

          </div>

          {/* ==================================================
              SUBMITTED
          ================================================== */}

          {submitted ? (
            <div className="p-5">

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5">

                <div className="flex gap-2.5">

                  <CheckCircle2
                    size={17}
                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                  />

                  <div>

                    <p className="text-xs font-medium text-emerald-300">
                      Appeal received
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                      An administrator can review your account and decide whether access should be restored.
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate('/')
                }
                className="w-full mt-4 px-4 py-2 rounded-lg border border-gray-800 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
              >
                Return to Home
              </button>

            </div>
          ) : (

            /* ==================================================
               FORM
            ================================================== */

            <form
              onSubmit={
                handleSubmit
              }
              className="p-5"
            >

              {/* INFO */}

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 mb-4">

                <div className="flex gap-2.5">

                  <AlertCircle
                    size={16}
                    className="text-amber-400 mt-0.5 flex-shrink-0"
                  />

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Send a message to the administrators below if you believe your account was blocked by mistake.
                  </p>

                </div>

              </div>

              {/* MESSAGE */}

              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Message to Administrator
              </label>

              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(
                    e.target.value
                  )

                  setError('')
                }}
                disabled={
                  submitting
                }
                rows={5}
                maxLength={2000}
                placeholder="Explain why you believe your account should be reviewed..."
                className="w-full resize-none bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors disabled:opacity-50"
              />

              <div className="flex justify-end mt-1">

                <span className="text-[10px] text-gray-700">
                  {message.length}/2000
                </span>

              </div>

              {error && (
                <p className="text-[11px] text-red-400 mt-2">
                  {error}
                </p>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !message.trim()
                }
                className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-xs font-semibold text-white transition-all disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                <Send size={14} />

                {submitting
                  ? 'Sending...'
                  : 'Send Message'}
              </button>

            </form>
          )}

        </div>

        <p className="text-center text-[10px] text-gray-700 mt-3">
          FilmScore PH
        </p>

      </div>
    </div>
  )
}

export default BlockedAccount