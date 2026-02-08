import generateId from '@/helpers/generateId';

const createVirtualInline = (
  text: string,
  marks: VirtualMarks,
): VirtualInline => {
  return {
    id: generateId(),
    type: 'inline',
    text,
    marks,
  };
};

export default createVirtualInline;
