import createVirtualDocument from '@/createVirtualNodes/createVirtualDocument';
import isValidDomDocument from '@/validatingDom/isValidDomDocument';
import virtualizeDomBlock from './virtualizeDomBlock';
import normalizeVirtualDocument from '@/normalize/normalizeVirtualDocument';
import isElementNode from '@/helpers/isElementNode';

const virtualizeDOM = (
  element: HTMLElement,
  options?: EditorOptions['parsingOptions'],
): VirtualDocument => {
  if (!element || !isElementNode(element)) {
    throw new Error('HTML Element is required for virtualization');
  }

  if (!isValidDomDocument(element)) {
    throw new Error(
      'Provided element does not represent a valid document structure',
    );
  }

  const vDoc = createVirtualDocument(
    Array.from(element.childNodes).map((x) => virtualizeDomBlock(x, element)),
  );

  return normalizeVirtualDocument(vDoc, options);
};

export default virtualizeDOM;
