import { LanguagesIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ui } from '@/i18n/ui';
import { useTranslations } from '@/i18n/utils';

type Props = {
  collectionPath?: 'blog' | '';
  pathname: string;
  lang: keyof typeof ui;
};

export const LanguageToggle = ({ pathname, collectionPath, lang }: Props) => {
  const t = useTranslations(lang);
  const isCollectionRoot = pathname === `/${collectionPath}/`;
  const newPath = (
    isCollectionRoot ? [collectionPath, 'en'] : [collectionPath]
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
