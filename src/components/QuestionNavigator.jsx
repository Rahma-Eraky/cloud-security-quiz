export default function QuestionNavigator({ quiz, attempt, current, onJump }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-muted">Questions</h2>
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-accent" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-line bg-surface" />
            Unanswered
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] gap-1.5">
        {quiz.questions.map((q, i) => {
          const answered = Boolean(attempt.answers[q.id])
          const isCurrent = i === current
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Question ${i + 1}, ${answered ? 'answered' : 'unanswered'}${isCurrent ? ', current' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={`tnum h-10 rounded-lg font-mono text-sm font-semibold transition-colors ${
                answered ? 'bg-accent text-on-accent hover:opacity-90' : 'border border-line bg-surface text-muted hover:bg-sunken'
              } ${isCurrent ? 'ring-2 ring-ink ring-offset-2 ring-offset-surface' : ''}`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
