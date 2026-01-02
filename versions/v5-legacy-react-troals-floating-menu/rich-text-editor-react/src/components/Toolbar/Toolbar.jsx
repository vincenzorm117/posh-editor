import React from 'react';
import { useEditorCommands } from '../../hooks/useEditorCommands';
import './Toolbar.css';

const Toolbar = () => {
  const { executeCommand } = useEditorCommands();

  return (
    <div id="toolbar">
      <button onClick={() => executeCommand('bold')}><strong>B</strong></button>
      <button onClick={() => executeCommand('italic')}><em>I</em></button>
      <button onClick={() => executeCommand('underline')}><u>U</u></button>
      <button onClick={() => executeCommand('strikeThrough')}><s>S</s></button>
      <button onClick={() => executeCommand('createLink')}>Link</button>
      <button onClick={() => executeCommand('insertUnorderedList')}>• List</button>
      <button onClick={() => executeCommand('insertOrderedList')}>1. List</button>
    </div>
  );
};

export default Toolbar;