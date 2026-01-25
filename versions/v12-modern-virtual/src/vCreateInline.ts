import uid from './uid';

const vCreateInline = (
  text: string,
  marks: Record<string, any> = {},
): VirtualInline => {
  return {
    type: 'inline',
    id: uid(),
    text: text,
    // .replace(/\n/g, ' ')
    // .replace(/\s{2,}/g, ' ')
    // .trim(),
    marks,
  };
};

export default vCreateInline;
