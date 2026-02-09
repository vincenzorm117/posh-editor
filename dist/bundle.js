/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/actions/getVirtualSelectionMarks.ts"
/*!*************************************************!*\
  !*** ./src/actions/getVirtualSelectionMarks.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var getOrderedSelection_1 = __importDefault(__webpack_require__(/*! ../utils/getOrderedSelection */ "./src/utils/getOrderedSelection.ts"));
var getIntersectingBlocks = function (virtualBlocks, virtualIndex, startPosition, endPosition) {
    return virtualBlocks.filter(function (block, i) {
        var _a = virtualIndex.blocks[i], globalPosition = _a.globalPosition, length = _a.length;
        var blockStart = globalPosition;
        var blockEnd = blockStart + length;
        return startPosition < blockEnd && blockStart < endPosition;
    });
};
var getIntersectingInlines = function (virtualInlines, virtualIndex, startPosition, endPosition) {
    return virtualInlines.filter(function (_, i) {
        var inline = virtualInlines[i];
        var _a = virtualIndex.inlineById.get(inline.id), globalPosition = _a.globalPosition, length = _a.length;
        var inlineStart = globalPosition;
        var inlineEnd = inlineStart + length;
        return startPosition < inlineEnd && inlineStart < endPosition;
    });
};
var getVirtualSelectionMarks = function (state) {
    var _a;
    var virtualSelection = state.virtualSelection, virtualDocument = state.virtualDocument, virtualIndex = state.virtualIndex;
    if (!virtualSelection ||
        !virtualDocument ||
        !virtualIndex ||
        !virtualSelection.isInsideEditor) {
        return {};
    }
    var _b = (0, getOrderedSelection_1.default)(virtualSelection), startPosition = _b.startPosition, endPosition = _b.endPosition;
    var virtualBlocks = (virtualDocument === null || virtualDocument === void 0 ? void 0 : virtualDocument.blocks) || [];
    var blocks = getIntersectingBlocks(virtualBlocks, virtualIndex, startPosition, endPosition);
    if (blocks.length === 0) {
        return {};
    }
    var markTracker = {};
    var inlines = blocks
        .map(function (block, i) {
        var virtualInlines = blocks[i].children || [];
        if (i === 0 || i === blocks.length - 1) {
            return getIntersectingInlines(virtualInlines, virtualIndex, startPosition, endPosition);
        }
        return virtualInlines;
    })
        .flat();
    for (var _i = 0, inlines_1 = inlines; _i < inlines_1.length; _i++) {
        var inline = inlines_1[_i];
        // TODO: change from hardcoded marks to dynamic from global state
        for (var _c = 0, _d = ['bold']; _c < _d.length; _c++) {
            var mark = _d[_c];
            // Mark as 2 if present, 1 if absent
            var markTrackerValue = !!((_a = inline === null || inline === void 0 ? void 0 : inline.marks) === null || _a === void 0 ? void 0 : _a[mark]) ? 2 : 1;
            if (!markTracker[mark]) {
                markTracker[mark] = markTrackerValue;
            }
            else {
                markTracker[mark] = markTracker[mark] | markTrackerValue;
            }
        }
    }
    var virtualSelectionMarks = {};
    // Determine final mark states
    for (var mark in markTracker) {
        // 2 = all present, 1 = all absent, 3 = mixed
        if (markTracker[mark] === 2) {
            virtualSelectionMarks[mark] = 'true';
        }
        else if (markTracker[mark] === 1) {
            virtualSelectionMarks[mark] = 'false';
        }
        else {
            virtualSelectionMarks[mark] = 'mixed';
        }
    }
    return virtualSelectionMarks;
};
exports["default"] = getVirtualSelectionMarks;


/***/ },

/***/ "./src/actions/virtualApplyBold.ts"
/*!*****************************************!*\
  !*** ./src/actions/virtualApplyBold.ts ***!
  \*****************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var virtualApplyMarksInRange_1 = __importDefault(__webpack_require__(/*! ./virtualApplyMarksInRange */ "./src/actions/virtualApplyMarksInRange.ts"));
var virtualApplyBold = function (state) {
    var _a;
    var virtualSelection = state.virtualSelection;
    if (!virtualSelection)
        return state;
    // If selection is collapsed, do nothing. TODO: expand to apply/remove bold mark
    if (virtualSelection.isCollapsed) {
        return state;
    }
    // Check if selection is already bolded
    var isBolded = ((_a = virtualSelection.marks) === null || _a === void 0 ? void 0 : _a.bold) === 'true';
    // Apply or remove bold mark based on current state
    (0, virtualApplyMarksInRange_1.default)(state, { bold: !isBolded });
};
exports["default"] = virtualApplyBold;


/***/ },

/***/ "./src/actions/virtualApplyMarksInRange.ts"
/*!*************************************************!*\
  !*** ./src/actions/virtualApplyMarksInRange.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var uid_1 = __importDefault(__webpack_require__(/*! ../helpers/uid */ "./src/helpers/uid.ts"));
var clamp_1 = __webpack_require__(/*! ../helpers/clamp */ "./src/helpers/clamp.ts");
var vInlinesHaveSameMarks_1 = __importDefault(__webpack_require__(/*! ../vInlinesHaveSameMarks */ "./src/vInlinesHaveSameMarks.ts"));
var getOrderedSelection_1 = __importDefault(__webpack_require__(/*! ../utils/getOrderedSelection */ "./src/utils/getOrderedSelection.ts"));
var virtualBuildIndex_1 = __importDefault(__webpack_require__(/*! ../virtualBuildIndex */ "./src/virtualBuildIndex.ts"));
var virtualizeSelection_1 = __webpack_require__(/*! ../virtualizeSelection */ "./src/virtualizeSelection.ts");
var virtualApplyMarksInline = function (virtualInlines, inlinesIndex, startPosition, endPosition, marksToApply) {
    var newInlines = [];
    for (var i = 0; i < virtualInlines.length; i++) {
        var inline = virtualInlines[i];
        var _a = inlinesIndex[i], globalPosition = _a.globalPosition, length_1 = _a.length;
        var inlineLength = inline.text.length;
        if (globalPosition + length_1 < startPosition) {
            newInlines.push(inline);
            continue;
        }
        if (endPosition < globalPosition) {
            newInlines.push(inline);
            continue;
        }
        var cutStart = (0, clamp_1.clamp)(startPosition - globalPosition, 0, inlineLength);
        var cutEnd = (0, clamp_1.clamp)(endPosition - globalPosition, 0, inlineLength);
        if (cutEnd < cutStart) {
            throw new Error("Unexpected cutEnd < cutStart: ".concat(cutEnd, " < ").concat(cutStart));
        }
        if (cutStart > 0) {
            newInlines.push(__assign(__assign({}, inline), { id: (0, uid_1.default)(), text: inline.text.slice(0, cutStart) }));
        }
        newInlines.push(__assign(__assign({}, inline), { id: (0, uid_1.default)(), text: inline.text.slice(cutStart, cutEnd), marks: __assign(__assign({}, inline.marks), marksToApply) }));
        if (cutEnd < inlineLength) {
            newInlines.push(__assign(__assign({}, inline), { id: (0, uid_1.default)(), text: inline.text.slice(cutEnd) }));
        }
    }
    // Merge adjacent inlines with same marks
    var mergedInlines = [];
    for (var i = 0; i < newInlines.length; i++) {
        var inline = newInlines[i];
        var topMergedInline = mergedInlines[mergedInlines.length - 1];
        if (topMergedInline && (0, vInlinesHaveSameMarks_1.default)(topMergedInline, inline)) {
            topMergedInline.text += inline.text;
        }
        else {
            mergedInlines.push(inline);
        }
    }
    return mergedInlines;
};
var virtualApplyMarksInRange = function (state, marksToApply) {
    var _a;
    var virtualSelection = state.virtualSelection, virtualDocument = state.virtualDocument, virtualIndex = state.virtualIndex;
    if (!virtualSelection ||
        !virtualDocument ||
        !virtualSelection.isInsideEditor) {
        return;
    }
    var _b = (0, getOrderedSelection_1.default)(virtualSelection), startPosition = _b.startPosition, endPosition = _b.endPosition;
    var newBlocks = [];
    var virtualBlocks = (_a = virtualDocument.blocks) !== null && _a !== void 0 ? _a : [];
    for (var i = 0; i < virtualBlocks.length; i++) {
        var block = virtualBlocks[i];
        var _c = virtualIndex === null || virtualIndex === void 0 ? void 0 : virtualIndex.blocks[i], length_2 = _c.length, globalPosition = _c.globalPosition, inlines = _c.inlines;
        if (globalPosition + length_2 < startPosition) {
            newBlocks.push(block);
            continue;
        }
        if (endPosition < globalPosition) {
            newBlocks.push(block);
            continue;
        }
        newBlocks.push(__assign(__assign({}, block), { children: virtualApplyMarksInline(block.children, inlines, startPosition, endPosition, marksToApply) }));
    }
    state.virtualDocument = {
        type: 'document',
        blocks: newBlocks,
    };
    state.virtualIndex = (0, virtualBuildIndex_1.default)(state);
    state.virtualSelection = (0, virtualizeSelection_1.virtualizeSelection)(state);
};
exports["default"] = virtualApplyMarksInRange;


