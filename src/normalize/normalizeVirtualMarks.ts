const normalizeVirtualMarks = (marks: VirtualMarks): VirtualMarks => {
  const normalized: VirtualMarks = {};

  for (const [key, value] of Object.entries(marks) as VirtualMarkEntries) {
    if (value !== false && value !== null && value !== undefined) {
      normalized[key] = value;
    }
  }

  return normalized;
};

export default normalizeVirtualMarks;
