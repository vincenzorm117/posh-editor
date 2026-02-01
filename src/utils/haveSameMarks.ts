const haveSameMarks = (
  inlineA: VirtualInline,
  inlineB: VirtualInline,
): boolean => {
  // Get marks as entries
  const marksA = Object.entries(inlineA?.marks ?? {}) as VirtualMarkEntries;
  const marksB = Object.entries(inlineB?.marks ?? {}) as VirtualMarkEntries;
  // If different number of marks, not same
  if (marksA.length !== marksB.length) {
    return false;
  }
  // Check each mark key and value
  for (const [key, value] of marksA) {
    // If key not in inlineB, not same
    if (!inlineB.marks.hasOwnProperty(key)) {
      return false;
    }
    // If value different, not same
    if (inlineB.marks[key] !== value) {
      return false;
    }
  }
  // All marks match
  return true;
};

export default haveSameMarks;
