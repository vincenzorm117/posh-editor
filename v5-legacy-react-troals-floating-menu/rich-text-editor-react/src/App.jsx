import React from 'react';
import { RichTextEditorProvider } from './context/RichTextEditorContext';
import Editor from './components/Editor';
import Toolbar from './components/Toolbar';
import FloatingMenu from './components/FloatingMenu';
import './App.css';

const App = () => {
  return (
    <RichTextEditorProvider>
      <div className="app">
        <h2>Rich Text Editor</h2>
        <Toolbar />
        <Editor />
        <FloatingMenu />
      </div>
    </RichTextEditorProvider>
  );
};

export default App;