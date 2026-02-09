const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  if (!marks.class) marks.class = '';
  marks.class = (marks.class + ' underline').trim();
  return marks;
};

export default renderMarks;
