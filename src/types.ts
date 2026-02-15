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
  actions: Record<string, VirtualAction>;
  hooks?: {
    preRender?: (state: VirtualState) => void;
    postRender?: (state: VirtualState) => void;
    preSelection?: (state: VirtualState) => void;
    postSelection?: (state: VirtualState) => void;
  };
};

type VirtualAction = {
  apply?(state: VirtualState, ...args: any[]): any;
  scanMarks?(node: Node, root: HTMLElement): boolean;
  renderMarks?(marks: VirtualTreeElementProps): VirtualTreeElementProps;
};

type VirtualDocument = {
  id: string;
  type: 'doc';
  blocks: VirtualBlock[];
};

type VirtualBlock = {
  id: string;
  type: 'block';
  tag: VirtualBlockTag;
  inlines: VirtualInline[];
};

type VirtualInline = {
  id: string;
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

// type VirtualMarkTypes = 'bold' | 'underline' | 'italics' | 'strikethrough';
type VirtualMarkTypes = string; // Allow dynamic mark types for flexibility

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
  | 'DEL'
  // Break line
  | 'BR';

////////////////////////////////////////////////////////////
// Selection

type VirtualSelectionInEditor = {
  // TODO: Make it so its always start <= end. We'll use direction for direction
  start: number;
  end: number;
  isCollapsed: boolean;
  isInEditor: true;
  direction: 'none' | 'forward' | 'backward';
  marks: VirtualSelectionMarks;
  blockTypes: VirtualSelectionBlockTypes;
};

type VirtualSelectionOutsideEditor = {
  isInEditor: false;
};

type VirtualSelection =
  | VirtualSelectionInEditor
  | VirtualSelectionOutsideEditor;

enum VirtualSelectionMarkValueEnum {
  NONE = 0,
  OFF = 1,
  ON = 2,
  MIXED = 3,
}

type VirtualSelectionMarks = {
  [K in VirtualMarkTypes]?: VirtualSelectionMarkValueEnum;
};

type VirtualSelectionBlockTypes = {
  [K in VirtualBlockTag]?: boolean;
};

////////////////////////////////////////////////////////////
// Index

type VirtualDocumentIndex = {
  length: number;
  blocks: VirtualBlockIndex[];
};

type VirtualBlockIndex = {
  blockIndex: number;
  start: number;
  end: number;
  length: number;
  inlines: VirtualInlineIndex[];
};

type VirtualInlineIndex = {
  blockIndex: number;
  inlineIndex: number;
  start: number;
  end: number;
  length: number;
};

////////////////////////////////////////////////////////////
// Virtual Tree

type VirtualTree = {
  id: string;
  type: 'root';
  tag: 'DIV';
  props: Record<string, any>;
  children: VirtualTreeNode[];
};

type VirtualTreeElement = {
  id: string;
  type: 'element';
  tag: VirtualBlockTag | VirtualInlineTag;
  props: VirtualTreeElementProps;
  children: VirtualTreeNode[];
};

type VirtualTreeElementProps = Record<string, any>;

type VirtualTreeText = {
  id: string;
  type: 'text';
  text: string;
};

type VirtualTreeNode = VirtualTree | VirtualTreeElement | VirtualTreeText;

////////////////////////////////////////////////////////////
// Init Options

type EditorOptions = {
  parsingOptions?: {
    trimDocWhiteSpace?: boolean;
    shrinkConsecutiveSpaces?: boolean;
    convertNewlinesToSpaces?: boolean;
    removeWhiteSpaceOnlyBlocks?: boolean;
  };
  hooks?: {
    preRender?: (state: VirtualState) => void;
    postRender?: (state: VirtualState) => void;
    preSelection?: (state: VirtualState) => void;
    postSelection?: (state: VirtualState) => void;
  };
};
