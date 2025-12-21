import { useState } from 'react';

import { Badge } from '@/components/ui/badge';

interface RoleLink {
  url: string;
  label: string;
}

interface Role {
  role: string;
  period: { start: string; end: string | null };
  project?: string | undefined;
  description: string;
  highlights?: string[] | undefined;
  technologies?: string[] | undefined;
  links?: RoleLink[] | undefined;
  star?:
    | { situation: string; task: string; action: string; result: string }[]
    | undefined;
}

interface Props {
  roles: Role[];
  initialVisibleCount?: number;
  lang?: 'ja' | 'en';
}

const translations = {
  ja: {
    current: '現在',
    present: '現在',
    showMore: (count: number) => `他${count}件の経歴を表示`,
    collapse: '折りたたむ',
  },
  en: {
    current: 'Current',
    present: 'Present',
    showMore: (count: number) => `Show ${count} more`,
    collapse: 'Collapse',
  },
};

function formatPeriod(
  period: { start: string; end: string | null },
  lang: 'ja' | 'en',
): string {
  const start = period.start.replace('-', '/');
  const end = period.end
    ? period.end.replace('-', '/')
    : translations[lang].present;
  return `${start} - ${end}`;
}

export function CollapsibleRoles({
  roles,
  initialVisibleCount = 2,
  lang = 'ja',
}: Props): React.ReactElement {
  const t = translations[lang];
  const [isExpanded, setIsExpanded] = useState(false);
  const hasHiddenRoles = roles.length > initialVisibleCount;
  const visibleRoles = isExpanded ? roles : roles.slice(0, initialVisibleCount);
  const hiddenCount = roles.length - initialVisibleCount;

  return (
    <div className="mt-3">
      {visibleRoles.map((role, index) => {
        const isCurrent = role.period.end === null;
        const isLast = isExpanded
          ? index === roles.length - 1
          : index === visibleRoles.length - 1;

        return (
          <div
            key={`${role.role}-${role.period.start}`}
            className="flex gap-3 sm:gap-4"
          >
            {/* Stepper Indicator Column */}
            <div className="flex flex-col items-center">
              {/* Circle Indicator */}
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold sm:size-8 ${
                  isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-emerald-500 bg-emerald-500 text-white'
                }`}
              >
                {isCurrent ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-3 sm:size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-3 sm:size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {/* Connecting Line (bottom) */}
              {(!isLast || (hasHiddenRoles && !isExpanded)) && (
                <div className="my-1 w-0.5 flex-1 bg-border" />
              )}
            </div>

            {/* Content Column */}
            <div
              className={`flex-1 ${isLast && !hasHiddenRoles ? 'pb-0' : 'pb-6'}`}
            >
              {/* Current Badge */}
              {isCurrent && (
                <span className="bg-primary/10 mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-primary">
                  {t.current}
                </span>
              )}

              {/* Role Header */}
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span
                  className={`text-sm font-semibold ${
                    isCurrent ? 'text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {role.role}
                </span>
                {role.project && (
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {role.project}
                  </span>
                )}
              </div>

              {/* Period */}
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {formatPeriod(role.period, lang)}
              </span>

              {/* Role Description */}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>

              {/* Role Links */}
              {role.links && role.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {role.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-3"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Role Technologies as Badges */}
              {role.technologies && role.technologies.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {role.technologies.slice(0, 6).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {role.technologies.length > 6 && (
                    <span className="text-muted-foreground/60 px-1 py-0.5 text-xs">
                      +{role.technologies.length - 6}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Expand/Collapse Button */}
      {hasHiddenRoles && (
        <div className="flex gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="size-6 sm:size-8" />
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-border/60 mt-2 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {isExpanded ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                {t.collapse}
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                {t.showMore(hiddenCount)}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
