// -----------------------------
// Virtual Document Model (VDOM-ish)
// doc = { type:'doc', blocks:[ {id, type:'p', inlines:[ {id, type:'text', text, marks:{bold:boolean}} ] } ] }
// vSelection = { anchor:{pos:number}, focus:{pos:number} }  // pos is a linear index across blocks (+1 separator per block)
// -----------------------------

const ZWSP = "\u200b";

// ✅ Generate unique ID
const uid = () =>
  crypto?.randomUUID
    ? crypto.randomUUID()
    : "id_" + Math.random().toString(16).slice(2);

// ✅ Clamp a number between min and max
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// ✅ Create text inline node with given text and marks
function vCreateText(text, marks = {}) {
  return {
    id: uid(),
    type: "text",
    text,
    marks: { bold: !!marks.bold },
  };
}

// ✅ Create paragraph block with given inlines (or empty text)
function vCreateParagraph(inlines) {
  return {
    id: uid(),
    type: "p",
    inlines: inlines?.length > 0 ? inlines : [vCreateText("")],
  };
}

// ✅ Ensure document is non-empty (at least one block with one inline)
function vEnsureNonEmptyDoc(doc) {
  if (!doc || !Array.isArray(doc.blocks) || doc.blocks.length === 0) {
    return { type: "doc", blocks: [vCreateParagraph([vCreateText("")])] };
  }
  const blocks = doc.blocks.map((b) => {
    const inlines =
      (b.inlines || []).length > 0 ? b.inlines : [vCreateText("")];
    return { ...b, inlines };
  });
  return { ...doc, blocks };
}

// ✅ Check if two marks objects are the same (only bold for now)
function vSameMarks(a, b) {
  return !!a?.bold === !!b?.bold;
}

// TODO: Update vNormalizeDoc to remove empty inlines except keep one if all empty
// ✅ Normalize document: merge adjacent inlines with same marks; remove empty inlines except keep one if all empty
function vNormalizeDoc(doc) {
  // Ensure non-empty doc
  doc = vEnsureNonEmptyDoc(doc);
  // Normalize blocks
  const blocks = doc.blocks.map((block) => {
    // Normalize inlines
    const out = [];
    // Loop through inlines and merge adjacent with same marks; skip empty except keep one if all empty
    for (const n of block.inlines) {
      // Normalize text (ZWSP -> empty)
      const text = n.text === ZWSP ? "" : n.text;
      // Handle empty text
      if (text.length === 0 && out.length === 0) {
        out.push({ ...n, text: "" });
        continue;
      }
      // Skip other empty text
      if (text.length === 0) continue;

      // Merge with previous if same marks
      const prev = out[out.length - 1];
      if (prev && prev.type === "text" && vSameMarks(prev.marks, n.marks)) {
        out[out.length - 1] = { ...prev, text: prev.text + text };
      } else {
        out.push({ ...n, text });
      }
    }
    // Ensure at least one inline
    if (out.length === 0) out.push(vCreateText(""));
    // Return normalized block
    return { ...block, inlines: out };
  });
  // Return normalized doc
  return { ...doc, blocks };
}

// 🟠 Index lets us map between linear pos <-> (block, inline, offset)
function vBuildIndex(doc) {
  doc = vEnsureNonEmptyDoc(doc);

  const blocks = [];
  const inlineById = new Map();

  let globalStart = 0;
  for (let bi = 0; bi < doc.blocks.length; bi++) {
    const b = doc.blocks[bi];
    let inBlockStart = 0;

    for (let ii = 0; ii < b.inlines.length; ii++) {
      const inl = b.inlines[ii];
      const len = inl.text.length;
      inlineById.set(inl.id, {
        blockIndex: bi,
        inlineIndex: ii,
        startInBlock: inBlockStart,
        length: len,
        globalStart: globalStart + inBlockStart,
      });
      inBlockStart += len;
    }

    blocks.push({
      blockIndex: bi,
      id: b.id,
      globalStart,
      length: inBlockStart,
    });

    // +1 separator per block so we can total-order positions across paragraphs.
    globalStart += inBlockStart + 1;
  }

  return {
    blocks,
    inlineById,
    docLinearLength: Math.max(0, globalStart - 1), // last separator not meaningful
  };
}

