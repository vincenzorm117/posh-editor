import React, { useContext, useRef, useEffect } from 'react';
import { RichTextEditorContext } from '../../context/RichTextEditorContext';
import './Editor.css';

const Editor = () => {
  const { editorContent, setEditorContent } = useContext(RichTextEditorContext);
  const editorRef = useRef(null);

  useEffect(() => {
    const handleInput = () => {
      setEditorContent(editorRef.current.innerHTML);
    };

    const editor = editorRef.current;
    editor.addEventListener('input', handleInput);

    return () => {
      editor.removeEventListener('input', handleInput);
    };
  }, [setEditorContent]);

  return (
    <div
      id="editor"
      contentEditable="true"
      ref={editorRef}
      dangerouslySetInnerHTML={{ __html: editorContent }}
    />
  );
};

export default Editor;