/***/ },

/***/ "./src/constants.ts"
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CHAR_NEW_LINE = exports.CHAR_ZERO_WIDTH_SPACE = void 0;
exports.CHAR_ZERO_WIDTH_SPACE = '\u200b';
exports.CHAR_NEW_LINE = '\n';


/***/ },

/***/ "./src/debug/debugRenderVirtualDocument.ts"
/*!*************************************************!*\
  !*** ./src/debug/debugRenderVirtualDocument.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var clamp_1 = __webpack_require__(/*! ../helpers/clamp */ "./src/helpers/clamp.ts");
var getOrderedSelection_1 = __importDefault(__webpack_require__(/*! ../utils/getOrderedSelection */ "./src/utils/getOrderedSelection.ts"));
var debugRenderVirtualInline_1 = __importDefault(__webpack_require__(/*! ./debugRenderVirtualInline */ "./src/debug/debugRenderVirtualInline.ts"));
var getUnderscoreLine = function (block, blockIndex, startPosition, endPosition) {
    var globalPosition = blockIndex.globalPosition;
    if (globalPosition + blockIndex.length < startPosition) {
        return undefined;
    }
    if (endPosition < globalPosition) {
        return undefined;
    }
    return block.children.map(function (inline, j) {
        var globalPosition = blockIndex.inlines[j].globalPosition;
        var inlineLength = inline.text.length;
        if (globalPosition + inlineLength < startPosition) {
            return '&nbsp;'.repeat(inlineLength);
        }
        if (endPosition < globalPosition) {
            return '';
        }
        var cutStart = (0, clamp_1.clamp)(startPosition - globalPosition, 0, inlineLength);
        var cutEnd = (0, clamp_1.clamp)(endPosition - globalPosition, 0, inlineLength);
        var underscoreLine = '';
        if (startPosition == endPosition) {
            if (cutEnd === inlineLength) {
                return '&nbsp;'.repeat(cutStart);
            }
            else {
                return '&nbsp;'.repeat(cutStart) + '^';
            }
        }
        else {
            if (0 < cutStart) {
                underscoreLine += '&nbsp;'.repeat(cutStart);
            }
            if (cutEnd > cutStart) {
                underscoreLine += '^'.repeat(cutEnd - cutStart);
            }
        }
        return underscoreLine;
    });
};
var debugRenderVirtualDocument = function (state) {
    var _a;
    try {
        var virtualDocument = state.virtualDocument, virtualSelection = state.virtualSelection, virtualIndex_1 = state.virtualIndex;
        var textBlocks = virtualDocument.blocks.map(function (block) {
            return block.children.map(debugRenderVirtualInline_1.default).join('');
        });
        if (!virtualIndex_1 ||
            !virtualSelection ||
            !virtualSelection.isInsideEditor) {
            return textBlocks
                .map(function (tb) { return "<p class=\"whitespace-pre\">".concat(tb, "</p>"); })
                .join('');
        }
        var _b = (0, getOrderedSelection_1.default)(virtualSelection), startPosition_1 = _b.startPosition, endPosition_1 = _b.endPosition;
        var underscoreLines = virtualDocument.blocks.map(function (block, i) {
            return getUnderscoreLine(block, virtualIndex_1.blocks[i], startPosition_1, endPosition_1);
        });
        var finalDebugRender = '';
        for (var i = 0; i < textBlocks.length; i++) {
            finalDebugRender += "<p class=\"whitespace-pre\">".concat(textBlocks[i], "</p>");
            if (underscoreLines[i]) {
                finalDebugRender += "<p>".concat((_a = underscoreLines[i]) === null || _a === void 0 ? void 0 : _a.join(''), "</p>");
            }
        }
        return finalDebugRender;
    }
    catch (error) {
        return error instanceof Error ? error.message : String(error);
    }
};
exports["default"] = debugRenderVirtualDocument;


/***/ },

/***/ "./src/debug/debugRenderVirtualInline.ts"
/*!***********************************************!*\
  !*** ./src/debug/debugRenderVirtualInline.ts ***!
  \***********************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var debugRenderVirtualInline = function (inline) {
    var _a;
    if ((_a = inline === null || inline === void 0 ? void 0 : inline.marks) === null || _a === void 0 ? void 0 : _a.bold) {
        return "<b class=\"text-[red]\">".concat(inline.text, "</b>");
    }
    return inline.text;
};
exports["default"] = debugRenderVirtualInline;


/***/ },

/***/ "./src/debug/debugUpdateUI.ts"
/*!************************************!*\
  !*** ./src/debug/debugUpdateUI.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var debugRenderVirtualDocument_1 = __importDefault(__webpack_require__(/*! ./debugRenderVirtualDocument */ "./src/debug/debugRenderVirtualDocument.ts"));
var debugUpdateUI = function (state) {
    var _a, _b, _c, _d, _e, _f;
    document.getElementById('cell-in-editor').innerText = ((_a = state.virtualSelection) === null || _a === void 0 ? void 0 : _a.isInsideEditor)
        ? 'In editor'
        : 'Out of editor';
    if ((_b = state.virtualSelection) === null || _b === void 0 ? void 0 : _b.isInsideEditor) {
        document.getElementById('cell-is-collapsed').innerText = ((_c = state
            .virtualSelection) === null || _c === void 0 ? void 0 : _c.isCollapsed)
            ? 'Collapsed'
            : 'Not collapsed';
        document.getElementById('cell-range').innerText = [
            String((_d = state.virtualSelection.anchor) !== null && _d !== void 0 ? _d : 'N/A') || 'N/A',
            String((_e = state.virtualSelection.focus) !== null && _e !== void 0 ? _e : 'N/A') || 'N/A',
        ].join(' – ');
    }
    else {
        document.getElementById('cell-is-collapsed').innerText = '';
        document.getElementById('cell-range').innerText = '';
    }
    document.getElementById("cell-marks").innerText = Object.entries(((_f = state.virtualSelection) === null || _f === void 0 ? void 0 : _f.marks) || {})
        .map(function (_a) {
        var mark = _a[0], isActive = _a[1];
        return isActive != 'false' ? mark : "";
    })
        .join(' ');
    // New: write formatted virtual document JSON
    var virtualDocEl = document.getElementById('virtual-document-json');
    virtualDocEl.innerHTML = (0, debugRenderVirtualDocument_1.default)(state);
};
exports["default"] = debugUpdateUI;


/***/ },

