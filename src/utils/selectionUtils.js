// This file contains utility functions for managing text selection within the editor.

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  return selection.getRangeAt(0);
};

export const isSelectionInEditor = (editorRef) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  let node = range.commonAncestorContainer;

  while (node) {
    if (node === editorRef.current) return true;
    node = node.parentNode;
  }

  return false;
};

export const positionMenuAboveSelection = (menuRef) => {
  const range = getSelectionRange();
  if (!range) return;

  const rect = range.getBoundingClientRect();
  const menuWidth = menuRef.current.offsetWidth;
  const menuHeight = menuRef.current.offsetHeight;

  let left = rect.left + (rect.width / 2) - (menuWidth / 2);
  const top = rect.top - menuHeight - 10; // 10px above the selection

  // Ensure the menu doesn't go off-screen
  if (left < 10) left = 10;
  if (left + menuWidth > window.innerWidth - 10) {
    left = window.innerWidth - menuWidth - 10;
  }

  menuRef.current.style.left = `${left}px`;
  menuRef.current.style.top = `${top}px`;
};