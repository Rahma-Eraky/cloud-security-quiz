import { optionFor } from '../lib/quiz.js'
import { CheckIcon, CrossIcon, DashIcon } from './Icons.jsx'

const BADGES = {
  correct: { label: 'Correct', className: 'bg-good-soft text-good border-good-line', Icon: CheckIcon },
  incorrect: { label: 'Incorrect', className: 'bg-bad-soft text-bad border-bad-line', Icon: CrossIcon },
  unanswered: { label: 'Not Answered', className: 'bg-sunken text-muted border-line', Icon: DashIcon },
}

function AnswerLine({ label, option, tone }) {
  const styles =
    tone === 'good'
      ? 'border-good-line bg-good-soft'
      : tone === 'bad'
        ? 'border-bad-line bg-bad-soft'
        : 'border-line bg-sunken'
  const iconColor = tone === 'good' ? 'text-good' : tone === 'bad' ? 'text-bad' : 'text-muted'
  const Icon = tone === 'good' ? CheckIcon : tone === 'bad' ? CrossIcon : DashIcon
  return (
    <div className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3 ${styles}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} strokeWidth={2.5} />
      <div className="min-w-0">
        <div className={`font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${iconColor}`}>{label}</div>
        <div className="mt-0.5 text-[16px] leading-snug">
          {option ? (
            <>
              <span className="font-bold">{option.letter}.</span> {option.text}
            </>
          ) : (
            <span className="text-muted">Not Answered</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReviewItem({ item, total }) {
  const { question, index, selected, status } = item
  const badge = BADGES[status]
  const chosen = selected ? optionFor(question, selected) : null
  const correct = optionFor(question, question.answer)
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="tnum font-mono text-xs font-semibold text-muted">
          Question {index + 1} of {total} · Bank #{question.id}
        </span>
        <span className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${badge.className}`}>
          <badge.Icon className="h-3.5 w-3.5" strokeWidth={3} />
          {badge.label}
        </span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{question.question}</h3>
      <div className="mt-4 flex flex-col gap-2">
        {status === 'correct' && <AnswerLine label="Your Answer" option={chosen} tone="good" />}
        {status === 'incorrect' && (
          <>
            <AnswerLine label="Your Answer" option={chosen} tone="bad" />
            <AnswerLine label="Correct Answer" option={correct} tone="good" />
          </>
        )}
        {status === 'unanswered' && (
          <>
            <AnswerLine label="Your Answer" option={null} tone="muted" />
            <AnswerLine label="Correct Answer" option={correct} tone="good" />
          </>
        )}
      </div>
    </article>
  )
}
