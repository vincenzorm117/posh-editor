const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  if (!marks.class) marks.class = '';
  marks.class += ' italic';
  return marks;
};

export default renderMarks;
