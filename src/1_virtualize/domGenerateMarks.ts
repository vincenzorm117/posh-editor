import closest from '../helpers/closest';

const domGenerateMarks = (node: Node): Record<string, any> => {
  const marks: Record<string, any> = {};

  // If parent is bold element
  const boldElement = closest(node, 'strong, b');
  if (boldElement) {
    marks.bold = true;
  }

  // TODO: expand for other marks
  // // If parent is italic element
  // const italicElement = closest(node, 'em, i');
  // if (italicElement) {
  //   marks.italic = true;
  // }

  // // If parent is underline element
  // const underlineElement = closest(node, 'u');
  // if (underlineElement) {
  //   marks.underline = true;
  // }

  // // If parent is code element
  // const codeElement = closest(node, 'code');
  // if (codeElement) {
  //   marks.code = true;
  // }

  // // If parent is link element
  // const linkElement = closest(node, 'a');
  // if (linkElement) {
  //   const anchor = linkElement as HTMLAnchorElement;
  //   marks.link = {
  //     href: anchor.getAttribute('href') || '',
  //     title: anchor.getAttribute('title') || '',
  //   };
  // }

  return marks;
};

export default domGenerateMarks;
