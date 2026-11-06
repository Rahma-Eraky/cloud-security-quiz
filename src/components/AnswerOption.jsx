export default function AnswerOption({ option, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-start gap-4 rounded-xl border-2 px-4 py-4 text-left transition-colors sm:px-5 ${
        selected ? 'border-accent bg-accent-soft' : 'border-line bg-surface hover:border-accent/50 hover:bg-sunken'
      }`}
    >
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg font-mono text-sm font-semibold transition-colors ${
          selected ? 'bg-accent text-on-accent' : 'bg-sunken text-muted'
        }`}
      >
        {option.letter}
      </span>
      <span className="min-w-0 pt-1 text-[16px] leading-snug sm:text-[17px]">{option.text}</span>
    </button>
  )
}
