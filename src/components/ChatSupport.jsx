import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const faqs = [
  {
    keywords: ['rate', 'rating', 'review', 'star', 'rate a movie', 'rate movie', 'rate this movie', 'rating a movie', 'give a rating', 'how do i rate', 'how can i rate', 'how do i review', 'how can i review', 'write a review', 'leave a review', 'review a movie'],
    q: 'How do I rate a movie?',
    a: 'To rate a movie, open its detail page and select your desired star rating. You can also write a review. You\'ll need to be logged in to submit your rating or review.',
  },
  {
    keywords: ['account', 'sign up', 'signup', 'register', 'create account', 'make an account'],
    q: 'How do I create an account?',
    a: 'Just click "Continue with Google" in the top right corner. There\'s no separate sign-up form — logging in with Google automatically creates your account.',
  },
  {
    keywords: ['edit review', 'delete review', 'change review', 'remove review', 'edit', 'delete'],
    q: 'Can I edit or delete my review?',
    a: 'Currently, each review is permanent once submitted, and you can only review a movie once. Editing support may be added in the future.',
  },
  {
    keywords: ['watched', 'mark as watched', 'watch list', 'watchlist', 'watched movies'],
    q: 'What does "Mark as Watched" do?',
    a: 'It lets you keep track of movies you\'ve already seen, separate from rating or reviewing them. This is saved to your account and only visible to you.',
  },
  {
    keywords: ['popular', 'views', 'view count', 'trending'],
    q: 'How is the "Popular" section calculated?',
    a: 'It reflects how many times a movie\'s detail page has been viewed on FilmScorePH — not YouTube\'s own view count.',
  },
  {
    keywords: ['bug', 'broken', 'problem', 'issue', 'error', 'not working', 'report'],
    q: 'I found a bug or broken link. What do I do?',
    a: 'You can use the "Report a Problem" link at the bottom of this chat to let us know. We\'ll look into it as soon as possible.',
  },
  {
    keywords: ['login', 'log in', 'sign in', 'google'],
    q: 'How do I log in?',
    a: 'Click "Continue with Google" in the navigation bar. You\'ll be signed in using your Google account — no separate password is needed.',
  },
  {
    keywords: ['donate', 'donation', 'support', 'gcash', 'maribank'],
    q: 'How can I support the site?',
    a: 'You can donate via GCash, MariBank, or bank transfer on our Donate page. Every contribution helps keep FilmScorePH running.',
  },
  {
    keywords: ['genre', 'filter', 'search', 'find movie', 'find a movie', 'look for a movie'],
    q: 'How do I find a specific type of movie?',
    a: 'Use the search bar and filters above the "All Movies" section to narrow down movies by genre, type, language, or sorting.',
  },
]

const defaultOptions = [
  'How do I rate a movie?',
  'How do I create an account?',
  'How do I find a movie?',
]

const moreOptions = [
  'How do I log in?',
  'What does Mark as Watched do?',
  'How is Popular calculated?',
]

const friendlyReplies = {
  greeting: [
    "Hi! 👋 Welcome to FilmScorePH. How can I help you today?",
    "Hello! 👋 I'm the FilmScorePH Assistant. What would you like to know?",
    "Hey there! 👋 What can I help you with today?",
    "Hi there! 🎬 Great to see you. What do you need help with?",
  ],
  howAreYou: [
    "I'm doing great, thanks for asking! 😊 How can I help you with FilmScorePH?",
    "I'm doing well! Thanks for asking. 😊 What would you like to know?",
    "I'm good! Ready to help you explore FilmScorePH. 🎬",
    "Doing great over here! What can I help you find today?",
  ],
  howCanIHelp: [
    "Of course! 😊 Here are a few things I can help you with:",
    "Absolutely! 🎬 You can choose a question below, or type your own.",
    "Sure! Here are some things you can ask me about:",
    "Happy to help! Here's a good place to start:",
  ],
  followUp: [
    "Is there anything else you'd like to know?",
    "What else would you like to know?",
    "Is there anything else I can help you with?",
    "Would you like to know something else about FilmScorePH?",
    "What other question can I help you with?",
  ],
  ending: [
    "Thank you for using the FilmScorePH Assistant! 🎬 Enjoy exploring the movies!",
    "Thanks for using the FilmScorePH Assistant! 😊 Enjoy FilmScorePH!",
    "You're all set! 🎬 Thank you for using the FilmScorePH Assistant!",
    "Glad I could help! Thanks for stopping by the FilmScorePH Assistant. 🎬",
  ],
  thanks: [
    "You're welcome! 😊",
    "Happy to help! 🎬",
    "No problem! 😊",
    "Anytime! 🎬",
  ],
}

function getRandomReply(replies) {
  return replies[Math.floor(Math.random() * replies.length)]
}

function isMatch(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase))
}