/***/ "./src/devirtualizeSelection.ts"
/*!**************************************!*\
  !*** ./src/devirtualizeSelection.ts ***!
  \**************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
var clamp_1 = __webpack_require__(/*! ./helpers/clamp */ "./src/helpers/clamp.ts");
var virtualPositionToBlockOffset = function (index, position) {
    // Clamp position to valid range
    var p = (0, clamp_1.clamp)(position, 0, index.globalLength);
    // Find block containing position
    for (var _i = 0, _a = index.blocks; _i < _a.length; _i++) {
        var b = _a[_i];
        if (p <= b.globalPosition + b.length) {
            return {
                blockIndex: b.blockIndex,
                inBlockOffset: p - b.globalPosition,
            };
        }
    }
    // Fallback end of last block
    var lastBlock = index.blocks[index.blocks.length - 1];
    return {
        blockIndex: lastBlock.blockIndex,
        inBlockOffset: lastBlock.length,
    };
};
var virtualBlockOffsetToInline = function (vDoc, blockIndex, inBlockOffset) {
    var _a;
    var block = vDoc.blocks[blockIndex];
    var inlines = (_a = block === null || block === void 0 ? void 0 : block.children) !== null && _a !== void 0 ? _a : [];
    var blockPosition = 0;
    for (var _i = 0, inlines_1 = inlines; _i < inlines_1.length; _i++) {
        var inline = inlines_1[_i];
        if (inBlockOffset <= blockPosition + inline.text.length) {
            return {
                inline: inline,
                inInlineOffset: inBlockOffset - blockPosition,
            };
        }
        blockPosition += inline.text.length;
    }
    // Fallback of last inline
    var lastInline = inlines[inlines.length - 1];
    return {
        inline: lastInline,
        inInlineOffset: lastInline.text.length,
    };
};
var devirtualizePosition = function (state, position) {
    var _a;
    var _b = virtualPositionToBlockOffset(state.virtualIndex, position), blockIndex = _b.blockIndex, inBlockOffset = _b.inBlockOffset;
    var _c = virtualBlockOffsetToInline(state.virtualDocument, blockIndex, inBlockOffset), inline = _c.inline, inInlineOffset = _c.inInlineOffset;
    var esc = (CSS === null || CSS === void 0 ? void 0 : CSS.escape)
        ? CSS.escape(inline.id)
        : inline.id.replace(/"/g, '\\"');
    var inlineElement = state.editor.element.querySelector("[data-id=\"".concat(esc, "\"]"));
    if (!inlineElement) {
        console.error('Inline element not found for id: ' + inline.id);
        return null;
    }
    // If not text node return null
    var textNode = inlineElement.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
        console.error('Inline element does not contain text node: ' + inline.id);
        return null;
    }
    //
    var rawText = (_a = textNode.nodeValue) !== null && _a !== void 0 ? _a : '';
    var maxOffset = rawText == constants_1.CHAR_ZERO_WIDTH_SPACE ? 0 : rawText.length;
    var offset = (0, clamp_1.clamp)(inInlineOffset, 0, maxOffset);
    return {
        node: textNode,
        offset: offset,
    };
};
var devirtualizeSelection = function (state) {
    var virtualSelection = state.virtualSelection;
    // Get selection object
    var selection = window.getSelection();
    if (!selection || !virtualSelection)
        return;
    // Convert virtual positions to DOM positions
    var anchorPos = devirtualizePosition(state, virtualSelection.anchor);
    var focusPos = devirtualizePosition(state, virtualSelection.focus);
    // If positions are invalid, do nothing
    if (!anchorPos || !focusPos)
        return;
    // Update selection by clearing existing ranges and adding new range
    selection.removeAllRanges();
    selection.setBaseAndExtent(anchorPos.node, anchorPos.offset, focusPos.node, focusPos.offset);
};
exports["default"] = devirtualizeSelection;


/***/ },

/***/ "./src/didVirtualNodeChange.ts"
/*!*************************************!*\
  !*** ./src/didVirtualNodeChange.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var didVirtualNodeChange = function (oldNode, newNode) {
    return (oldNode.type !== newNode.type ||
        (oldNode.type == 'element' &&
            (oldNode.tag !== newNode.tag ||
                oldNode.key !== newNode.key)));
};
exports["default"] = didVirtualNodeChange;


/***/ },

/***/ "./src/domGenerateMarks.ts"
/*!*********************************!*\
  !*** ./src/domGenerateMarks.ts ***!
  \*********************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var closest_1 = __importDefault(__webpack_require__(/*! ./helpers/closest */ "./src/helpers/closest.ts"));
var domGenerateMarks = function (node) {
    var marks = {};
    // If parent is bold element
    var boldElement = (0, closest_1.default)(node, 'strong, b');
    if (boldElement) {
        marks.bold = true;
    }
    // TODO: expand for other marks
    // // If parent is italic element
    // const italicElement = closest(node, 'em, i');
    // if (italicElement) {
    //   marks.italic = true;
    // }
    // // If parent is underline element
    // const underlineElement = closest(node, 'u');
    // if (underlineElement) {
    //   marks.underline = true;
    // }
    // // If parent is code element
    // const codeElement = closest(node, 'code');
    // if (codeElement) {
    //   marks.code = true;
    // }
    // // If parent is link element
    // const linkElement = closest(node, 'a');
    // if (linkElement) {
    //   const anchor = linkElement as HTMLAnchorElement;
    //   marks.link = {
    //     href: anchor.getAttribute('href') || '',
    //     title: anchor.getAttribute('title') || '',
    //   };
    // }
    return marks;
};
exports["default"] = domGenerateMarks;


/***/ },

/***/ "./src/domIsSelectionInEditor.ts"
/*!***************************************!*\
  !*** ./src/domIsSelectionInEditor.ts ***!
  \***************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.domIsSelectionInEditor = domIsSelectionInEditor;
function domIsSelectionInEditor(sel, editorElement) {
    if (!sel || sel.rangeCount === 0)
        return false;
    return (editorElement.contains(sel.anchorNode) &&
        editorElement.contains(sel.focusNode));
}


/***/ },

/***/ "./src/domIsValidDocument.ts"
/*!***********************************!*\
  !*** ./src/domIsValidDocument.ts ***!
  \***********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.domIsValidList = domIsValidList;
exports.domIsValidInline = domIsValidInline;
exports.domIsValidBlock = domIsValidBlock;
exports.domIsValidDocument = domIsValidDocument;
function domIsValidList(listElement) {
    var listTags = new Set(['UL', 'OL']);
    // Check if it's an allowed list-level element
    if (!listTags.has(listElement.tagName)) {
        return false;
    }
    // Ensure childNodes are only LI elements
    for (var _i = 0, _a = Array.from(listElement.childNodes); _i < _a.length; _i++) {
        var listItemNode = _a[_i];
        // Ignore white space
        if (listItemNode.nodeType === Node.TEXT_NODE &&
            /^\s*$/.test(listItemNode.textContent || '')) {
            continue;
        }
        // If not an element node at this point, invalid
        if (listItemNode.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        // Check if it's an LI element
        var listItemElement = listItemNode;
        if (listItemElement.tagName !== 'LI') {
            return false;
        }
        // Check children of LI for valid inline content
        var inlineElements = Array.from(listItemElement.childNodes);
        for (var _b = 0, inlineElements_1 = inlineElements; _b < inlineElements_1.length; _b++) {
            var inlineElement = inlineElements_1[_b];
            if (!domIsValidInline(inlineElement)) {
                return false;
            }
        }
    }
    // All checks passed
    return true;
}
function domIsValidInline(inlineNode) {
    var inlineTags = new Set([
        'SPAN',
        'STRONG',
        'EM',
        'U',
        'A',
        'CODE',
        'B',
        'I',
        'SUB',
        'SUP',
        'BR',
    ]);
    // Text nodes are allowed at root level
    if (inlineNode.nodeType === Node.TEXT_NODE) {
        return true;
    }
    // If not an element node at this point, invalid
    if (inlineNode.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    var inlineElement = inlineNode;
    // If br element and has no children, valid
    if (inlineElement.tagName === 'BR') {
        return inlineElement.childNodes.length === 0;
    }
    // Check if it's an allowed inline-level element
    if (!inlineTags.has(inlineElement.tagName)) {
        return false;
    }
    // TODO: switch to iterative approach
    // Check children recursively
    for (var _i = 0, _a = Array.from(inlineElement.childNodes); _i < _a.length; _i++) {
        var childNode = _a[_i];
        if (!domIsValidInline(childNode)) {
            return false;
        }
    }
    return true;
}
function domIsValidBlock(blockNode) {
    var allowedBlockTags = new Set([
        'P',
        // 'H1',
        // 'H2',
        // 'H3',
        // 'H4',
        // 'H5',
        // 'H6',
        // 'UL',
        // 'OL',
        // 'LI',
        // 'BLOCKQUOTE',
        // 'PRE',
        // 'DIV',
        // 'HR',
    ]);
    // Text nodes are allowed at root level
    if (blockNode.nodeType === Node.TEXT_NODE) {
        return true;
    }
    // If not an element node at this point, invalid
    if (blockNode.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }
    var blockElement = blockNode;
    // Check if it's an allowed block-level element
    if (!allowedBlockTags.has(blockElement.tagName)) {
        return false;
    }
    if (blockElement.tagName === 'UL' || blockElement.tagName === 'OL') {
        return domIsValidList(blockElement);
    }
    // TODO: switch to iterative approach
    // Check for invalid nesting (e.g., block elements inside inline elements)
    for (var _i = 0, _a = Array.from(blockElement.childNodes); _i < _a.length; _i++) {
        var inlineElement = _a[_i];
        if (!domIsValidInline(inlineElement)) {
            return false;
        }
    }
    // All checks passed
    return true;
}
function domIsValidDocument(editorElement) {
    for (var _i = 0, _a = Array.from(editorElement.childNodes); _i < _a.length; _i++) {
        var blockNode = _a[_i];
        if (!domIsValidBlock(blockNode)) {
            return false;
        }
    }
    return true;
}


/***/ },

