const hasMarks = (inline: VirtualInline): boolean => {
  return Object.keys(inline.marks ?? {}).length > 0;
};

export default hasMarks;
