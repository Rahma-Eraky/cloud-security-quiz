import bank from '../data/questions.json'

export const lectures = bank.lectures
export const questions = bank.questions

export const quizzes = [
  ...lectures.map((lecture) => ({
    id: `lecture-${lecture.id}`,
    code: `L${lecture.id}`,
    title: `Lecture ${lecture.id} Quiz`,
    subtitle: lecture.title,
    range: `Questions ${(lecture.id - 1) * 20 + 1}–${lecture.id * 20}`,
    questions: questions.filter((q) => q.lecture === lecture.id),
  })),
  {
    id: 'full-exam',
    code: 'ALL',
    title: 'Full Exam',
    subtitle: 'All four lectures',
    range: 'Questions 1–80',
    questions,
  },
]

export function getQuiz(id) {
  return quizzes.find((quiz) => quiz.id === id)
}

export function emptyAttempt() {
  return { answers: {}, current: 0, submitted: false }
}

export function sanitizeAttempt(quiz, raw) {
  if (!raw || typeof raw !== 'object') return emptyAttempt()
  const answers = {}
  const valid = new Set(quiz.questions.map((q) => String(q.id)))
  if (raw.answers && typeof raw.answers === 'object') {
    for (const [id, letter] of Object.entries(raw.answers)) {
      if (valid.has(id) && ['A', 'B', 'C', 'D'].includes(letter)) answers[id] = letter
    }
  }
  const current = Number.isInteger(raw.current) ? Math.min(Math.max(raw.current, 0), quiz.questions.length - 1) : 0
  return { answers, current, submitted: raw.submitted === true }
}

export function answeredCount(quiz, attempt) {
  return quiz.questions.reduce((n, q) => (attempt.answers[q.id] ? n + 1 : n), 0)
}

export function optionFor(question, letter) {
  return question.options.find((o) => o.letter === letter)
}

export function grade(quiz, attempt) {
  const items = quiz.questions.map((question, index) => {
    const selected = attempt.answers[question.id] || null
    const status = !selected ? 'unanswered' : selected === question.answer ? 'correct' : 'incorrect'
    return { question, index, selected, status }
  })
  const correct = items.filter((i) => i.status === 'correct').length
  const incorrect = items.filter((i) => i.status === 'incorrect').length
  const unanswered = items.filter((i) => i.status === 'unanswered').length
  const total = items.length
  const percent = total ? (correct / total) * 100 : 0
  return { items, total, correct, incorrect, unanswered, percent }
}

export function formatPercent(value) {
  const rounded = Math.round(value * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`
}