/***/ "./src/helpers/clamp.ts"
/*!******************************!*\
  !*** ./src/helpers/clamp.ts ***!
  \******************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.clamp = clamp;
/**
 * Clamps a number between a minimum and maximum value.
 * @param value - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


/***/ },

/***/ "./src/helpers/closest.ts"
/*!********************************!*\
  !*** ./src/helpers/closest.ts ***!
  \********************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Finds the closest ancestor element that matches the specified selector.
 * Handles both element nodes and text nodes by traversing up the DOM tree.
 *
 * @param {Node|null} node - The starting node to search from
 * @param {string} selector - CSS selector string to match against ancestor elements
 * @returns {Element|null} The closest ancestor element that matches the selector, or null if none found
 *
 * @example
 * // Find closest list element
 * const div = closest(textNode, 'ul, ol');
 *
 * @example
 * // Find closest element with class
 * const container = closest(element, '.container');
 */
var closest = function (node, selector) {
    if (node == null)
        return null;
    if (node.nodeType === Node.TEXT_NODE && node.parentElement != null) {
        return node.parentElement.closest(selector);
    }
    return node.closest(selector);
};
exports["default"] = closest;


/***/ },

/***/ "./src/helpers/uid.ts"
/*!****************************!*\
  !*** ./src/helpers/uid.ts ***!
  \****************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var uid;
if (window.hasOwnProperty('crypto') &&
    typeof window.crypto.randomUUID === 'function') {
    uid = function () {
        return window.crypto.randomUUID();
    };
}
else {
    // uid = () => {
    //   // Fallback: generate pseudo-random UID
    //   return 'xxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //     const r = (Math.random() * 16) | 0,
    //       v = c == 'x' ? r : (r & 0x3) | 0x8;
    //     return v.toString(16);
    //   });
    // };
    uid = function () {
        return 'id_' + Math.random().toString(16).slice(2);
    };
}
exports["default"] = uid;


/***/ },

/***/ "./src/index.ts"
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var debugUpdateUI_1 = __importDefault(__webpack_require__(/*! ./debug/debugUpdateUI */ "./src/debug/debugUpdateUI.ts"));
var init_1 = __importDefault(__webpack_require__(/*! ./init */ "./src/init.ts"));
document.addEventListener('DOMContentLoaded', function () {
    // const editor = document.getElementById('editor') as HTMLDivElement | null;
    // const boldBtn = document.getElementById('boldBtn') as HTMLButtonElement | null;
    // console.log(document.querySelector('#editor')?.innerHTML);
    var state = (0, init_1.default)('#editor', {
        bold: { selector: '#boldBtn' },
    });
    // @ts-ignore
    window.state = state;
    (0, debugUpdateUI_1.default)(state);
    console.log(state);
    console.log(9123);
});


/***/ },

/***/ "./src/init.ts"
/*!*********************!*\
  !*** ./src/init.ts ***!
  \*********************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var attachListenerBoldBtn_1 = __importDefault(__webpack_require__(/*! ./listeners/attachListenerBoldBtn */ "./src/listeners/attachListenerBoldBtn.ts"));
var attachListenerInput_1 = __importDefault(__webpack_require__(/*! ./listeners/attachListenerInput */ "./src/listeners/attachListenerInput.ts"));
var attachListenerKeydown_1 = __importDefault(__webpack_require__(/*! ./listeners/attachListenerKeydown */ "./src/listeners/attachListenerKeydown.ts"));
var attachListenerSelectionChange_1 = __importDefault(__webpack_require__(/*! ./listeners/attachListenerSelectionChange */ "./src/listeners/attachListenerSelectionChange.ts"));
var domIsValidDocument_1 = __webpack_require__(/*! ./domIsValidDocument */ "./src/domIsValidDocument.ts");
var render_1 = __importDefault(__webpack_require__(/*! ./render/render */ "./src/render/render.ts"));
var virtualBuildIndex_1 = __importDefault(__webpack_require__(/*! ./virtualBuildIndex */ "./src/virtualBuildIndex.ts"));
var virtualizeDOM_1 = __importDefault(__webpack_require__(/*! ./virtualizeDOM */ "./src/virtualizeDOM.ts"));
var virtualizeSelection_1 = __webpack_require__(/*! ./virtualizeSelection */ "./src/virtualizeSelection.ts");
function init(editorSelector, options) {
    if (options === void 0) { options = {}; }
    // Validate editor element
    var editorElement = document.querySelector(editorSelector);
    if (!editorElement) {
        throw new Error("Editor element not found for selector: ".concat(editorSelector));
    }
    // If invalid DOM structure, throw error
    if (!(0, domIsValidDocument_1.domIsValidDocument)(editorElement)) {
        throw new Error('Invalid DOM structure in editor of: ' + editorElement.innerHTML);
    }
    var state = {
        editor: {
            selector: editorSelector,
            element: editorElement,
        },
    };
    state.virtualDocument = (0, virtualizeDOM_1.default)(editorElement, {
        trimBlockWhiteSpace: true,
        shrinkConsecutiveSpaces: true,
        convertNewlinesToSpaces: true,
    });
    state.virtualIndex = (0, virtualBuildIndex_1.default)(state);
    state.virtualSelection = (0, virtualizeSelection_1.virtualizeSelection)(state);
    (0, attachListenerSelectionChange_1.default)(state);
    (0, attachListenerKeydown_1.default)(state);
    (0, attachListenerInput_1.default)(state);
    if (options.bold) {
        (0, attachListenerBoldBtn_1.default)(state, options.bold.selector);
    }
    (0, render_1.default)(state);
    return state;
}
exports["default"] = init;


/***/ },

/***/ "./src/listeners/attachListenerBoldBtn.ts"
/*!************************************************!*\
  !*** ./src/listeners/attachListenerBoldBtn.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var virtualApplyBold_1 = __importDefault(__webpack_require__(/*! ../actions/virtualApplyBold */ "./src/actions/virtualApplyBold.ts"));
var render_1 = __importDefault(__webpack_require__(/*! ../render/render */ "./src/render/render.ts"));
var debugUpdateUI_1 = __importDefault(__webpack_require__(/*! ../debug/debugUpdateUI */ "./src/debug/debugUpdateUI.ts"));
function attachListenerBoldBtn(state, boldBtnSelector) {
    var _a;
    // If no selector defined, skip
    var hasSelector = ((_a = boldBtnSelector === null || boldBtnSelector === void 0 ? void 0 : boldBtnSelector.length) !== null && _a !== void 0 ? _a : 0) > 0;
    if (!hasSelector)
        return;
    // Attach listener
    var boldBtn = document.querySelector(boldBtnSelector);
    // If button not found, throw error
    if (!boldBtn) {
        throw new Error("Bold button not found for selector: ".concat(boldBtnSelector));
    }
    // Attach click listener
    boldBtn.addEventListener('click', function () {
        (0, virtualApplyBold_1.default)(state);
        (0, render_1.default)(state);
        (0, debugUpdateUI_1.default)(state);
    });
}
exports["default"] = attachListenerBoldBtn;


/***/ },

/***/ "./src/listeners/attachListenerInput.ts"
/*!**********************************************!*\
  !*** ./src/listeners/attachListenerInput.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var render_1 = __importDefault(__webpack_require__(/*! ../render/render */ "./src/render/render.ts"));
