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

type VirtualBlockTag = 'P' | 'DIV' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

type VirtualMarkTypes = 'bold' | 'underline' | 'italics' | 'strikethrough';

type VirtualInlineTag =
  | 'SPAN'
  // Bold
  | 'B'
  | 'STRONG'
  // Underline
  | 'U'
  // Italizicing
  | 'I'
  | 'EM'
  // Strikethrough
  | 'S'
  | 'DEL';

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

enum VirtualSelectionMarkValueEnum {
  OFF = 1,
  ON = 2,
  MIXED = 3,
}

type VirtualSelectionMarks = {
  [K in VirtualMarkTypes]?: VirtualSelectionMarkValueEnum;
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
  tag: 'DIV';
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

////////////////////////////////////////////////////////////
// Init Options

type EditorOptions = {
  parsingOptions?: {
    trimDocWhiteSpace?: boolean;
    shrinkConsecutiveSpaces?: boolean;
    convertNewlinesToSpaces?: boolean;
    removeWhiteSpaceOnlyBlocks?: boolean;
  };
};
