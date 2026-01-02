export const tagToFormat = {
  B: "bold",
  STRONG: "bold",
  I: "italic",
  EM: "italic",
  U: "underline",
  S: "strikeThrough",
  STRIKE: "strikeThrough",
  DEL: "strikeThrough",
  A: "hyperlink",
  UL: "unorderedList",
  OL: "orderedList",
};

export const tagTypes = "B,STRONG,I,EM,U,S,STRIKE,DEL,A,UL,OL";

export const defaultFormatStates = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  hyperlink: false,
  unorderedList: false,
  orderedList: false,
};
