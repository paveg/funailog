import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons';

import { formatDateEn } from '@/lib/utils';

type DateTypes = 'updated' | 'published' | undefined;
type Props = {
  type: DateTypes;
  date: Date;
};

const DateIcon = ({ type }: { type: DateTypes }) => {
  switch (type) {
    case 'updated':
      return <ReloadIcon className="pt-0.5" />;
    case 'published':
      return <CalendarIcon className="pt-0.5" />;
    default:
      return <CalendarIcon className="pt-0.5" />;
  }
};

export const DateComponent = ({ type, date }: Props) => {
  return (
    <time
      className="flex items-center gap-1 text-xs md:text-sm"
      dateTime={date.toISOString()}
    >
      <DateIcon type={type} />
      {formatDateEn(date)}
    </time>
  );
};
