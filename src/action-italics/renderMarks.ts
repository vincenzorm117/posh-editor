const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  marks.class += ' italic';
  return marks;
};

export default renderMarks;
