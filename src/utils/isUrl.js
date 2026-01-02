/**
 * Checks if a text string is a URL by testing for http or https protocol
 * @param {string} text - The text to test
 * @returns {boolean} True if the text starts with http:// or https://
 */
const isUrl = (text) => {
  return /^https?:\/\//.test(text);
};

export default isUrl;
