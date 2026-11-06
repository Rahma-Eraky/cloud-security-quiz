import { useCallback, useRef, useState } from 'react'
import { answeredCount } from '../lib/quiz.js'
import AnswerOption from './AnswerOption.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import QuestionNavigator from './QuestionNavigator.jsx'
import { ArrowLeftIcon, ArrowRightIcon, RestartIcon } from './Icons.jsx'

export default function Quiz({ quiz, attempt, onChange, onSubmit, onRestart, onHome }) {
  const [dialog, setDialog] = useState(null)
  const cardRef = useRef(null)
  const total = quiz.questions.length
  const index = Math.min(attempt.current, total - 1)
  const question = quiz.questions[index]
  const selected = attempt.answers[question.id] || null
  const answered = answeredCount(quiz, attempt)
  const unanswered = total - answered
  const isFirst = index === 0
  const isLast = index === total - 1

  const goTo = (next) => {
    if (next < 0 || next >= total) return
    onChange({ ...attempt, current: next })
    const top = cardRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) cardRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const choose = (letter) => {
    onChange({ ...attempt, answers: { ...attempt.answers, [question.id]: letter } })
  }

  const closeDialog = useCallback(() => setDialog(null), [])

  return (
    <main className="gutter mx-auto max-w-6xl pb-32 pt-6 sm:pt-8 lg:pb-16">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
            {quiz.code === 'ALL' ? 'Full Exam' : `Lecture ${quiz.code.slice(1)}`}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-[28px]">{quiz.subtitle}</h1>
        </div>
        <button
          type="button"
          onClick={onHome}
          className="flex h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold transition-colors hover:bg-sunken sm:hidden"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Home
        </button>
      </div>

      <div className="mt-5">
        <div className="tnum flex items-center justify-between gap-3 text-sm">
          <span className="font-semibold">
            Question {index + 1} of {total}
          </span>
          <span className="text-muted">
            {answered} of {total} answered
          </span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-sunken"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={answered}
        >
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section ref={cardRef} className="min-w-0 scroll-mt-4">
          <article key={question.id} className="rise rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="tnum rounded-md bg-accent-soft px-2 py-1 font-mono text-xs font-semibold text-accent-ink">
                Q{index + 1}
              </span>
              <span className="tnum font-mono text-xs text-muted">Bank #{question.id}</span>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold leading-snug sm:text-2xl">{question.question}</h2>
            <div className="mt-6 flex flex-col gap-3" role="radiogroup" aria-label="Answer choices">
              {question.options.map((option) => (
                <AnswerOption
                  key={option.letter}
                  option={option}
                  selected={selected === option.letter}
                  onSelect={() => choose(option.letter)}
                />
              ))}
            </div>
          </article>

          <div className="mt-5 hidden items-center justify-between gap-3 lg:flex">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={isFirst}
              className="flex h-12 items-center gap-2 rounded-xl border border-line bg-surface px-5 font-semibold transition-colors hover:bg-sunken disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Previous
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={() => setDialog('submit')}
                className="h-12 rounded-xl bg-accent px-6 font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                Submit Exam
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-12 items-center gap-2 rounded-xl bg-accent px-6 font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-6">
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <QuestionNavigator quiz={quiz} attempt={attempt} current={index} onJump={goTo} />
            <div className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => setDialog('submit')}
                className="h-11 rounded-xl bg-accent px-4 font-semibold text-on-accent transition-opacity hover:opacity-90"
              >
                Submit Exam
              </button>
              <button
                type="button"
                onClick={() => setDialog('restart')}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-line px-4 font-semibold transition-colors hover:bg-sunken"
              >
                <RestartIcon className="h-4 w-4" />
                Restart Quiz
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="gutter safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pt-3 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={isFirst}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-line font-semibold transition-colors hover:bg-sunken disabled:opacity-40"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Previous
          </button>
          {isLast ? (
            <button
              type="button"
              onClick={() => setDialog('submit')}
              className="h-12 flex-1 rounded-xl bg-accent font-semibold text-on-accent"
            >
              Submit Exam
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-on-accent"
            >
              Next
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={dialog === 'submit'}
        title="Submit your exam?"
        confirmLabel={unanswered > 0 ? 'Submit anyway' : 'Submit Exam'}
        cancelLabel="Keep answering"
        onConfirm={() => {
          setDialog(null)
          onSubmit()
        }}
        onCancel={closeDialog}
      >
        {unanswered > 0 ? (
          <div className="flex flex-col gap-2">
            <p className="rounded-lg border border-bad-line bg-bad-soft px-3 py-2 font-semibold text-bad">
              You have {unanswered} unanswered {unanswered === 1 ? 'question' : 'questions'}.
            </p>
            <p>Unanswered questions are marked as Not Answered and earn no points. You can't change answers after submitting.</p>
          </div>
        ) : (
          <p>You answered all {total} questions. You can't change answers after submitting.</p>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'restart'}
        title="Restart this quiz?"
        confirmLabel="Restart Quiz"
        tone="danger"
        onConfirm={() => {
          setDialog(null)
          onRestart()
        }}
        onCancel={closeDialog}
      >
        <p>All {answered} of your answers will be cleared and you'll start again from question 1.</p>
      </ConfirmDialog>
    </main>
  )
}
