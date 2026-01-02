"use client";

import IconBold from "../icons/IconBold";
import IconHyperlink from "../icons/IconHyperlink";
import IconItalic from "../icons/IconItalic";
import IconOrderedList from "../icons/IconOrderedList";
import IconStrikeThrough from "../icons/IconStrikeThrough";
import IconUnderline from "../icons/IconUnderline";
import IconUnorderedList from "../icons/IconUnorderedList";


import cn from "../../utils/cn";
import isUrl from "../../utils/isUrl";
import { useEffect, useRef, useState } from "react";
import { defaultFormatStates } from "./constants";
import getSelectionFormatting from "./getSelectionFormatting";
import handleAutomaticListCreation from "./handleAutomaticListCreation";

const RichTextEditor = ({
  value,
  disabled = false,
  placeholder = null,
  focusOnMount = false,
  onSave = () => {},
  ...props
}) => {
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formatStates, setFormatStates] = useState(defaultFormatStates);

  const updateFormatStates = () => {
    if (!editorRef.current || disabled) return;
    setFormatStates(getSelectionFormatting(editorRef.current));
  };

  const format = (type) => {
    const allowedFormats = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "insertUnorderedList",
      "insertOrderedList",
    ];
    if (allowedFormats.includes(type)) {
      document.execCommand(type, false, null);
      onSave(editorRef.current.innerHTML);
      // Update format states after formatting
      setTimeout(updateFormatStates, 0);
    }
  };

  const onInput = (event) => {
    handleAutomaticListCreation(event, editorRef.current);
    onSave(editorRef.current.innerHTML);
    updateFormatStates();
  };

  const onKeyUp = () => {
    if (disabled) return;
    onSave(editorRef.current.innerHTML);
    updateFormatStates();
  };

  const onKeyDown = (event) => {
    // [Step] If the editor is disabled, do nothing
    if (disabled) return;
    // [Step] Check for keyboard shortcuts for formatting
    // Check if Cmd+Shift+S is pressed for strikethrough
    if (event.metaKey && event.shiftKey && event?.key?.toLowerCase() === "x") {
      format("strikeThrough");
    } else if (event.metaKey && event.shiftKey && event?.key === "7") {
      // Check if Cmd+Shift+7 is pressed for ordered list
      event.preventDefault();
      format("insertOrderedList");
    } else if (event.metaKey && event.shiftKey && event?.key === "8") {
      // Check if Cmd+Shift+8 is pressed for unordered list
      format("insertUnorderedList");
    }
    // [Step] Save the content after any key press
    onSave(editorRef.current.innerHTML);
    updateFormatStates();
  };

  const onPaste = (event) => {
    // [Step] If the editor is disabled, do nothing
    if (disabled) return;
    // [Step] Get the pasted text from the clipboard
    let text = event?.clipboardData ?? window?.clipboardData;
    text = text.getData("text/plain");
    // [Case] If the user is holding Shift while pasting, paste without formatting
    if (event.shiftKey) {
      // Paste as plain text (strip formatting)
      event.preventDefault();
      document.execCommand("insertText", false, text);
      // Save the content after pasting
      onSave(editorRef.current.innerHTML);
      return;
    }
    // [Case] If clipboard is url and text selected, hyperlink the selected text with the URL
    const selection = document.getSelection();
    if (!selection.isCollapsed && isUrl(text)) {
      // If user is pasting a URL over a selected text, make that text a link
      event.preventDefault();
      document.execCommand("createLink", false, text);
    }
    // [Case] Otherwise, let the default paste happen with formatting
  };

  const onBlur = () => {
    // [Step] If the editor is disabled, do nothing
    if (disabled) return;
    // [Step] Save the content when the editor loses focus
    onSave(editorRef.current.innerHTML);
    updateFormatStates();
  };

  const onSelectionChange = () => {
    if (disabled) return;
    updateFormatStates();
  };

  const onHyperLinkClick = (e) => {
    // [Step] If the editor is disabled, do nothing
    if (disabled) return;
    // [Step] Prevent the default action of the link click
    e.preventDefault();
    // [Step] Prompt the user for a URL to create a link
    let url = prompt("Enter the URL (enter blank to unlink)", "");
    if (url) {
      // If the URL doesn't start with http:// or https://, prepend it
      if (!isUrl(url)) {
        url = `https://${url}`;
      }
      document.execCommand("createLink", false, url);
    } else {
      // If no URL is provided, remove the link
      document.execCommand("unlink", false, null);
    }
    // [Step] Save the content after creating the link
    onSave(editorRef.current.innerHTML);
  };

  useEffect(() => {
    editorRef.current.innerHTML = value ?? "";
    setIsLoading(false);

    if (focusOnMount) {
      editorRef.current.focus();
    }

    // Add event listener for selection changes
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  return (
    <div
      {...props}
      className={cn("relative", isLoading && "select-none", props?.className)}
    >
      <div
        className={cn(
          "absolute z-10 top-[1px] left-0 right-0 px-2 py-1 border-b border-gray-300 bg-white mx-[1px] rounded-tl-xl rounded-tr-xl hover:shadow-md transition-shadow overflow-x-auto whitespace-nowrap no-scrollbar",
          isLoading && "!bg-[#eee] !border-gray-300  animate-pulse"
        )}
      >
        <button
          onClick={() => format("bold")}
          variant="ghost"
          className={cn("relative", formatStates.bold && "text-[#12B8FF]")}
        >
          <IconBold />
        </button>
        <button
          onClick={() => format("italic")}
          variant="ghost"
          className="relative"
        >
          <IconItalic className={cn(formatStates.italic && "text-[#12B8FF]")} />
        </button>
        <button
          onClick={() => format("underline")}
          variant="ghost"
          className="relative"
        >
          <IconUnderline
            className={cn(formatStates.underline && "text-[#12B8FF]")}
          />
        </button>
        <button
          onClick={() => format("strikeThrough")}
          variant="ghost"
          className="relative"
        >
          <IconStrikeThrough
            className={cn(formatStates.strikeThrough && "text-[#12B8FF]")}
          />
        </button>
        <button onClick={onHyperLinkClick} variant="ghost">
          <IconHyperlink
            className={cn(formatStates.hyperlink && "text-[#12B8FF]")}
          />
        </button>
        <button onClick={() => format("insertUnorderedList")} variant="ghost">
          <IconUnorderedList
            className={cn(formatStates.unorderedList && "text-[#12B8FF]")}
          />
        </button>
        <button onClick={() => format("insertOrderedList")} variant="ghost">
          <IconOrderedList
            className={cn(formatStates.orderedList && "text-[#12B8FF]")}
          />
        </button>
      </div>
      <div
        className={cn(
          "empty:before:content-[attr(placeholder)] whitespace-pre-wrap min-h-[100px] w-full border border-gray-300 rounded-xl px-3 pt-[58px] pb-3 relative focus:outline-none focus:ring-4 focus:ring-[#12B8FF] bg-white text-gray-600 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5",
          // NOTE: whitespace-pre-wrap is necessary to preserve newlines \n in content and so you don't have to encode/decode <br/> tags.
          isLoading &&
            "!text-transparent !bg-[#eee] !border-gray-300  animate-pulse"
        )}
        role="textbox"
        aria-multiline="true"
        ref={editorRef}
        contentEditable={!disabled}
        placeholder={placeholder}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onPaste={onPaste}
        onInput={onInput}
      />
    </div>
  );
};

export default RichTextEditor;
