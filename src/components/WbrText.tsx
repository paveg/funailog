import { Fragment } from 'react';

export function WbrText({ segments }: { segments: string[] }) {
  return (
    <>
      {segments.flatMap((segment, i) => [
        ...(i > 0 ? [<wbr key={`wbr-${i}`} />] : []),
        <Fragment key={`seg-${i}`}>{segment}</Fragment>,
      ])}
    </>
  );
}
