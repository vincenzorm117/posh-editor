import uid from '../helpers/uid';

const vCreateInline = (
  text: string,
  marks: Record<string, any> = {},
  options: VirtualizeOptions = {},
): VirtualInline => {
  if (options.convertNewlinesToSpaces) {
    text = text.replace(/\n/g, ' ');
  }

  if (options.shrinkConsecutiveSpaces) {
    text = text.replace(/  +/g, ' ');
  }

  return {
    type: 'inline',
    id: uid(),
    text,
    marks,
  };
};

export default vCreateInline;
