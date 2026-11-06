import { answeredCount, formatPercent, grade, quizzes } from '../lib/quiz.js'
import { ArrowRightIcon } from './Icons.jsx'

function statusOf(quiz, attempt) {
  const total = quiz.questions.length
  if (attempt.submitted) {
    const result = grade(quiz, attempt)
    return { tone: 'done', label: `Submitted · ${result.correct}/${total} (${formatPercent(result.percent)})`, action: 'View results' }
  }
  const answered = answeredCount(quiz, attempt)
  if (answered > 0) return { tone: 'progress', label: `In progress · ${answered}/${total} answered`, action: 'Continue' }
  return { tone: 'new', label: 'Not started', action: 'Start quiz' }
}

function StatusDot({ tone }) {
  const color = tone === 'done' ? 'bg-good' : tone === 'progress' ? 'bg-accent' : 'bg-line'
  return <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${color}`} />
}

function QuizCard({ quiz, attempt, onOpen, featured }) {
  const status = statusOf(quiz, attempt)
  return (
    <button
      type="button"
      onClick={() => onOpen(quiz.id)}
      className={`group flex w-full flex-col gap-4 rounded-2xl border bg-surface p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-accent sm:p-6 ${
        featured ? 'border-accent/40' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-md px-2 py-1 font-mono text-xs font-semibold tracking-wider ${
            featured ? 'bg-accent text-on-accent' : 'bg-accent-soft text-accent-ink'
          }`}
        >
          {quiz.code}
        </span>
        <span className="tnum font-mono text-xs text-muted">{quiz.questions.length} questions</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl font-bold leading-snug sm:text-[22px]">{quiz.title}</h3>
        <p className="mt-1 text-[15px] text-muted">{quiz.subtitle}</p>
        <p className="tnum mt-0.5 font-mono text-xs text-muted">{quiz.range}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="flex min-w-0 items-center gap-2 text-sm text-muted">
          <StatusDot tone={status.tone} />
          <span className="tnum truncate">{status.label}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent-ink">
          {status.action}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  )
}

export default function Home({ attempts, onOpen }) {
  const lectureQuizzes = quizzes.filter((q) => q.id !== 'full-exam')
  const full = quizzes.find((q) => q.id === 'full-exam')
  return (
    <main className="gutter mx-auto max-w-6xl pb-16 pt-10 sm:pt-14">
      <section className="max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">Question Bank · 80 questions</p>
        <h1 className="mt-3 font-display text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
          Practice for Virtualization and Cloud Security
        </h1>
        <p className="mt-4 text-[17px] text-muted">
          Pick a lecture quiz or take the full exam. Answers stay hidden until you submit. Your progress is saved in this
          browser, so you can refresh or come back later.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">Lecture quizzes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {lectureQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} attempt={attempts[quiz.id]} onOpen={onOpen} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">Complete exam</h2>
        <div className="mt-4">
          <QuizCard quiz={full} attempt={attempts[full.id]} onOpen={onOpen} featured />
        </div>
      </section>
    </main>
  )
}
