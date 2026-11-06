import { useMemo, useState } from 'react'
import { formatPercent, grade } from '../lib/quiz.js'
import ReviewItem from './ReviewItem.jsx'
import { ArrowLeftIcon, RestartIcon } from './Icons.jsx'

function ScoreRing({ correct, total }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const fraction = total ? correct / total : 0
  return (
    <svg viewBox="0 0 128 128" className="h-36 w-36 shrink-0 sm:h-40 sm:w-40" aria-hidden="true">
      <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--sunken)" strokeWidth="12" />
      <circle
        cx="64"
        cy="64"
        r={radius}
        fill="none"
        stroke="var(--good)"
        strokeWidth="12"
        strokeLinecap={fraction > 0 && fraction < 1 ? 'round' : 'butt'}
        strokeDasharray={`${circumference * fraction} ${circumference}`}
        transform="rotate(-90 64 64)"
      />
      <text x="64" y="62" textAnchor="middle" fill="var(--ink)" fontFamily="var(--font-display)" fontSize="26" fontWeight="800">
        {correct}
      </text>
      <text x="64" y="82" textAnchor="middle" fill="var(--muted)" fontFamily="var(--font-mono)" fontSize="12">
        of {total}
      </text>
    </svg>
  )
}

function Stat({ label, value, tone }) {
  const color = tone === 'good' ? 'text-good' : tone === 'bad' ? 'text-bad' : 'text-ink'
  return (
    <div className="rounded-xl border border-line bg-bg px-4 py-3">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</div>
      <div className={`tnum mt-1 font-display text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
  )
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'correct', label: 'Correct' },
  { id: 'incorrect', label: 'Incorrect' },
  { id: 'unanswered', label: 'Not Answered' },
]

export default function Results({ quiz, attempt, onRestart, onHome }) {
  const result = useMemo(() => grade(quiz, attempt), [quiz, attempt])
  const [filter, setFilter] = useState('all')
  const counts = { all: result.total, correct: result.correct, incorrect: result.incorrect, unanswered: result.unanswered }
  const visible = filter === 'all' ? result.items : result.items.filter((item) => item.status === filter)

  return (
    <main className="gutter mx-auto max-w-4xl pb-16 pt-6 sm:pt-8">
      <section className="rise rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
          {quiz.title} · Results
        </p>
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <ScoreRing correct={result.correct} total={result.total} />
          <div className="w-full min-w-0 text-center sm:text-left">
            <h1 className="tnum font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Final Score: {result.correct}/{result.total} ({formatPercent(result.percent)})
            </h1>
            <p className="mt-1 text-muted">{quiz.subtitle}</p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Total" value={result.total} />
              <Stat label="Correct" value={result.correct} tone="good" />
              <Stat label="Incorrect" value={result.incorrect} tone="bad" />
              <Stat label="Unanswered" value={result.unanswered} />
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 sm:flex-row">
          <button
            type="button"
            onClick={onRestart}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 font-semibold text-on-accent transition-opacity hover:opacity-90"
          >
            <RestartIcon className="h-4 w-4" />
            Restart Quiz
          </button>
          <button
            type="button"
            onClick={onHome}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line px-6 font-semibold transition-colors hover:bg-sunken"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold">Answer Review</h2>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter review">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`tnum h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors ${
                  filter === f.id ? 'border-ink bg-ink text-bg' : 'border-line bg-surface text-muted hover:bg-sunken'
                }`}
              >
                {f.label} · {counts[f.id]}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {visible.map((item) => (
            <ReviewItem key={item.question.id} item={item} total={result.total} />
          ))}
          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line px-5 py-10 text-center text-muted">
              No questions in this group.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