// 🟠 Convert linear pos to (blockIndex, inBlockOffset)
function vPosToBlockOffset(index, pos) {
  // Clamp into [0..docLinearLength]
  const p = clamp(pos, 0, index.docLinearLength);
  // Find block where p is within [globalStart, globalStart+length]
  for (const b of index.blocks) {
    if (p <= b.globalStart + b.length) {
      return {
        blockIndex: b.blockIndex,
        inBlockOffset: p - b.globalStart,
      };
    }
  }
  // Fallback: end of last block
  const last = index.blocks[index.blocks.length - 1];
  return { blockIndex: last.blockIndex, inBlockOffset: last.length };
}

// 🟠 Convert (blockIndex, inBlockOffset) to (inlineIndex, offsetInInline)
function vBlockOffsetToInline(doc, blockIndex, inBlockOffset) {
  const b = doc.blocks[blockIndex];
  let cur = 0;

  for (let ii = 0; ii < b.inlines.length; ii++) {
    const inl = b.inlines[ii];
    const next = cur + inl.text.length;
    if (inBlockOffset <= next) {
      return { inlineIndex: ii, offsetInInline: inBlockOffset - cur };
    }
    cur = next;
  }

  // fallback: end of last inline
  const lastIdx = b.inlines.length - 1;
  const last = b.inlines[lastIdx];
  return { inlineIndex: lastIdx, offsetInInline: last.text.length };
}

// -----------------------------
// Virtual selection (linear positions)
// -----------------------------

// ✅ Check if selection is within editor
function isSelectionInEditor(sel, editor) {
  if (!sel || sel.rangeCount === 0) return false;
  const a = sel.anchorNode;
  const f = sel.focusNode;
  return editor.contains(a) && editor.contains(f);
}

// ✅ Find first leaf (Text or BR) within a node
function firstLeaf(node) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) return node;
  if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") return node;

  for (const child of node.childNodes) {
    const leaf = firstLeaf(child);
    if (leaf) return leaf;
  }
  return null;
}

// ✅ Find last leaf (Text or BR) within a node
function lastLeaf(node) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) return node;
  if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") return node;
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const leaf = lastLeaf(node.childNodes[i]);
    if (leaf) return leaf;
  }
  return null;
}

// 🟠
function nextNodeWithinRoot(root, node) {
  if (!node) return null;
  if (node.firstChild) return node.firstChild;
  while (node && node !== root) {
    if (node.nextSibling) return node.nextSibling;
    node = node.parentNode;
  }
  return null;
}

// 🟠
function prevNodeWithinRoot(root, node) {
  if (!node) return null;
  if (node === root) return null;
  if (node.previousSibling) {
    node = node.previousSibling;
    while (node && node.lastChild) node = node.lastChild;
    return node;
  }
  return node.parentNode && node.parentNode !== root
    ? node.parentNode
    : node.parentNode;
}