var clamp_1 = __webpack_require__(/*! ../helpers/clamp */ "./src/helpers/clamp.ts");
var virtualBuildIndex_1 = __importDefault(__webpack_require__(/*! ../virtualBuildIndex */ "./src/virtualBuildIndex.ts"));
var virtualizeDOM_1 = __importDefault(__webpack_require__(/*! ../virtualizeDOM */ "./src/virtualizeDOM.ts"));
var virtualizeSelection_1 = __webpack_require__(/*! ../virtualizeSelection */ "./src/virtualizeSelection.ts");
var debugUpdateUI_1 = __importDefault(__webpack_require__(/*! ../debug/debugUpdateUI */ "./src/debug/debugUpdateUI.ts"));
var attachListenerInput = function (state) {
    var editorElement = state.editor.element;
    editorElement.addEventListener('input', function (event) {
        var _a, _b, _c, _d, _e, _f;
        state.virtualDocument = (0, virtualizeDOM_1.default)(state.editor.element);
        state.virtualIndex = (0, virtualBuildIndex_1.default)(state);
        var vSel = (0, virtualizeSelection_1.virtualizeSelection)(state);
        state.virtualSelection = __assign(__assign({}, vSel), { anchor: (0, clamp_1.clamp)((_a = vSel.anchor) !== null && _a !== void 0 ? _a : 0, 0, (_c = (_b = state.virtualIndex) === null || _b === void 0 ? void 0 : _b.globalLength) !== null && _c !== void 0 ? _c : 0), focus: (0, clamp_1.clamp)((_d = vSel.focus) !== null && _d !== void 0 ? _d : 0, 0, (_f = (_e = state.virtualIndex) === null || _e === void 0 ? void 0 : _e.globalLength) !== null && _f !== void 0 ? _f : 0) });
        (0, render_1.default)(state);
        (0, debugUpdateUI_1.default)(state);
    });
};
exports["default"] = attachListenerInput;


/***/ },

/***/ "./src/listeners/attachListenerKeydown.ts"
/*!************************************************!*\
  !*** ./src/listeners/attachListenerKeydown.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var virtualApplyBold_1 = __importDefault(__webpack_require__(/*! ../actions/virtualApplyBold */ "./src/actions/virtualApplyBold.ts"));
var render_1 = __importDefault(__webpack_require__(/*! ../render/render */ "./src/render/render.ts"));
var attachListenerKeydown = function (state) {
    var editor = state.editor.element;
    // Keyboard shortcut (Ctrl/Cmd + B)
    editor.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            (0, virtualApplyBold_1.default)(state);
            (0, render_1.default)(state);
        }
    });
};
exports["default"] = attachListenerKeydown;


/***/ },

/***/ "./src/listeners/attachListenerSelectionChange.ts"
/*!********************************************************!*\
  !*** ./src/listeners/attachListenerSelectionChange.ts ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var debugUpdateUI_1 = __importDefault(__webpack_require__(/*! ../debug/debugUpdateUI */ "./src/debug/debugUpdateUI.ts"));
var virtualizeSelection_1 = __webpack_require__(/*! ../virtualizeSelection */ "./src/virtualizeSelection.ts");
function attachListenerSelectionChange(state) {
    // Update button state on selection change
    document.addEventListener('selectionchange', function () {
        state.virtualSelection = (0, virtualizeSelection_1.virtualizeSelection)(state);
        (0, debugUpdateUI_1.default)(state);
    });
}
exports["default"] = attachListenerSelectionChange;


/***/ },

/***/ "./src/render/domCreateNode.ts"
/*!*************************************!*\
  !*** ./src/render/domCreateNode.ts ***!
  \*************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var domCreateNode = function (node) {
    var _a;
    // If text node, create text node
    if (node.type == 'text')
        return document.createTextNode(node.text);
    // Else, element node
    var element = document.createElement(node.tag);
    // Set HTML attributes
    for (var _i = 0, _b = Object.entries(node.props); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        element.setAttribute(key, String(value));
    }
    // Recursively create and append child nodes
    var children = (_a = node === null || node === void 0 ? void 0 : node.children) !== null && _a !== void 0 ? _a : [];
    for (var _d = 0, children_1 = children; _d < children_1.length; _d++) {
        var child = children_1[_d];
        element.appendChild(domCreateNode(child));
    }
    // Return created element
    return element;
};
exports["default"] = domCreateNode;


/***/ },

/***/ "./src/render/domUpdateHtmlProps.ts"
/*!******************************************!*\
  !*** ./src/render/domUpdateHtmlProps.ts ***!
  \******************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function domUpdateHtmlProps(oldNode, newNode, oldElement) {
    var _a, _b;
    var oldProps = (_a = oldNode.props) !== null && _a !== void 0 ? _a : {};
    var newProps = (_b = newNode.props) !== null && _b !== void 0 ? _b : {};
    // Remove attributes that don't exist anymroe
    for (var _i = 0, _c = Object.keys(oldProps); _i < _c.length; _i++) {
        var key = _c[_i];
        if (!newProps.hasOwnProperty(key)) {
            oldElement.removeAttribute(key);
        }
    }
    // Only update the attributes that have changed
    for (var _d = 0, _e = Object.entries(newProps); _d < _e.length; _d++) {
        var _f = _e[_d], key = _f[0], value = _f[1];
        if (oldProps[key] != value) {
            oldElement.setAttribute(key, value);
        }
    }
}
exports["default"] = domUpdateHtmlProps;


/***/ },

/***/ "./src/render/patch.ts"
/*!*****************************!*\
  !*** ./src/render/patch.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var didVirtualNodeChange_1 = __importDefault(__webpack_require__(/*! ../didVirtualNodeChange */ "./src/didVirtualNodeChange.ts"));
var domCreateNode_1 = __importDefault(__webpack_require__(/*! ./domCreateNode */ "./src/render/domCreateNode.ts"));
var domUpdateHtmlProps_1 = __importDefault(__webpack_require__(/*! ./domUpdateHtmlProps */ "./src/render/domUpdateHtmlProps.ts"));
function patch(parent, oldNode, newNode, index) {
    var _a, _b, _c, _d, _e;
    var oldElement = parent.childNodes[index];
    if (!oldNode) {
        parent.appendChild((0, domCreateNode_1.default)(newNode));
        return;
    }
    if (!newNode) {
        parent.removeChild(oldElement);
        return;
    }
    if (!(0, didVirtualNodeChange_1.default)(oldNode, newNode)) {
        parent.replaceChild((0, domCreateNode_1.default)(newNode), oldElement);
        return;
    }
    if (newNode.type === 'text') {
        if (oldElement.nodeValue != newNode.text) {
            oldElement.nodeValue = newNode.text;
        }
        return;
    }
    (0, domUpdateHtmlProps_1.default)(oldNode, newNode, oldElement);
    oldNode = oldNode;
    newNode = newNode;
    var oldChildren = (_a = oldNode.children) !== null && _a !== void 0 ? _a : [];
    var newChildren = (_b = newNode.children) !== null && _b !== void 0 ? _b : [];
    // Build map of old children by id
    var oldChildrenMap = new Map();
    oldChildren.forEach(function (node, index) {
        if ('key' in node)
            oldChildrenMap.set(node.key, { node: node, index: index });
    });
    // Build set of used old child keys
    var usedOldChildKeys = new Set();
    // TODO: Can swap domIndex in favor for index i?
    var domIndex = 0;
    // Loop through new children and patch
    for (var i = 0; i < newChildren.length; i++) {
        var newChild = newChildren[i];
        var match = null;
        // Look up corresponding old child with same key
        if (newChild.hasOwnProperty('key') &&
            oldChildrenMap.has(newChild.key)) {
            match = oldChildrenMap.get(newChild.key);
        }
        // TODO: Test this line. I think it will be buggy when oldChildren and newChildren have different lengths.
        // else if(oldChildren[i]) {
        //   match = { node: oldChildren[i], index: i };
        // }
        // If match found but already used, discard
        if (match &&
            !usedOldChildKeys.has(match.node.key)) {
            match = null;
        }
        // If match found, patch
        if (match) {
            // Mark old child as used
            usedOldChildKeys.add(match.node.key);
            // Ensure DOM order
            var currentDomChild = (_c = oldElement.childNodes[domIndex]) !== null && _c !== void 0 ? _c : null;
            var matchDomChild = (_d = oldElement.childNodes[match.index]) !== null && _d !== void 0 ? _d : null;
            if (currentDomChild !== matchDomChild) {
                oldElement.insertBefore(matchDomChild, currentDomChild);
            }
            // patch
            patch(oldElement, match.node, newChild, domIndex);
        }
        else {
            // Insert new child
            var matchDomChild = (_e = oldElement.childNodes[domIndex]) !== null && _e !== void 0 ? _e : null;
            oldElement.insertBefore((0, domCreateNode_1.default)(newChild), matchDomChild);
        }
        domIndex++;
    }
    // Remove extra old nodes
    while (oldElement.childNodes.length > newChildren.length) {
        oldElement.removeChild(oldElement.lastChild);
    }
}
exports["default"] = patch;


/***/ },

/***/ "./src/render/render.ts"
/*!******************************!*\
  !*** ./src/render/render.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var devirtualizeSelection_1 = __importDefault(__webpack_require__(/*! ../devirtualizeSelection */ "./src/devirtualizeSelection.ts"));
