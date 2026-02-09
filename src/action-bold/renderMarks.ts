const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  if (!marks.class) marks.class = '';
  marks.class = (marks.class + ' font-bold').trim();
  return marks;
};

export default renderMarks;
