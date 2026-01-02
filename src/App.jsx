import React from 'react';
import './App.css';
import LegacyRichTextEditor from "./components/LegacyRichTextEditor";

const App = () => {

  // const editorContent = `<div><b>Rich Text Editor Demo</b></div><p> This is a <strong>rich text editor</strong> built with vanilla JavaScript. </p><p>You can create:</p><ul><li> Bold, <em>italic</em>, and <u>underlined</u> text </li><li><s>Strikethrough</s> content </li><li> Various <a href="https://developer.mozilla.org/en-US/docs/Web/API/Selection"> heading levels </a></li></ul><p> Try selecting text and using the toolbar buttons above to format it! </p><p> You can also paste URLs on selected text to automatically create links. </p>`;
  // const editorContent = `<ul><li> Item 1</li><li> Item 2</li><li> Item 3</li></ul>`;
  const editorContent = ``;

  return (
    <>
      <h2>Rich Text Editor (execCommand version)</h2>
      <LegacyRichTextEditor
        focusOnMount={true}
        value={editorContent}
        onSave={(content) => console.log("Saved content:", content)}
      />
    </>
  );
};

export default App;