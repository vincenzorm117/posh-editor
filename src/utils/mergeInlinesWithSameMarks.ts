import haveSameMarks from './haveSameMarks';

const mergeInlinesWithSameMarks = (
  inlines: VirtualInline[],
): VirtualInline[] => {
  // Keeps track of merged inlines
  const mergedInlines = [];
  // Loop through inlines
  for (const currInline of inlines) {
    // Grab last inlinle
    const prevInline = mergedInlines[mergedInlines.length - 1];
    // If no inlines, push and continue
    if (!prevInline || !haveSameMarks(prevInline, currInline)) {
      mergedInlines.push(currInline);
    } else {
      prevInline.text += currInline.text;
    }
  }
  return mergedInlines;
};

export default mergeInlinesWithSameMarks;
