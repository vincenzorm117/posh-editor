import { useContext } from 'react';
import { RichTextEditorContext } from '../context/RichTextEditorContext';

const useEditorCommands = () => {
  const { execCommand } = useContext(RichTextEditorContext);

  const formatText = (command, value = null) => {
    execCommand(command, value);
  };

  const createLink = (url) => {
    execCommand('createLink', url);
  };

  const insertUnorderedList = () => {
    execCommand('insertUnorderedList');
  };

  const insertOrderedList = () => {
    execCommand('insertOrderedList');
  };

  return {
    formatText,
    createLink,
    insertUnorderedList,
    insertOrderedList,
  };
};

export default useEditorCommands;