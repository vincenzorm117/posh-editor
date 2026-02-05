export const MARK_TYPES = [
  {
    name: 'bold',
    tags: ['B', 'STRONG'],
  },
  {
    name: 'italics',
    tags: ['I', 'EM'],
  },
  {
    name: 'underline',
    tags: ['U'],
  },
  {
    name: 'strikethrough',
    tags: ['S', 'DEL'],
  },
] as { name: VirtualMarkTypes; tags: VirtualInlineTag[] }[];

export const MARK_TYPE_TO_TAG = {
  bold: 'B',
  italics: 'I',
  underline: 'U',
  strikethrough: 'S',
} as { [K in VirtualMarkTypes]: VirtualInlineTag };

export const VALID_BLOCK_NODES = [
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
] as VirtualBlockTag[];

export const VALID_INLINE_NODES = [
  'SPAN',
  'B',
  'STRONG',
  'U',
  'I',
  'EM',
  'S',
  'DEL',
] as VirtualInlineTag[];

export const VirtualSelectionMarkValue = {
  NONE: 0,
  OFF: 1,
  ON: 2,
  MIXED: 3,
};