var domCreateNode_1 = __importDefault(__webpack_require__(/*! ./domCreateNode */ "./src/render/domCreateNode.ts"));
var patch_1 = __importDefault(__webpack_require__(/*! ./patch */ "./src/render/patch.ts"));
var vDocToVTree_1 = __importDefault(__webpack_require__(/*! ../vDocToVTree */ "./src/vDocToVTree.ts"));
var virtualBuildIndex_1 = __importDefault(__webpack_require__(/*! ../virtualBuildIndex */ "./src/virtualBuildIndex.ts"));
function render(state) {
    var _a, _b, _c;
    var newTree = (0, vDocToVTree_1.default)(state.virtualDocument);
    var editorElement = state.editor.element;
    // If no existing virtualTree, replace HTML
    if (!state.virtualTree) {
        var newChildren = ((_a = newTree === null || newTree === void 0 ? void 0 : newTree.children) !== null && _a !== void 0 ? _a : []).map(domCreateNode_1.default);
        editorElement.replaceChildren.apply(editorElement, newChildren);
    }
    else {
        var oldChildren = (_b = state.virtualTree.children) !== null && _b !== void 0 ? _b : [];
        var newChildren = (_c = newTree.children) !== null && _c !== void 0 ? _c : [];
        for (var i = 0; i < newChildren.length; i++) {
            (0, patch_1.default)(editorElement, oldChildren[i], newChildren[i], i);
        }
        while (editorElement.childNodes.length > newChildren.length) {
            editorElement.removeChild(editorElement.lastChild);
        }
    }
    state.virtualTree = newTree;
    state.virtualIndex = (0, virtualBuildIndex_1.default)(state);
    (0, devirtualizeSelection_1.default)(state);
}
exports["default"] = render;


/***/ },

/***/ "./src/trimVirtualBlockWhiteSpace.ts"
/*!*******************************************!*\
  !*** ./src/trimVirtualBlockWhiteSpace.ts ***!
  \*******************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Trims leading whitespace from the first inline element and trailing whitespace
 * from the last inline element within a virtual block.
 *
 * @param block - The virtual block whose inline children will have whitespace trimmed
 * @returns The modified virtual block with trimmed whitespace on boundary inline elements
 *
 * @remarks
 * If the block has no children, it is returned unchanged.
 * This function mutates the text property of the first and last inline children.
 *
 * @example
 * ```typescript
 * const block = {
 *   children: [
 *     { text: '  Hello' },
 *     { text: 'World  ' }
 *   ]
 * };
 * const trimmed = trimVirtualBlockWhiteSpace(block);
 * // block.children[0].text is now 'Hello'
 * // block.children[1].text is now 'World'
 * ```
 */
var trimVirtualBlockWhiteSpace = function (block) {
    if (block.children.length === 0) {
        return block;
    }
    // Trim left side of first inline
    var firstInline = block.children[0];
    firstInline.text = firstInline.text.replace(/^\s+/g, '');
    // Trim right side of last inline
    var lastInline = block.children[block.children.length - 1];
    lastInline.text = lastInline.text.replace(/\s+$/g, '');
    return block;
};
exports["default"] = trimVirtualBlockWhiteSpace;


/***/ },

/***/ "./src/utils/getOrderedSelection.ts"
/*!******************************************!*\
  !*** ./src/utils/getOrderedSelection.ts ***!
  \******************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Returns the ordered start and end positions from a given virtual selection.
 *
 * @param vSelection - The virtual selection object containing `anchor` and `focus` positions.
 * @returns An object with `startPosition` and `endPosition`, where `startPosition` is less than or equal to `endPosition`.
 * @throws {Error} If either `anchor` or `focus` is undefined in the provided selection.
 */
var getOrderedSelection = function (vSelection) {
    var anchor = vSelection.anchor, focus = vSelection.focus;
    // If either is undefined, return both as undefined
    if (anchor === undefined || focus === undefined) {
        throw new Error('Both anchor and focus must be defined in virtual selection');
    }
    //
    return anchor <= focus
        ? { startPosition: anchor, endPosition: focus }
        : { startPosition: focus, endPosition: anchor };
};
exports["default"] = getOrderedSelection;


/***/ },

/***/ "./src/vCreateBlock.ts"
/*!*****************************!*\
  !*** ./src/vCreateBlock.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var uid_1 = __importDefault(__webpack_require__(/*! ./helpers/uid */ "./src/helpers/uid.ts"));
var vCreateBlock = function (tag, children) {
    if (children === void 0) { children = []; }
    return {
        type: 'element',
        id: (0, uid_1.default)(),
        tag: tag,
        children: children,
    };
};
exports["default"] = vCreateBlock;


/***/ },

/***/ "./src/vCreateInline.ts"
/*!******************************!*\
  !*** ./src/vCreateInline.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var uid_1 = __importDefault(__webpack_require__(/*! ./helpers/uid */ "./src/helpers/uid.ts"));
var vCreateInline = function (text, marks, options) {
    if (marks === void 0) { marks = {}; }
    if (options === void 0) { options = {}; }
    if (options.convertNewlinesToSpaces) {
        text = text.replace(/\n/g, ' ');
    }
    if (options.shrinkConsecutiveSpaces) {
        text = text.replace(/  +/g, ' ');
    }
    return {
        type: 'inline',
        id: (0, uid_1.default)(),
        text: text,
        marks: marks,
    };
};
exports["default"] = vCreateInline;


/***/ },

/***/ "./src/vDocToVTree.ts"
/*!****************************!*\
  !*** ./src/vDocToVTree.ts ***!
  \****************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
function vH(tag, props, key, children) {
    if (props === void 0) { props = {}; }
    if (children === void 0) { children = []; }
    return {
        type: 'element',
        tag: tag,
        props: props,
        children: children,
        key: key,
    };
}
function vT(text) {
    return {
        type: 'text',
        text: text !== null && text !== void 0 ? text : '',
    };
}
var vDocToVTree = function (vDoc) {
    var blockNodes = vDoc.blocks.map(function (block) {
        return vH(block.tag, { 'data-id': block.id }, block.id, block.children.map(function (inline) {
            var text = inline.text.length === 0 ? constants_1.CHAR_ZERO_WIDTH_SPACE : inline.text;
            var tag = inline.marks['bold'] == true ? 'b' : 'span';
            return vH(tag, { 'data-id': inline.id }, inline.id, [vT(text)]);
        }));
    });
    return vH('div', {}, 'root', blockNodes);
};
exports["default"] = vDocToVTree;


/***/ },

/***/ "./src/vInlinesHaveSameMarks.ts"
/*!**************************************!*\
  !*** ./src/vInlinesHaveSameMarks.ts ***!
  \**************************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Compares two virtual inline elements to determine if they have identical marks.
 *
 * @param inlineA - The first virtual inline element to compare
 * @param inlineB - The second virtual inline element to compare
 * @returns `true` if both inlines have the same marks with identical values, `false` otherwise
 *
 * @remarks
 * This function performs a deep comparison of the marks objects:
 * - Returns `false` if the number of marks differs between the two inlines
 * - Returns `false` if any mark key exists in one inline but not the other
 * - Returns `false` if any mark value differs between the two inlines
 * - Returns `true` only when all marks and their values match exactly
 *
 * @example
 * ```typescript
 * const inline1 = { marks: { bold: true, italic: true } };
 * const inline2 = { marks: { bold: true, italic: true } };
 * vInlinesHaveSameMarks(inline1, inline2); // returns true
 *
 * const inline3 = { marks: { bold: true } };
 * vInlinesHaveSameMarks(inline1, inline3); // returns false
 * ```
 */
var vInlinesHaveSameMarks = function (inlineA, inlineB) {
    var _a, _b;
    // Get marks as entries
    var marksA = Object.entries((_a = inlineA === null || inlineA === void 0 ? void 0 : inlineA.marks) !== null && _a !== void 0 ? _a : {});
    var marksB = Object.entries((_b = inlineB === null || inlineB === void 0 ? void 0 : inlineB.marks) !== null && _b !== void 0 ? _b : {});
    // If different number of marks, not same
    if (marksA.length !== marksB.length) {
        return false;
    }
    // Check each mark key and value
    for (var _i = 0, marksA_1 = marksA; _i < marksA_1.length; _i++) {
        var _c = marksA_1[_i], key = _c[0], value = _c[1];
        // If key not in inlineB, not same
        if (inlineB.marks.hasOwnProperty(key) === false) {
            return false;
        }
        // If value different, not same
        if (inlineB.marks[key] !== value) {
            return false;
        }
    }
    // All marks match
    return true;
};
exports["default"] = vInlinesHaveSameMarks;


