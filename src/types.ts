////////////////////////////////////////////////////////////
// Virtual Nodes

type VirtualState = {
  editor: {
    element: HTMLElement;
    selector: string;
  };
  vDoc: VirtualDocument;
  vSel: VirtualSelection;
  vIndex: VirtualDocumentIndex;
  vTree: VirtualTree;
};

type VirtualDocument = {
  type: 'doc';
  blocks: VirtualBlock[];
};

type VirtualBlock = {
  type: 'block';
  tag: VirtualBlockTag;
  inlines: VirtualInline[];
};

type VirtualInline = {
  type: 'inline';
  marks: VirtualMarks;
  text: string;
};

type VirtualMarks = {
  [K in VirtualMarkTypes]?: boolean;
};

type VirtualMarkEntries = Array<[VirtualMarkTypes, boolean]>;

type VirtualNode = VirtualDocument | VirtualBlock | VirtualInline;

type VirtualBlockTag = 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type VirtualMarkTypes = 'bold' | 'underline' | 'italics' | 'strikethrough';

type VirtualInlineTag =
  | 'span'
  // Bold
  | 'b'
  | 'strong'
  // Underline
  | 'u'
  // Italizicing
  | 'i'
  | 'em'
  // Strikethrough
  | 's'
  | 'del';

////////////////////////////////////////////////////////////
// Selection

type VirtualSelectionInEditor = {
  start: number;
  end: number;
  isCollapsed: boolean;
  isInEditor: true;
  direction: 'none' | 'forward' | 'backward';
  marks: VirtualMarks;
};

type VirtualSelectionOutsideEditor = {
  isInEditor: false;
};

type VirtualSelection =
  | VirtualSelectionInEditor
  | VirtualSelectionOutsideEditor;

enum VirtualSelectionMarkValue {
  OFF = 1,
  ON = 2,
  MIXED = 3,
}

type VirtualSelectionMarks = {
  [K in VirtualMarkTypes]?: VirtualSelectionMarkValue;
};

////////////////////////////////////////////////////////////
// Index

type VirtualDocumentIndex = {
  length: number;
  blocks: VirtualBlockIndex[];
};

type VirtualBlockIndex = {
  blockIndex: number;
  globalStart: number;
  length: number;
  inlines: VirtualInlineIndex[];
};

type VirtualInlineIndex = {
  blockIndex: number;
  inlineIndex: number;
  globalStart: number;
  blockStart: number;
  length: number;
};

////////////////////////////////////////////////////////////
// Virtual Tree

type VirtualTree = {
  type: 'root';
  tag: 'div';
  props: Record<string, any>;
  children: VirtualTreeNode[];
};

type VirtualTreeElement = {
  type: 'element';
  tag: VirtualBlockTag | VirtualInlineTag;
  props: Record<string, any>;
  children: VirtualTreeNode[];
};

type VirtualTreeText = {
  type: 'text';
  text: string;
};

type VirtualTreeNode = VirtualTreeElement | VirtualTreeText;
