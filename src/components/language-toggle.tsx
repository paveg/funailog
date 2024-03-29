import { LanguagesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';

type Props = {
  collectionName?: 'blog' | '';
  pathname: string;
  lang: keyof typeof ui;
};

const areArrayEqual = (arr1: string[], arr2: string[]): boolean => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

const isCollectRoot = (pathname: string, collectionName: string): boolean => {
  const pathnameArray = pathname
    .split('/')
    .filter((item) => item !== '' && isNaN(item as any));
  const cArray = collectionName.split('/');
  return areArrayEqual(pathnameArray, cArray);
};

export const LanguageToggle = ({ pathname, collectionName, lang }: Props) => {
  const t = useTranslations(lang);
  const newPath = (
    isCollectRoot(pathname, collectionName ?? '')
      ? [collectionName, 'en']
      : [collectionName]
  ).join('/');
  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={(event) => {
          window.location.href = `/${newPath}`;
          event.preventDefault();
        }}
      >
        <LanguagesIcon className="size-4" />
        {t('blog.switch')}
      </Button>
    </>
  );
};
