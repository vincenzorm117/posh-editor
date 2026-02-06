const renderMarks = (
  marks: VirtualTreeElementProps,
): VirtualTreeElementProps => {
  marks.class += ' font-bold';
  return marks;
};

export default renderMarks;