function getOptionsForQuestion(question) {
  const text = question.toLowerCase()
  if (text.includes('rate') || text.includes('rating') || text.includes('review')) return moreOptions
  if (text.includes('account') || text.includes('sign up') || text.includes('signup') || text.includes('register')) {
    return ['How do I log in?', 'How do I rate a movie?', 'What does Mark as Watched do?']
  }
  if (text.includes('login') || text.includes('log in') || text.includes('sign in')) {
    return ['How do I rate a movie?', 'How do I create an account?', 'How do I find a movie?']
  }
  if (text.includes('watched') || text.includes('popular')) {
    return ['How do I rate a movie?', 'How do I find a movie?', 'How can I support the site?']
  }
  if (text.includes('donate') || text.includes('support')) {
    return ['How do I rate a movie?', 'How do I create an account?', 'How do I find a movie?']
  }
  if (text.includes('bug') || text.includes('problem') || text.includes('broken')) {
    return ['How do I rate a movie?', 'How do I log in?', 'How can I support the site?']
  }
  return defaultOptions
}

function findAnswer(input) {
  const text = input.toLowerCase().trim()

  if (isMatch(text, ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'])) {
    return { text: getRandomReply(friendlyReplies.greeting), shouldAskFollowUp: true, options: defaultOptions }
  }
  if (isMatch(text, ['how are you', 'how r u', 'how are u', 'how do you feel', 'are you okay', 'are you doing well'])) {
    return { text: getRandomReply(friendlyReplies.howAreYou), shouldAskFollowUp: true, options: defaultOptions }
  }
  if (isMatch(text, ['how can i help', 'how may i help', 'what can i help', 'what do you need help', 'how can i assist'])) {
    return { text: getRandomReply(friendlyReplies.howCanIHelp), shouldAskFollowUp: false, options: defaultOptions }
  }
  if (isMatch(text, ['no', 'none', 'nothing', 'nothing else', 'nope', 'nah', "that's all", 'thats all', 'i am good', "i'm good", 'im good', 'all good', 'no more questions', 'no more'])) {
    return { text: getRandomReply(friendlyReplies.ending), shouldAskFollowUp: false, options: [] }
  }
  if (isMatch(text, ['thank you', 'thanks', 'thank u', 'ty', 'appreciate it', 'much appreciated'])) {
    return { text: getRandomReply(friendlyReplies.thanks), shouldAskFollowUp: true, options: defaultOptions }
  }

  for (const faq of faqs) {
    if (faq.keywords.some((keyword) => text.includes(keyword))) {
      return { text: faq.a, shouldAskFollowUp: true, options: getOptionsForQuestion(input) }
    }
  }

  return {
    text: "I'm not sure about that one. Try one of the options below, or ask me about ratings, reviews, accounts, login, watchlists, donations, movie searches, or reporting a problem.",
    shouldAskFollowUp: true,
    options: defaultOptions,
  }
}

const initialMessage = { from: 'bot', text: "Hi! 👋 Welcome to FilmScorePH. How can I help you today?", options: defaultOptions }

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex justify-start"
    >
      <div className="bg-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 bg-gray-500 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ChatSupport() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([initialMessage])
  const scrollRef = useRef(null)
  const resetTimerRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  // Reset the conversation 20s after the panel is closed
  useEffect(() => {
    if (!open) {
      resetTimerRef.current = setTimeout(() => {
        setMessages([initialMessage])
      }, 20000)
    } else {
      clearTimeout(resetTimerRef.current)
    }
    return () => clearTimeout(resetTimerRef.current)
  }, [open])

  const sendQuestion = (question) => {
    const trimmed = question.trim()
    if (!trimmed) return

    const result = findAnswer(trimmed)
    const userMsg = { from: 'user', text: trimmed }

    setMessages(prev => [...prev.map(m => ({ ...m, options: undefined })), userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: result.text, options: result.shouldAskFollowUp ? undefined : result.options },
      ])

      if (result.shouldAskFollowUp && result.options?.length > 0) {
        setTimeout(() => {
          setTyping(true)
          setTimeout(() => {
            setTyping(false)
            setMessages(prev => [
              ...prev,
              { from: 'bot', text: getRandomReply(friendlyReplies.followUp), options: result.options },
            ])
          }, 600)
        }, 300)
      }
    }, 700)
  }

  const handleSend = (e) => {
    e.preventDefault()
    sendQuestion(input)
  }

  return (
    <>
      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="Chat support"
        className="fixed bottom-10 right-10 z-50 w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-950/50 transition-all hover:scale-110"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-black rounded-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 right-10 z-50 w-[90vw] max-w-sm h-[28rem] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-900">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-red-600/15 flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">A</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-950 rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">FilmScorePH Assistant</h3>
                <p className="text-green-500 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Online
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-500 hover:text-white text-lg transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 [scrollbar-width:thin] [scrollbar-color:#374151_#0a0a0a]"
            >
              {messages.map((m, i) => (
                <div key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        m.from === 'user'
                          ? 'bg-red-600 text-white rounded-br-sm'
                          : 'bg-gray-900 text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>

                  {m.options?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3 max-w-[85%]">
                      {m.options.map((option, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.06 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => sendQuestion(option)}
                          className="text-left text-xs text-gray-300 bg-gray-900 border border-gray-800 hover:border-red-600 hover:text-white rounded-xl px-3 py-2.5 transition-colors"
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <AnimatePresence>
                {typing && <TypingIndicator />}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 px-3 pt-3 pb-4">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 flex-shrink-0 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </form>

            <Link
              to="/report"
              className="flex items-center justify-center gap-2 mx-3 mb-3 py-2.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-900 hover:bg-red-600/10 border border-gray-800 hover:border-red-600/50 rounded-full transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Report a Problem
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatSupport