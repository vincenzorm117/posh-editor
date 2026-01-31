/**
 * Returns the ordered start and end positions from a given virtual selection.
 *
 * @param vSelection - The virtual selection object containing `anchor` and `focus` positions.
 * @returns An object with `startPosition` and `endPosition`, where `startPosition` is less than or equal to `endPosition`.
 * @throws {Error} If either `anchor` or `focus` is undefined in the provided selection.
 */
const getOrderedSelection = (
  vSelection: VirtualSelection,
): { startPosition: number; endPosition: number } => {
  const { anchor, focus } = vSelection;
  // If either is undefined, return both as undefined
  if (anchor === undefined || focus === undefined) {
    throw new Error(
      'Both anchor and focus must be defined in virtual selection',
    );
  }
  //
  return anchor <= focus
    ? { startPosition: anchor, endPosition: focus }
    : { startPosition: focus, endPosition: anchor };
};

export default getOrderedSelection;
