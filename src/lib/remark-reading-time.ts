import { toString } from 'mdast-util-to-string';
import readingTime from 'reading-time';

export const remarkReadingTime = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (tree: any, { data }: any) {
    const textOnPage = toString(tree);
    const rt = readingTime(textOnPage);

    data.astro.frontmatter.minRead = rt.text;
  };
};
