type DomPoint = {
  node: Node;
  offset: number;
};

type VirtualInlineIndex = {
  blockIndex: number;
  inlineIndex: number;
  id: string;
  globalPosition: number;
  blockPosition: number;
  length: number;
};

type VirtualBlockIndex = {
  blockIndex: number;
  id: string;
  globalPosition: number;
  length: number;
  inlines: VirtualInlineIndex[];
};

type VirtualIndex = {
  blocks: VirtualBlockIndex[];
  inlineById: Map<string, VirtualInlineIndex>;
  globalLength: number;
};

type VirtualSelection = {
  anchor: number;
  focus: number;
  direction: 'forward' | 'backward' | 'none';
  isCollapsed: boolean;
  isInsideEditor: boolean;
  marks: Record<string, 'true' | 'false' | 'mixed'>;
};

type VirtualDocument = {
  type: 'document';
  blocks: VirtualBlock[];
};

type VirtualizeOptions = {
  trimBlockWhiteSpace?: boolean;
  shrinkConsecutiveSpaces?: boolean;
  convertNewlinesToSpaces?: boolean;
};

type VirtualBlock = {
  type: 'element';
  id: string;
  tag: string;
  children: VirtualInline[];
};

type VirtualInline = {
  type: 'inline';
  id: string;
  text: string;
  marks: Record<string, any>;
};

type EditorState = {
  selector: string;
  element: HTMLElement;
};

type State = {
  editor: EditorState;
  virtualDocument: VirtualDocument;
  virtualSelection: VirtualSelection;
  virtualIndex?: VirtualIndex;
  virtualTree?: VirtualTree;
};

type VirtualTree = {
  type: 'element';
  tag: 'div';
  key: 'root';
  props: Record<string, any>;
  children: VirtualTreeNode[];
};

type VirtualTreeElement = {
  type: 'element';
  tag?: string;
  key?: string;
  children?: VirtualTreeNode[];
  props?: Record<string, any>;
};

type VirtualTreeText = {
  type: 'text';
  text: string;
};

type VirtualTreeNode = VirtualTreeElement | VirtualTreeText;
