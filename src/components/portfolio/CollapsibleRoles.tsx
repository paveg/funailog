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
    showMore: (count: number) => `他 ${count} 件の経歴`,
    collapse: '折りたたむ',
  },
  en: {
    current: 'Current',
    present: 'Present',
    showMore: (count: number) => `+${count} more roles`,
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
    <div className="mt-4">
      {visibleRoles.map((role, index) => {
        const isCurrent = role.period.end === null;
        const isLast = isExpanded
          ? index === roles.length - 1
          : index === visibleRoles.length - 1;

        return (
          <div
            key={`${role.role}-${role.period.start}`}
            className="flex gap-2.5 sm:gap-3.5"
          >
            {/* Stepper Indicator Column */}
            <div className="flex flex-col items-center">
              {/* Circle Indicator - smaller on mobile */}
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] shadow-sm sm:size-6 ${
                  isCurrent
                    ? 'border-warm/60 bg-warm text-white'
                    : 'border-primary/30 bg-primary/10 text-primary'
                }`}
              >
                {isCurrent ? (
                  <span className="size-1.5 rounded-full bg-current sm:size-2" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-2.5 sm:size-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              {/* Connecting Line - visible solid line */}
              {(!isLast || (hasHiddenRoles && !isExpanded)) && (
                <div className="my-1 min-h-6 w-px flex-1 bg-border" />
              )}
            </div>

            {/* Content Column */}
            <div
              className={`min-w-0 flex-1 ${isLast && !hasHiddenRoles ? 'pb-0' : 'pb-5'}`}
            >
              {/* Current indicator above role */}
              {isCurrent && (
                <span className="mb-0.5 inline-flex items-center gap-1 text-2xs font-medium text-muted-foreground">
                  <span className="size-1.5 animate-pulse rounded-full bg-warm" />
                  {t.current}
                </span>
              )}
              {/* Role Header */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span
                  className={`text-xs font-semibold leading-tight sm:text-sm ${
                    isCurrent ? 'text-foreground' : 'text-foreground/80'
                  }`}
                >
                  {role.role}
                </span>
                {role.project && (
                  <Badge variant="project" className="text-2xs">
                    {role.project}
                  </Badge>
                )}
              </div>

              {/* Period */}
              <span className="mt-0.5 block text-2xs tabular-nums text-muted-foreground sm:text-xs">
                {formatPeriod(role.period, lang)}
              </span>

              {/* Role Description */}
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {role.description}
              </p>

              {/* Role Links */}
              {role.links && role.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                  {role.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:border-primary/20 hover:bg-primary/5 inline-flex items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-2xs text-primary transition-colors sm:text-xs"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-2.5 sm:size-3"
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

              {/* Role Technologies as Badges - responsive grid */}
              {role.technologies && role.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {role.technologies.slice(0, 5).map((tech) => (
                    <Badge key={tech} variant="tech" className="text-2xs">
                      {tech}
                    </Badge>
                  ))}
                  {role.technologies.length > 5 && (
                    <span className="text-muted-foreground/70 inline-flex items-center px-1.5 py-0.5 text-2xs">
                      +{role.technologies.length - 5}
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
        <div className="flex gap-2.5 sm:gap-3.5">
          {/* Connector to button */}
          <div className="flex flex-col items-center">
            <div className="size-5 sm:size-6" />
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-muted-foreground/30 bg-muted/30 hover:border-primary/40 hover:bg-primary/5 group mt-1 inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-2xs font-medium text-muted-foreground transition-all hover:text-primary sm:text-xs"
          >
            {isExpanded ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3 transition-transform group-hover:-translate-y-0.5"
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
                  className="size-3 transition-transform group-hover:translate-y-0.5"
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
