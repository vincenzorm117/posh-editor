import { useEffect, useState } from 'react';

const useSelection = () => {
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const newSelection = document.getSelection();
      if (newSelection.rangeCount > 0) {
        setSelection(newSelection);
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return selection;
};

export default useSelection;