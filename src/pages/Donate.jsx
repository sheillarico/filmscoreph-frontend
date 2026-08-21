import { useState } from 'react'
import Navbar from '../components/Navbar'
import CinematicBackground from '../components/CinematicBackground'
import Footer from '../components/Footer'

const paymentMethods = {
  gcash: {
    label: 'GCash',
    accountName: 'Sheilla Mae Rico',
    accountNumber: '0917 123 4567',
    fieldLabel: 'GCash Number',
    qrImage: '/qr-gcash.png',
  },
  maribank: {
    label: 'MariBank',
    accountName: 'Sheilla Mae Rico',
    accountNumber: '1234567890',
    fieldLabel: 'Account Number',
    qrImage: '/qr-maribank.png',
  },
  other: {
    label: 'BDO',
    accountName: 'Sheilla Mae Rico',
    accountNumber: '1234-5678-9012',
    fieldLabel: 'Account Number',
    qrImage: '/bdo.jpg',
  },
}

function Donate() {
  const [activeTab, setActiveTab] = useState('gcash')
  const [copied, setCopied] = useState(false)
  const [qrError, setQrError] = useState(false)

  const method = paymentMethods[activeTab]

  const handleCopy = () => {
    navigator.clipboard.writeText(method.accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    setCopied(false)
    setQrError(false)
  }

  return (
    <div className="min-h-screen relative text-white">
      <CinematicBackground />
      <Navbar />

      <div className="relative max-w-md mx-auto px-6 pt-6 pb-14 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-600/10 flex items-center justify-center mb-4">
          <span className="text-red-500 text-2xl">♥</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Support FilmScorePH</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
          Help keep FilmScorePH running without ads. Your support goes toward hosting and new features.
        </p>

        <div className="bg-gray-950/80 border border-gray-900 rounded-2xl p-6 min-h-[520px] flex flex-col">
          <label className="block text-left text-xs text-gray-500 uppercase tracking-wide mb-2">
            Choose a payment method
          </label>
          <div className="relative mb-5">
            <select
              value={activeTab}
              onChange={e => handleTabChange(e.target.value)}
              className="w-full appearance-none bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl px-4 py-3 pr-10 cursor-pointer transition-colors shadow-lg shadow-red-950/40 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {Object.entries(paymentMethods).map(([key, m]) => (
                <option key={key} value={key} className="bg-gray-900 text-white">
                  {m.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white text-xs">
              ▼
            </span>
          </div>

          <div className="mb-5 flex justify-center">
            {method.qrImage && !qrError ? (
              <img
                src={method.qrImage}
                alt={`${method.label} QR code`}
                onError={() => setQrError(true)}
                className="w-40 h-40 rounded-xl border border-gray-800 object-contain bg-white p-2"
              />
            ) : (
              <div className="w-40 h-40 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 text-xs text-center px-4">
                {method.qrImage ? 'QR code coming soon' : 'No QR available for this method'}
              </div>
            )}
          </div>

          <div className="bg-gray-900 rounded-xl p-4 text-left space-y-3">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Account Name</p>
              <p className="text-white text-sm font-medium">{method.accountName}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{method.fieldLabel}</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-white text-sm font-medium tracking-wide">{method.accountNumber}</p>
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-full font-medium transition-all hover:scale-105 shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-xs pt-4">
            The {method.label} account details above are just placeholders.
          </p>
        </div>

        <p className="text-gray-600 text-xs mt-6">
          Every contribution, big or small, is genuinely appreciated. Thank you for supporting Filipino cinema.
        </p>
      </div>

      <Footer />
    </div>
  )
}

export default Donate