// 🟠
function nextLeafWithinRoot(root, node) {
  let n = node;
  while ((n = nextNodeWithinRoot(root, n))) {
    if (n.nodeType === Node.TEXT_NODE) return n;
    if (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR") return n;
  }
  return null;
}

// 🟠
function prevLeafWithinRoot(root, node) {
  let n = node;
  while ((n = prevNodeWithinRoot(root, n))) {
    if (n.nodeType === Node.TEXT_NODE) return n;
    if (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR") return n;
  }
  return null;
}

// 🟠 Convert DOM point (node,offset) to the nearest leaf point (Text or BR).
function resolveLeafPoint(root, node, offset, preferForward) {
  if (!node) return null;

  if (node.nodeType === Node.TEXT_NODE) {
    return { leaf: node, leafOffset: offset };
  }
  if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
    return { leaf: node, leafOffset: 0 };
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const children = node.childNodes;

  if (preferForward) {
    const child = children[offset] || null;
    if (child) {
      const lf = firstLeaf(child) || nextLeafWithinRoot(root, child);
      if (lf)
        return {
          leaf: lf,
          leafOffset: lf.nodeType === Node.TEXT_NODE ? 0 : 0,
        };
    }
    const lf = nextLeafWithinRoot(root, node);
    if (lf)
      return {
        leaf: lf,
        leafOffset: lf.nodeType === Node.TEXT_NODE ? 0 : 0,
      };
  } else {
    const child = children[offset - 1] || null;
    if (child) {
      const lf = lastLeaf(child) || prevLeafWithinRoot(root, child);
      if (lf)
        return {
          leaf: lf,
          leafOffset: lf.nodeType === Node.TEXT_NODE ? lf.nodeValue.length : 0,
        };
    }
    const lf = prevLeafWithinRoot(root, node);
    if (lf)
      return {
        leaf: lf,
        leafOffset: lf.nodeType === Node.TEXT_NODE ? lf.nodeValue.length : 0,
      };
  }

  // Fallback: first text leaf in editor
  const fallback = firstLeaf(root);
  if (!fallback) return null;
  return { leaf: fallback, leafOffset: 0 };
}

// 🟠 Count "effective" length of a leaf (Text counts text length excluding ZWSP; BR counts 1).
function leafLen(leaf) {
  if (!leaf) return 0;
  if (leaf.nodeType === Node.ELEMENT_NODE && leaf.tagName === "BR") return 1;
  if (leaf.nodeType === Node.TEXT_NODE) {
    const v = leaf.nodeValue || "";
    return v === ZWSP ? 0 : v.length;
  }
  return 0;
}

// 🟠 DOM-order position counting:
// - iterate editor direct children as blocks
// - within block, iterate leaves (Text + BR)
// - add +1 separator between blocks
function domLeafPointToPos(editor, leaf, leafOffset) {
  // Find all blocks (direct children) that are elements or non-empty text
  const blocks = Array.from(editor.childNodes).filter(
    (n) =>
      n.nodeType === Node.ELEMENT_NODE ||
      (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim() !== ""),
  );

  let pos = 0;

  for (let bi = 0; bi < blocks.length; bi++) {
    const block = blocks[bi];

    const walker = document.createTreeWalker(
      block,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(n) {
          if (n.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
          if (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR")
            return NodeFilter.FILTER_ACCEPT;
          return NodeFilter.FILTER_SKIP;
        },
      },
    );

    let n = walker.nextNode();
    while (n) {
      if (n === leaf) {
        if (n.nodeType === Node.TEXT_NODE) {
          const raw = n.nodeValue || "";
          if (raw === ZWSP) return pos;
          return pos + clamp(leafOffset, 0, raw.length);
        }
        // BR: only offset 0
        return pos;
      }
      pos += leafLen(n);
      n = walker.nextNode();
    }

    // Separator between blocks
    pos += 1;
  }

  return Math.max(0, pos - 1);
}

// 🟠 Convert DOM selection to virtual selection (anchor/focus as linear pos)
function domSelectionToVSelection(editor) {
  const sel = window.getSelection();
  if (!isSelectionInEditor(sel, editor)) return null;

  const a = resolveLeafPoint(editor, sel.anchorNode, sel.anchorOffset, true);
  const f = resolveLeafPoint(editor, sel.focusNode, sel.focusOffset, false);
  if (!a || !f) return null;

  const anchorPos = domLeafPointToPos(editor, a.leaf, a.leafOffset);
  const focusPos = domLeafPointToPos(editor, f.leaf, f.leafOffset);
  return { anchor: { pos: anchorPos }, focus: { pos: focusPos } };
}

// 🟠 Restore DOM selection from virtual selection (pos -> (block, inline, offset) -> span text node)
function vSelectionToDom(editor, doc, index, vSel) {
  if (!vSel) return false;

  const sel = window.getSelection();
  if (!sel) return false;

  const anchor = vPosToDomPoint(editor, doc, index, vSel.anchor.pos);
  const focus = vPosToDomPoint(editor, doc, index, vSel.focus.pos);
  if (!anchor || !focus) return false;

  sel.removeAllRanges();
  // TODO: switch to setStart/setEnd for better backward selection support
  sel.setBaseAndExtent(anchor.node, anchor.offset, focus.node, focus.offset);
  return true;
}

// 🟠 Convert linear pos to DOM point (node, offset)
function vPosToDomPoint(editor, doc, index, pos) {
  doc = vEnsureNonEmptyDoc(doc);

  const { blockIndex, inBlockOffset } = vPosToBlockOffset(index, pos);
  const { inlineIndex, offsetInInline } = vBlockOffsetToInline(
    doc,
    blockIndex,
    inBlockOffset,
  );
  const inl = doc.blocks[blockIndex].inlines[inlineIndex];

  const esc = CSS?.escape ? CSS.escape(inl.id) : inl.id.replace(/"/g, '\\"');
  const el = editor.querySelector(`[data-id="${esc}"]`);
  if (!el) return null;

  const textNode = el.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;

  // If we rendered ZWSP for an empty inline, caret should be at 0
  const raw = textNode.nodeValue || "";
  const maxOff = raw === ZWSP ? 0 : raw.length;
  const off = clamp(offsetInInline, 0, maxOff);

  return { node: textNode, offset: off };
}

// -----------------------------
// Bold toggle in the virtual document
// -----------------------------

// ✅ Get selection range (start,end,isCollapsed,isBackward)
function vGetSelectionRange(vSel) {
  if (!vSel) return null;
  const a = vSel.anchor.pos;
  const f = vSel.focus.pos;
  return {
    start: Math.min(a, f),
    end: Math.max(a, f),
    isCollapsed: a === f,
    isBackward: a > f,
  };
}

// 🟠 Determine if virtual selection is all bolded
function vSelectionAllBold(doc, index, startPos, endPos) {
  const { blocks } = doc;
  const r = { startPos, endPos };

  // Walk blocks; compute overlap in each block.
  let blockGlobal = 0;
  for (let bi = 0; bi < blocks.length; bi++) {
    const b = blocks[bi];
    const blockLen = b.inlines.reduce((s, n) => s + n.text.length, 0);
    const blockStart = blockGlobal;
    const blockEnd = blockGlobal + blockLen;

    const selStart = Math.max(r.startPos, blockStart);
    const selEnd = Math.min(r.endPos, blockEnd);

    if (selStart < selEnd) {
      const inStart = selStart - blockStart;
      const inEnd = selEnd - blockStart;

      let cur = 0;
      for (const inl of b.inlines) {
        const segStart = cur;
        const segEnd = cur + inl.text.length;
        // No overlap at segment end
        if (segEnd <= inStart) {
          cur = segEnd;
          continue;
        }
        // No overlap at segment start so we've passed all overlapping segments
        if (inEnd <= segStart) break;

        // Overlapping segment must be bold
        if (!inl.marks?.bold) return false;
        cur = segEnd;
      }
    }

    blockGlobal += blockLen + 1;
  }
  return true;
}

// 🟠 Toggle bold in virtual document for selection range
function vApplyBold(doc, vSel) {
  doc = vEnsureNonEmptyDoc(doc);
  const index = vBuildIndex(doc);
  const range = vGetSelectionRange(vSel);
  if (!range || range.isCollapsed) return { doc, index, vSel };

  const makeBold = !vSelectionAllBold(doc, index, range.start, range.end);
  const newDoc = vNormalizeDoc(
    vApplyMarkInRange(doc, range.start, range.end, { bold: makeBold }),
  );
  const newIndex = vBuildIndex(newDoc);

  // Keep same linear positions for anchor/focus (text length doesn't change)
  const clampedAnchor = clamp(vSel.anchor.pos, 0, newIndex.docLinearLength);
  const clampedFocus = clamp(vSel.focus.pos, 0, newIndex.docLinearLength);
  const newSel = {
    anchor: { pos: clampedAnchor },
    focus: { pos: clampedFocus },
  };

  return { doc: newDoc, index: newIndex, vSel: newSel };
}

// 🟠 Apply marksPatch to document in [startPos,endPos)
function vApplyMarkInRange(doc, startPos, endPos, marksPatch) {
  const outBlocks = [];
  let global = 0;

  for (let bi = 0; bi < doc.blocks.length; bi++) {
    const b = doc.blocks[bi];
    const blockLen = b.inlines.reduce((s, n) => s + n.text.length, 0);
    const blockStart = global;
    const blockEnd = global + blockLen;

    const selStart = Math.max(startPos, blockStart);
    const selEnd = Math.min(endPos, blockEnd);

    if (selStart >= selEnd) {
      outBlocks.push(b);
    } else {
      const inStart = selStart - blockStart;
      const inEnd = selEnd - blockStart;
      outBlocks.push({
        ...b,
        inlines: vApplyMarkToInlines(b.inlines, inStart, inEnd, marksPatch),
      });
    }

    global += blockLen + 1;
  }

  return { ...doc, blocks: outBlocks };
}

// ✅ Apply marksPatch to inlines overlapping [start,end)
function vApplyMarkToInlines(inlines, start, end, marksPatch) {
  const out = [];
  let cur = 0;

  for (const inl of inlines) {
    const text = inl.text;
    const len = text.length;
    const segStart = cur;
    const segEnd = cur + len;

    // If no overlap, keep as is
    if (segEnd <= start || end <= segStart || len === 0) {
      out.push(inl);
      cur = segEnd;
      continue;
    }

    const s = clamp(start - segStart, 0, len);
    const e = clamp(end - segStart, 0, len);

    if (s > 0) {
      out.push({ ...inl, id: uid(), text: text.slice(0, s) });
    }

    if (e > s) {
      out.push({
        ...inl,
        id: uid(),
        text: text.slice(s, e),
        marks: { ...inl.marks, ...marksPatch },
      });
    }

    if (e < len) {
      out.push({ ...inl, id: uid(), text: text.slice(e) });
    }

    cur = segEnd;
  }

  // Merge adjacent nodes with identical marks (but keep ids stable-ish by keeping the first id)
  const merged = [];
  for (const n of out) {
    const last = merged[merged.length - 1];
    if (last && last.type === "text" && vSameMarks(last.marks, n.marks)) {
      merged[merged.length - 1] = { ...last, text: last.text + n.text };
    } else {
      merged.push(n);
    }
  }

  if (merged.length === 0) return [vCreateText("")];
  return merged;
}

// -----------------------------
// DOM <-> Virtual Doc parsing
// -----------------------------

// ✅ Check if node or its ancestors are bold
function isBoldFromDom(node) {
  let el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  // TODO: change document.body to editor? This is a bug. Change to editor.
  while (el && el !== document.body) {
    const tag = el.tagName;
    // TODO: change to [].includes
    if (tag === "B" || tag === "STRONG") return true;
    // TODO: change checks to be a plugin or function based mechanism
    //   so for bold we would just check for b tags
    //   for <span class="foo"> we would check classList contains foo
    if (el.classList && el.classList.contains("bold")) return true;
    // Inline style fallback
    if (el.style && el.style.fontWeight) {
      const fw = el.style.fontWeight;
      if (fw === "bold") return true;
      const n = Number(fw);
      if (!Number.isNaN(n) && n >= 600) return true;
    }
    el = el.parentElement;
  }
  return false;
}

// ✅ Parse editor DOM to virtual document
function parseEditorToDoc(editor) {
  // Treat direct children as blocks; if none, create one.

  // Find all blocks (direct children) that are elements or non-empty text
  const children = Array.from(editor.childNodes).filter(
    (n) =>
      !(n.nodeType === Node.TEXT_NODE && (n.nodeValue || "").trim() === ""),
  );

  // If no direct children, treat the editor itself as a single block
  const blockEls = children.length ? children : [editor];

  const blocks = blockEls.map((blockNode) => {
    const blockEl =
      blockNode.nodeType === Node.ELEMENT_NODE
        ? blockNode
        : wrapTextNodeAsBlock(blockNode);

    // Collect runs by iterating Text + BR leaves.
    const runs = [];
    const walker = document.createTreeWalker(
      blockEl,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(n) {
          if (n.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
          if (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR") {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        },
      },
    );

    let n = walker.nextNode();
    while (n) {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR") {
        runs.push({ text: "\n", bold: false });
      } else {
        const raw = n.nodeValue || "";
        const text = raw === ZWSP ? "" : raw;
        runs.push({ text, bold: isBoldFromDom(n) });
      }
      n = walker.nextNode();
    }

    // Merge adjacent runs with same bold
    const merged = [];
    for (const r of runs) {
      if (!r.text) continue;
      const prev = merged[merged.length - 1];
      if (prev && prev.bold === r.bold) prev.text += r.text;
      else merged.push({ ...r });
    }

    const inlines =
      merged.length > 0
        ? merged.map((r) => vCreateText(r.text, { bold: r.bold }))
        : [vCreateText("")];

    return vCreateParagraph(inlines);
  });

  return vNormalizeDoc({ type: "doc", blocks });
}

// ✅ Wrap a text node as a paragraph element
function wrapTextNodeAsBlock(textNode) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(textNode.nodeValue || ""));
  return p;
}

function cleanHtml(root) {
  const clonedRoot = root.cloneNode(true);
  const walker = document.createTreeWalker(
    clonedRoot,
    NodeFilter.SHOW_ELEMENT,
    null,
  );

  let node = walker.nextNode();
  while (node) {
    node.removeAttribute("data-id");
    node.removeAttribute("data-bid");
    node = walker.nextNode();
  }

  return clonedRoot;
}
// -----------------------------
// Virtual DOM rendering (minimal diff)
// -----------------------------

// ✅ Virtual html node constructor
function vH(tag, props, children, key) {
  return {
    type: "element",
    tag,
    props: props || {},
    children: children || [],
    key,
  };
}

// ✅ Virtual text node constructor
function vT(text) {
  return {
    type: "text",
    text: text ?? "",
  };
}

// 🟠 Convert virtual document to virtual DOM tree
function vDocToVTree(doc) {
  doc = vEnsureNonEmptyDoc(doc);

  const blockNodes = doc.blocks.map((b) =>
    vH(
      "p",
      { "data-bid": b.id },
      b.inlines.map((inl) => {
        // Render ZWSP for empty text so caret has something to land on.
        const renderedText = inl.text.length === 0 ? ZWSP : inl.text;
        // const cls = "seg" + (inl.marks?.bold ? " bold" : "");
        const cls = inl.marks?.bold ? "font-bold" : "";
        return vH(
          "span",
          { "data-id": inl.id, class: cls },
          [vT(renderedText)],
          inl.id,
        );
      }),
      b.id,
    ),
  );

  return vH("div", {}, blockNodes, "root");
}

// ✅ Create real DOM from virtual node
function createDom(vn) {
  if (vn.type === "text") return document.createTextNode(vn.text);

  const el = document.createElement(vn.tag);
  for (const [k, v] of Object.entries(vn.props || {})) {
    if (k === "class") el.className = v;
    else el.setAttribute(k, String(v));
  }
  for (const c of vn.children || []) el.appendChild(createDom(c));
  return el;
}

// ✅ Render virtual DOM to formatted HTML string (without internal ids)
function vRenderHtml(doc, indent = 0) {
  doc = vEnsureNonEmptyDoc(doc);
  const pad = (n) => "  ".repeat(n);
  const lines = [];

  for (const block of doc.blocks) {
    const inlineHtml = block.inlines
      .map((inl) => {
        const text = inl.text.length === 0 ? ZWSP : inl.text;
        const escaped = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>\n");
        return inl.marks?.bold ? `<b>${escaped}</b>` : escaped;
      })
      .join("");

    lines.push(`${pad(indent)}<p>`);
    lines.push(`${pad(indent + 1)}${inlineHtml}`);
    lines.push(`${pad(indent)}</p>`);
  }

  return lines.join("\n");
}

function vRenderHtmlClean(doc, indent = 0) {
  doc = vEnsureNonEmptyDoc(doc);
  const parts = [];

  for (const block of doc.blocks) {
    const inlineHtml = block.inlines
      .map((inl) => {
        const text = inl.text.length === 0 ? ZWSP : inl.text;
        const escaped = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>\n");
        return inl.marks?.bold ? `<b>${escaped}</b>` : escaped;
      })
      .join("");

    parts.push(`<p>${inlineHtml}</p>`);
  }

  return parts.join("");
}

// ✅ Check if two virtual nodes differ (type/tag/key)
function vNodeChanged(a, b) {
  return (
    // If types differ
    a.type !== b.type ||
    // Or if element tags and keys differ
    (a.type === "element" && (a.tag !== b.tag || a.key !== b.key))
  );
}

// ✅ Update element properties based on diff between newProps and oldProps
function updateProps(el, newProps, oldProps) {
  const np = newProps || {};
  const op = oldProps || {};

  // If old attributes not in new, remove
  for (const k of Object.keys(op)) {
    if (!(k in np)) {
      if (k === "class") el.className = "";
      else el.removeAttribute(k);
    }
  }

  // If new attributes differ, set/update
  for (const [k, v] of Object.entries(np)) {
    if (op[k] === v) continue;
    if (k === "class") el.className = v;
    else el.setAttribute(k, String(v));
  }
}

// 🟠 Performs DOM patching based on virtual DOM diff
function patch(parent, newV, oldV, index = 0) {
  const existing = parent.childNodes[index];
  // Create node if missing
  if (!oldV) {
    parent.appendChild(createDom(newV));
    return;
  }
  // Remove node if removed
  if (!newV) {
    parent.removeChild(existing);
    return;
  }
  // Replace node if changed
  if (vNodeChanged(newV, oldV)) {
    parent.replaceChild(createDom(newV), existing);
    return;
  }
  // Check if text node to update
  if (newV.type === "text") {
    if (existing.nodeValue !== newV.text) existing.nodeValue = newV.text;
    return;
  }
  // At this point, we have an element node to update

  // Update html element attributes based on prop diff
  updateProps(existing, newV.props, oldV.props);

  // Keyed children diff (spans are keyed by inline id; paragraphs keyed by block id)
  const newChildren = newV.children || [];
  const oldChildren = oldV.children || [];

  const oldKeyed = new Map();
  oldChildren.forEach((c, i) => {
    if (c && c.key != null) oldKeyed.set(c.key, { c, i });
  });

  let domIndex = 0;
  const usedOldIndices = new Set();

  for (let i = 0; i < newChildren.length; i++) {
    const nc = newChildren[i];
    let match = null;

    if (nc && nc.key != null && oldKeyed.has(nc.key)) {
      match = oldKeyed.get(nc.key);
    } else if (oldChildren[i]) {
      match = { c: oldChildren[i], i };
    }

    if (match && usedOldIndices.has(match.i)) match = null;

    if (match) {
      usedOldIndices.add(match.i);
      // Ensure DOM order (move existing node if needed)
      const wantNode = existing.childNodes[match.i];
      const atNode = existing.childNodes[domIndex];
      if (wantNode && wantNode !== atNode) {
        existing.insertBefore(wantNode, atNode || null);
      }
      patch(existing, nc, match.c, domIndex);
    } else {
      // Insert new
      existing.insertBefore(
        createDom(nc),
        existing.childNodes[domIndex] || null,
      );
    }
    domIndex++;
  }

  // Remove extra old nodes
  while (existing.childNodes.length > newChildren.length) {
    existing.removeChild(existing.lastChild);
  }
}

// -----------------------------
// App state + wiring
// -----------------------------

const editor = document.getElementById("editor");
const boldBtn = document.getElementById("boldBtn");
const debug = document.getElementById("debug");

let state = {
  doc: vNormalizeDoc({
    type: "doc",
    blocks: [
      vCreateParagraph([
        vCreateText("Select text and toggle "),
        vCreateText("bold", { bold: true }),
        vCreateText("."),
      ]),
      vCreateParagraph([
        vCreateText(
          "This editor keeps content + selection in a virtual model.",
        ),
      ]),
      vCreateParagraph([
        vCreateText("Line with "),
        vCreateText("break\nhere", { bold: false }),
        vCreateText(" continues."),
      ]),
    ],
  }),
  // doc: parseEditorToDoc(editor),
  index: null,
  vTree: null,
  vSel: { anchor: { pos: 0 }, focus: { pos: 0 } },
};

state.index = vBuildIndex(state.doc);

let isRendering = false;

// 🟠 Main render function: diff virtual DOM and patch editor
function render() {
  isRendering = true;

  const newTree = vDocToVTree(state.doc);

  // Patch editor contents to match virtual tree (children of root div)
  // We keep editor as the host, and patch its child list to match newTree.children
  const hostNew = { ...newTree, tag: "host", props: {}, key: "host" };
  const hostOld = state.vTree
    ? { ...state.vTree, tag: "host", props: {}, key: "host" }
    : null;

  // Ensure editor has a stable structure: we patch children directly
  if (!hostOld) {
    // If hostOld doesn't exist, first render: just create all children
    editor.replaceChildren(...(newTree.children || []).map(createDom));
  } else {
    // Create synthetic wrapper to reuse patch() which expects a single node at parent.childNodes[index].
    // We'll patch editor itself by treating it as parent and patching each child position.
    const newKids = newTree.children || [];
    const oldKids = state.vTree.children || [];

    // Patch/insert
    for (let i = 0; i < newKids.length; i++) {
      patch(editor, newKids[i], oldKids[i], i);
    }
    // Remove extras
    while (editor.childNodes.length > newKids.length) {
      editor.removeChild(editor.lastChild);
    }
  }

  state.vTree = newTree;
  state.index = vBuildIndex(state.doc);

  // Restore selection from virtual selection
  vSelectionToDom(editor, state.doc, state.index, state.vSel);

  updateUI();
  isRendering = false;
}

// 🟠 Update UI controls and debug panels based on current state
function updateUI() {
  const range = vGetSelectionRange(state.vSel);
  const collapsed = !range || range.isCollapsed;

  let pressed = false;
  if (!collapsed) {
    pressed = vSelectionAllBold(state.doc, state.index, range.start, range.end);
  }
  boldBtn.setAttribute("aria-pressed", pressed ? "true" : "false");

  // const docLen = state.index.docLinearLength;

  // Update selection panel
  const debugSelection = document.getElementById("debug-selection");
  debugSelection.textContent = JSON.stringify(
    {
      anchor: state.vSel.anchor,
      focus: state.vSel.focus,
      range: range,
      isCollapsed: collapsed,
      docLinearLength: state.index.docLinearLength,
      selectedText: window.getSelection().toString(),
    },
    null,
    2,
  );

  // Update virtual DOM panel
  const debugVdom = document.getElementById("debug-vdom");
  debugVdom.textContent = JSON.stringify(
    {
      blocks: state.doc.blocks.map((b) => ({
        id: b.id.slice(0, 8) + "...",
        text: b.inlines.map((n) => n.text).join(""),
        inlines: b.inlines.map((n) => ({
          text: n.text,
          bold: !!n.marks.bold,
        })),
      })),
    },
    null,
    2,
  );

  // Update rendered HTML panel from virtual DOM
  const debugHtml = document.getElementById("debug-html");
  debugHtml.textContent = vRenderHtml(state.doc);
}

// 🟠 Update virtual selection whenever DOM selection changes.
document.addEventListener("selectionchange", () => {
  if (isRendering) return;

  const sel = window.getSelection();
  if (!isSelectionInEditor(sel, editor)) return;

  const vSel = domSelectionToVSelection(editor);
  if (!vSel) return;

  state.vSel = vSel;
  updateUI();
});

// ✅ Keep virtual doc in sync with user typing/paste.
editor.addEventListener("input", () => {
  if (isRendering) return;

  // Capture selection as virtual positions BEFORE re-render normalizes DOM.
  const vSel = domSelectionToVSelection(editor);

  // Parse DOM -> virtual doc
  state.doc = parseEditorToDoc(editor);
  state.index = vBuildIndex(state.doc);

  // Clamp selection into new doc bounds
  if (vSel) {
    state.vSel = {
      anchor: {
        pos: clamp(vSel.anchor.pos, 0, state.index.docLinearLength),
      },
      focus: {
        pos: clamp(vSel.focus.pos, 0, state.index.docLinearLength),
      },
    };
  }

  render();
});

// ✅ Toggle bold for current selection
function toggleBold() {
  const range = vGetSelectionRange(state.vSel);
  if (!range || range.isCollapsed) return;

  const next = vApplyBold(state.doc, state.vSel);
  state.doc = next.doc;
  state.index = next.index;
  state.vSel = next.vSel;

  render();
}

// ✅ Bold button click handler
boldBtn.addEventListener("click", () => {
  editor.focus();
  toggleBold();
});

// ✅ Ctrl/Cmd+B keyboard shortcut handler
editor.addEventListener("keydown", (e) => {
  const isMod = e.ctrlKey || e.metaKey;
  if (isMod && (e.key === "b" || e.key === "B")) {
    e.preventDefault();
    toggleBold();
  }
});

render();

console.log(state)

// Expose API for testing
window.editorAPI = {
  state,
  render,
  parseEditorToDoc,
  vNormalizeDoc,
  vBuildIndex,
  vCreateParagraph,
  vCreateText,
  cleanHtml,
  vRenderHtml,
  vRenderHtmlClean,
  editor,
};
