const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  if (!marks.class) marks.class = '';
  marks.class = (marks.class + ' line-through').trim();
  return marks;
};

export default renderMarks;
