type DomPoint = {
  node: Node;
  offset: number;
};

type VirtualIndex = {
  blocks: {
    blockIndex: number;
    id: string;
    globalPosition: number;
    length: number;
  }[];
  inlineById: Map<
    string,
    {
      blockIndex: number;
      inlineIndex: number;
      globalPosition: number;
      blockPosition: number;
      length: number;
    }
  >;
  globalLength: number;
};

type VirtualSelection = {
  anchor?: number;
  focus?: number;
  direction?: 'forward' | 'backward' | 'none';
  isCollapsed?: boolean;
  isInsideEditor: boolean;
};

type VirtualDocument = {
  type: 'document';
  blocks: VirtualBlock[];
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
  virtualDocument?: VirtualDocument;
  virtualSelection?: VirtualSelection;
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
