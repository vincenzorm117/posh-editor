const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  marks.class += ' underline';
  return marks;
};

export default renderMarks;
