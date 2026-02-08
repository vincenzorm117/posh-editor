import createVirtualDocument from '@/createVirtualNodes/createVirtualDocument';
import convertNewlinesToSpaces from './convertNewlinesToSpaces';
import normalizeVirtualBlock from './normalizeVirtualBlock';
import removeWhiteSpaceOnlyBlocks from './removeWhiteSpaceOnlyBlocks';
import shrinkConsecutiveSpaces from './shrinkConsecutiveSpaces';
import trimDocWhiteSpace from './trimDocWhiteSpace';

const normalizeVirtualDocument = (
  oldVDoc: VirtualDocument,
  options?: EditorOptions['parsingOptions'],
): VirtualDocument => {
  let blocks = oldVDoc.blocks.map((b) => normalizeVirtualBlock(b));

  if (options?.trimDocWhiteSpace) {
    blocks = trimDocWhiteSpace(blocks);
  }

  if (options?.removeWhiteSpaceOnlyBlocks) {
    blocks = removeWhiteSpaceOnlyBlocks(blocks);
  }

  if (options?.convertNewlinesToSpaces) {
    blocks = convertNewlinesToSpaces(blocks);
  }

  if (options?.shrinkConsecutiveSpaces) {
    blocks = shrinkConsecutiveSpaces(blocks);
  }

  return createVirtualDocument(blocks);
};

export default normalizeVirtualDocument;
