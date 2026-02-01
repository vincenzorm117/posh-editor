export const MARK_TYPES = [
  {
    name: 'bold',
    tags: ['b', 'strong'],
  },
  {
    name: 'italics',
    tags: ['i', 'em'],
  },
  {
    name: 'underline',
    tags: ['u'],
  },
  {
    name: 'strikethrough',
    tags: ['s', 'del'],
  },
] as { name: VirtualMarkTypes; tags: VirtualInlineTag[] }[];

export const VALID_BLOCK_NODES = [
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
] as VirtualBlockTag[];

export const VALID_INLINE_NODES = [
  'span',
  'b',
  'strong',
  'u',
  'i',
  'em',
  's',
  'del',
] as VirtualInlineTag[];
