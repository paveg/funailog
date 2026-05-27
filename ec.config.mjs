import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
  themes: ['github-light', 'github-dark'],
  themeCssSelector: (theme) => {
    if (theme.type === 'dark') return '.dark';
    return ':root:not(.dark)';
  },
  emitExternalStylesheet: false,
  styleOverrides: {
    codeFontFamily: "var(--font-code, 'JetBrains Mono Variable', monospace)",
    codeFontSize: '0.875rem',
    borderRadius: '0.5rem',
    frames: {
      tooltipSuccessBackground: 'var(--accent)',
    },
    copyButton: {
      size: '1.5rem',
      opacity: '0.5',
      hoverOpacity: '1',
    },
  },
});
