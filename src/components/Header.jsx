import { ArrowLeftIcon, CloudShieldIcon, MoonIcon, SunIcon } from './Icons.jsx'

export default function Header({ onHome, onToggleTheme, isDark, showHome }) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="gutter mx-auto flex h-16 max-w-6xl items-center justify-between gap-3">
        <button
          type="button"
          onClick={onHome}
          className="flex min-w-0 items-center gap-2.5 rounded-lg text-left"
          aria-label="SECE43 Cloud Security Quiz home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-on-accent">
            <CloudShieldIcon className="h-5 w-5" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">SECE43</span>
            <span className="block truncate font-display text-[15px] font-bold sm:text-base">Virtualization &amp; Cloud Security</span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {showHome && (
            <button
              type="button"
              onClick={onHome}
              className="hidden h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm font-semibold text-ink transition-colors hover:bg-sunken sm:flex"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </button>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink transition-colors hover:bg-sunken"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
