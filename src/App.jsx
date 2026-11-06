import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Home from './components/Home.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './components/Results.jsx'
import { emptyAttempt, getQuiz, quizzes, sanitizeAttempt } from './lib/quiz.js'
import { load, remove, save } from './lib/storage.js'

function initialView() {
  const view = load('view', null)
  if (view && view.quizId && getQuiz(view.quizId)) return { quizId: view.quizId }
  return { quizId: null }
}

function initialAttempts() {
  return Object.fromEntries(quizzes.map((quiz) => [quiz.id, sanitizeAttempt(quiz, load(`attempt:${quiz.id}`, null))]))
}

function prefersDark() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

export default function App() {
  const [theme, setTheme] = useState(() => load('theme', 'system'))
  const [view, setView] = useState(initialView)
  const [attempts, setAttempts] = useState(initialAttempts)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
    save('theme', theme)
  }, [theme])

  useEffect(() => {
    save('view', view)
  }, [view])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const dark = current === 'dark' || (current === 'system' && prefersDark())
      return dark ? 'light' : 'dark'
    })
  }, [])

  const updateAttempt = useCallback((quizId, next) => {
    setAttempts((all) => ({ ...all, [quizId]: next }))
    save(`attempt:${quizId}`, next)
  }, [])

  const restart = useCallback((quizId) => {
    remove(`attempt:${quizId}`)
    setAttempts((all) => ({ ...all, [quizId]: emptyAttempt() }))
    window.scrollTo({ top: 0 })
  }, [])

  const openQuiz = (quizId) => {
    setView({ quizId })
    window.scrollTo({ top: 0 })
  }

  const goHome = () => {
    setView({ quizId: null })
    window.scrollTo({ top: 0 })
  }

  const quiz = view.quizId ? getQuiz(view.quizId) : null
  const attempt = quiz ? attempts[quiz.id] : null
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark())

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header onHome={goHome} onToggleTheme={toggleTheme} isDark={isDark} showHome={Boolean(quiz)} />
      {!quiz && <Home attempts={attempts} onOpen={openQuiz} />}
      {quiz && !attempt.submitted && (
        <Quiz
          key={quiz.id}
          quiz={quiz}
          attempt={attempt}
          onChange={(next) => updateAttempt(quiz.id, next)}
          onSubmit={() => {
            updateAttempt(quiz.id, { ...attempt, submitted: true })
            window.scrollTo({ top: 0 })
          }}
          onRestart={() => restart(quiz.id)}
          onHome={goHome}
        />
      )}
      {quiz && attempt.submitted && (
        <Results key={quiz.id} quiz={quiz} attempt={attempt} onRestart={() => restart(quiz.id)} onHome={goHome} />
      )}
    </div>
  )
}