/***/ },

/***/ "./src/virtualBuildIndex.ts"
/*!**********************************!*\
  !*** ./src/virtualBuildIndex.ts ***!
  \**********************************/
(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var virtualBuildIndex = function (state) {
    var _a, _b;
    var blocks = [];
    var inlineById = new Map();
    var globalPosition = 0;
    var virtualBlocks = (_b = (_a = state.virtualDocument) === null || _a === void 0 ? void 0 : _a.blocks) !== null && _b !== void 0 ? _b : [];
    for (var blockIndex = 0; blockIndex < virtualBlocks.length; blockIndex++) {
        var block = virtualBlocks[blockIndex];
        var blockPosition = 0;
        var virtualInlineIndexes = [];
        var virtualBlockIndex = {
            blockIndex: blockIndex,
            id: block.id,
            globalPosition: globalPosition,
        };
        for (var inlineIndex = 0; inlineIndex < block.children.length; inlineIndex++) {
            var inline = block.children[inlineIndex];
            var virtualInlineIndex = {
                blockIndex: blockIndex,
                inlineIndex: inlineIndex,
                globalPosition: globalPosition,
                blockPosition: blockPosition,
                length: inline.text.length,
                id: inline.id,
            };
            inlineById.set(inline.id, virtualInlineIndex);
            virtualInlineIndexes.push(virtualInlineIndex);
            blockPosition += inline.text.length;
            globalPosition += inline.text.length;
        }
        blocks.push(__assign(__assign({}, virtualBlockIndex), { length: blockPosition, inlines: virtualInlineIndexes }));
        globalPosition += +1;
    }
    return {
        blocks: blocks,
        inlineById: inlineById,
        globalLength: Math.max(0, globalPosition - 1),
    };
};
exports["default"] = virtualBuildIndex;


/***/ },

/***/ "./src/virtualizeBlock.ts"
/*!********************************!*\
  !*** ./src/virtualizeBlock.ts ***!
  \********************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
var domGenerateMarks_1 = __importDefault(__webpack_require__(/*! ./domGenerateMarks */ "./src/domGenerateMarks.ts"));
var vCreateBlock_1 = __importDefault(__webpack_require__(/*! ./vCreateBlock */ "./src/vCreateBlock.ts"));
var vCreateInline_1 = __importDefault(__webpack_require__(/*! ./vCreateInline */ "./src/vCreateInline.ts"));
var vInlinesHaveSameMarks_1 = __importDefault(__webpack_require__(/*! ./vInlinesHaveSameMarks */ "./src/vInlinesHaveSameMarks.ts"));
var virtualizeBlock = function (blockNode, options) {
    var _a, _b;
    if (options === void 0) { options = {}; }
    // If text node, create a paragraph block and wrap text
    if (blockNode.nodeType === Node.TEXT_NODE) {
        var text = (_a = blockNode.textContent) !== null && _a !== void 0 ? _a : '';
        return (0, vCreateBlock_1.default)('p', [(0, vCreateInline_1.default)(text, {}, options)]);
    }
    // If not an element node at this point, throw error
    if (blockNode.nodeType !== Node.ELEMENT_NODE) {
        throw new Error('Unsupported node type in editor');
    }
    var elementBlockNode = blockNode;
    // Create a TreeWalker to traverse text nodes and <br> elements
    var walker = document.createTreeWalker(elementBlockNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
            // If text node or br element, accept
            if (node.nodeType === Node.TEXT_NODE ||
                (node.nodeType === Node.ELEMENT_NODE &&
                    node.tagName == 'BR')) {
                return NodeFilter.FILTER_ACCEPT;
            }
            // else, skip
            return NodeFilter.FILTER_SKIP;
        },
    });
    // Iterate through accepted nodes and add to block children
    var newChildren = [];
    var n;
    while ((n = walker.nextNode())) {
        // If text node, add text inline
        if (n.nodeType === Node.ELEMENT_NODE &&
            n.tagName === 'BR') {
            newChildren.push((0, vCreateInline_1.default)('\n', {}, options));
        }
        // Rest of the nodes must be text nodes
        if (n.nodeType !== Node.TEXT_NODE) {
            throw new Error('Unsupported node type in virtualizeBlock');
        }
        // TODO: experiment with CHAR_ZERO_WIDTH_SPACE handling
        var text = (_b = n.textContent) !== null && _b !== void 0 ? _b : '';
        text = text == constants_1.CHAR_ZERO_WIDTH_SPACE ? '' : text;
        newChildren.push((0, vCreateInline_1.default)(text, (0, domGenerateMarks_1.default)(n), options));
    }
    // Merge consecutive text inlines
    var mergedChildren = [];
    for (var _i = 0, newChildren_1 = newChildren; _i < newChildren_1.length; _i++) {
        var child = newChildren_1[_i];
        // Ignore null/undefined text
        if (!child.text)
            continue;
        // Keep reference to previous merged child
        var prevMergedChild = mergedChildren[mergedChildren.length - 1];
        // Combine text nodes with same marks, else add new
        if (prevMergedChild && (0, vInlinesHaveSameMarks_1.default)(prevMergedChild, child)) {
            prevMergedChild.text += child.text;
        }
        else {
            mergedChildren.push(child);
        }
    }
    return (0, vCreateBlock_1.default)('p', mergedChildren.length > 0 ? mergedChildren : [(0, vCreateInline_1.default)('')]);
};
exports["default"] = virtualizeBlock;


/***/ },

/***/ "./src/virtualizeDOM.ts"
/*!******************************!*\
  !*** ./src/virtualizeDOM.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var trimVirtualBlockWhiteSpace_1 = __importDefault(__webpack_require__(/*! ./trimVirtualBlockWhiteSpace */ "./src/trimVirtualBlockWhiteSpace.ts"));
var virtualizeBlock_1 = __importDefault(__webpack_require__(/*! ./virtualizeBlock */ "./src/virtualizeBlock.ts"));
function virtualizeDOM(editorElement, options) {
    if (options === void 0) { options = {}; }
    // TODO: reexamine filtering logic
    // Filter out text nodes that are empty or only whitespace
    var nonEmptyBlockNodes = Array.from(editorElement.childNodes).filter(function (n) {
        var _a;
        return !(n.nodeType == Node.TEXT_NODE && !/\S/.test((_a = n.textContent) !== null && _a !== void 0 ? _a : ''));
    });
    var vDoc = {
        type: 'document',
        blocks: nonEmptyBlockNodes.map(function (bn) { return (0, virtualizeBlock_1.default)(bn, options); }),
    };
    if (options.trimBlockWhiteSpace) {
        vDoc.blocks = vDoc.blocks.map(trimVirtualBlockWhiteSpace_1.default);
    }
    return vDoc;
}
exports["default"] = virtualizeDOM;


/***/ },

