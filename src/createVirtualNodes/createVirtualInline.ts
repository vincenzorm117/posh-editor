const createVirtualInline = (
  text: string,
  marks: VirtualMarks,
): VirtualInline => {
  return {
    type: 'inline',
    text,
    marks,
  };
};

export default createVirtualInline;
