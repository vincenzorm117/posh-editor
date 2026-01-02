import React, { createContext, useContext, useState } from 'react';

const RichTextEditorContext = createContext();

export const RichTextEditorProvider = ({ children }) => {
  const [editorContent, setEditorContent] = useState('');
  
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <RichTextEditorContext.Provider value={{ editorContent, setEditorContent, executeCommand }}>
      {children}
    </RichTextEditorContext.Provider>
  );
};

export const useRichTextEditor = () => {
  return useContext(RichTextEditorContext);
};