/***/ "./src/virtualizeSelection.ts"
/*!************************************!*\
  !*** ./src/virtualizeSelection.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.virtualizeSelection = virtualizeSelection;
var getVirtualSelectionMarks_1 = __importDefault(__webpack_require__(/*! ./actions/getVirtualSelectionMarks */ "./src/actions/getVirtualSelectionMarks.ts"));
var constants_1 = __webpack_require__(/*! ./constants */ "./src/constants.ts");
var domIsSelectionInEditor_1 = __webpack_require__(/*! ./domIsSelectionInEditor */ "./src/domIsSelectionInEditor.ts");
var clamp_1 = __webpack_require__(/*! ./helpers/clamp */ "./src/helpers/clamp.ts");
function domNextNodeWithinRoot(root, node) {
    if (!node)
        return null;
    if (node.firstChild)
        return node.firstChild;
    while (node && node !== root) {
        if (node.nextSibling)
            return node.nextSibling;
        node = node.parentNode;
    }
    return null;
}
function domNextLeafWithinRoot(root, node) {
    var n = node;
    while ((n = domNextNodeWithinRoot(root, n))) {
        if (n === null)
            return null;
        if (n.nodeType === Node.TEXT_NODE)
            return n;
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'BR')
            return n;
    }
    return null;
}
function domFirstLeaf(node) {
    // If node is null, return null
    if (!node)
        return null;
    // If text node, return node
    if (node.nodeType === Node.TEXT_NODE)
        return node;
    // TODO: this case would never fire, consider removing
    // If BR element node, return node
    if (node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'BR')
        return node;
    // TODO: convert to iterative to avoid deep recursion
    // Check children recursively for first leaf
    for (var _i = 0, _a = Array.from(node.childNodes); _i < _a.length; _i++) {
        var child = _a[_i];
        var leaf = domFirstLeaf(child);
        if (leaf)
            return leaf;
    }
    // If no leaf found, return null
    return null;
}
function domNextLeafPoint(root, node, offset) {
    if (!node)
        return null;
    // If text node, return its info
    if (node.nodeType === Node.TEXT_NODE) {
        return { node: node, offset: offset };
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
        throw new Error("Unexpected node type \"".concat(node.nodeType, "\""));
    }
    var element = node;
    // TODO: this case would never fire, consider removing
    // If br html element, return as text node with offset 0
    if (element.tagName === 'BR') {
        return { node: node, offset: 0 };
    }
    var child = element.childNodes[offset];
    if (child) {
        var firstLeaf = void 0;
        // Get first leaf of child at offset if it exists
        firstLeaf = domFirstLeaf(child);
        if (firstLeaf) {
            return { node: firstLeaf, offset: 0 };
        }
        // Else, find next leaf within root
        var nextLeaf_1 = domNextLeafWithinRoot(root, child);
        if (nextLeaf_1) {
            return { node: nextLeaf_1, offset: 0 };
        }
    }
    // Else, find next leaf within root
    var nextLeaf = domNextLeafWithinRoot(root, element);
    if (nextLeaf) {
        return { node: nextLeaf, offset: 0 };
    }
    // If no leaf found, return null
    return null;
}
function domPrevNodeWithinRoot(root, node) {
    if (!node)
        return null;
    if (node.previousSibling) {
        node = node.previousSibling;
        // Go to the deepest last child
        while (node.lastChild) {
            node = node.lastChild;
        }
        return node;
    }
    if (node.parentNode && node.parentNode !== root) {
        return node.parentNode;
    }
    return null;
}
function domPrevLeafWithinRoot(root, node) {
    var n = node;
    while ((n = domPrevNodeWithinRoot(root, n))) {
        if (n === null)
            return null;
        if (n.nodeType === Node.TEXT_NODE)
            return n;
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'BR')
            return n;
    }
    return null;
}
function domLastLeaf(node) {
    // If node is null, return null
    if (!node)
        return null;
    // If text node, return node
    if (node.nodeType === Node.TEXT_NODE)
        return node;
    // TODO: this case would never fire, consider removing
    // If BR element node, return node
    if (node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'BR')
        return node;
    // Check children recursively for last leaf
    for (var i = node.childNodes.length - 1; i >= 0; i--) {
        var child = node.childNodes[i];
        var leaf = domLastLeaf(child);
        if (leaf)
            return leaf;
    }
    // If no leaf found, return null
    return null;
}
function domPrevLeafPoint(root, node, offset) {
    var _a, _b, _c;
    if (!node)
        return null;
    // If text node, return its info
    if (node.nodeType === Node.TEXT_NODE) {
        return { node: node, offset: offset };
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
        throw new Error("Unexpected node type \"".concat(node.nodeType, "\""));
    }
    var element = node;
    // TODO: this case would never fire, consider removing
    // If br html element, return as text node with offset 0
    if (element.tagName === 'BR') {
        return { node: node, offset: 0 };
    }
    var child = element.childNodes[offset - 1];
    if (child) {
        var lastleaf = void 0;
        // Get last leaf of child at offset if it exists
        lastleaf = domLastLeaf(child);
        if (lastleaf) {
            return { node: lastleaf, offset: ((_a = lastleaf.textContent) !== null && _a !== void 0 ? _a : '').length };
        }
        // Else, find previous leaf within root
        var prevLeaf_1 = domPrevLeafWithinRoot(root, child);
        if (prevLeaf_1) {
            return {
                node: prevLeaf_1,
                offset: ((_b = prevLeaf_1.textContent) !== null && _b !== void 0 ? _b : '').length,
            };
        }
    }
    // Else, find previous leaf within root
    var prevLeaf = domPrevLeafWithinRoot(root, element);
    if (prevLeaf) {
        return { node: prevLeaf, offset: ((_c = prevLeaf.textContent) !== null && _c !== void 0 ? _c : '').length };
    }
    // If no leaf found, return null
    return null;
}
function leafLength(leaf) {
    var _a;
    if (!leaf)
        return 0;
    if (leaf.nodeType === Node.TEXT_NODE) {
        var text = (_a = leaf.textContent) !== null && _a !== void 0 ? _a : '';
        return text == constants_1.CHAR_ZERO_WIDTH_SPACE ? 0 : text.length;
    }
    if (leaf.nodeType === Node.ELEMENT_NODE &&
        leaf.tagName === 'BR') {
        return 1;
    }
    // TODO: didn't include the leaf.nodeType === Node.ELEMENT_NODE case in original, consider removing everywhere and rely on domIsValidDocument more
    return 0;
}
function domLeafPointToVirtualOffset(root, point) {
    var _a;
    // Get blocks that are element nodes or non-empty text nodes
    var blocks = Array.from(root.childNodes).filter(function (n) {
        var _a;
        return n.nodeType === Node.ELEMENT_NODE ||
            (n.nodeType === Node.TEXT_NODE && ((_a = n === null || n === void 0 ? void 0 : n.nodeValue) === null || _a === void 0 ? void 0 : _a.trim()) !== '');
    });
    var virtualOffset = 0;
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        // Get walker for text nodes and br elements within block
        var walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
            acceptNode: function (node) {
                return node.nodeType === Node.TEXT_NODE ||
                    (node.nodeType === Node.ELEMENT_NODE &&
                        node.tagName === 'BR')
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_SKIP;
            },
        });
        var n = walker.nextNode();
        while (n) {
            if (n == point.node) {
                // If text node
                if (n.nodeType === Node.TEXT_NODE) {
                    var text = (_a = n.textContent) !== null && _a !== void 0 ? _a : '';
                    // If zero-width space, return current virtual offset
                    if (text == constants_1.CHAR_ZERO_WIDTH_SPACE) {
                        return virtualOffset;
                    }
                    else {
                        // Else, return clamped offset within text length
                        return virtualOffset + (0, clamp_1.clamp)(point.offset, 0, text.length);
                    }
                }
                // If br element
                return virtualOffset;
            }
            virtualOffset += leafLength(n);
            n = walker.nextNode();
        }
        // For the new line between blocks
        virtualOffset += 1;
    }
    // If point not found, return max offset
    return Math.max(0, virtualOffset - 1);
}
function virtualizeSelection(state) {
    var selection = window.getSelection();
    if (!(0, domIsSelectionInEditor_1.domIsSelectionInEditor)(selection, state.editor.element)) {
        return { isInsideEditor: false };
    }
    var editorElement = state.editor.element;
    // Check if anchor is equal to focus
    if (selection.anchorNode === selection.focusNode &&
        selection.anchorOffset === selection.focusOffset) {
        var caretLeaf = domNextLeafPoint(editorElement, selection.anchorNode, selection.anchorOffset);
        if (!caretLeaf) {
            return { isInsideEditor: false };
        }
        var caretNode = domLeafPointToVirtualOffset(editorElement, caretLeaf);
        var vSel_1 = {
            anchor: caretNode,
            focus: caretNode,
            isCollapsed: true,
            isInsideEditor: true,
            direction: 'none',
        };
        vSel_1.marks = (0, getVirtualSelectionMarks_1.default)(__assign(__assign({}, state), { virtualSelection: vSel_1 }));
        return vSel_1;
    }
    var anchorLeaf = domNextLeafPoint(editorElement, selection.anchorNode, selection.anchorOffset);
    var focusLeaf = domPrevLeafPoint(editorElement, selection.focusNode, selection.focusOffset);
    if (!anchorLeaf || !focusLeaf) {
        return { isInsideEditor: false };
    }
    var anchor = domLeafPointToVirtualOffset(editorElement, anchorLeaf);
    var focus = domLeafPointToVirtualOffset(editorElement, focusLeaf);
    var vSel = {
        anchor: anchor,
        focus: focus,
        isCollapsed: false,
        isInsideEditor: true,
        direction: anchor < focus ? 'forward' : 'backward',
    };
    vSel.marks = (0, getVirtualSelectionMarks_1.default)(__assign(__assign({}, state), { virtualSelection: vSel }));
    return vSel;
}


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map