import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons';

type DateTypes = 'updated' | 'published' | undefined;
type Props = {
  type: DateTypes;
  date: Date;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
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
      {formatDate(date)}
    </time>
  );
};
