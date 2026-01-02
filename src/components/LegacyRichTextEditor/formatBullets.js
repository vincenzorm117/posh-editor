

/**
 * Formats bullet points in nested unordered lists by alternating between default and circle list styles.
 * Applies a breadth-first traversal to process nested ul elements and adds/removes CSS classes
 * to create alternating bullet styles at different nesting levels.
 * 
 * @param {Element} rootElement - The root DOM element containing the unordered lists to format
 * @returns {void}
 * 
 * @example
 * // Format bullets in a container element
 * const container = document.getElementById('content');
 * formatBullets(container);
 * 
 * @description
 * - Level 0 (even): Default bullet style
 * - Level 1 (odd): Circle bullet style (!list-[circle])
 * - Level 2 (even): Default bullet style
 * - And so on...
 */
const formatBullets = (rootElement) => {
  const queue = [...rootElement.querySelectorAll("ul:not(ul ul)")]
    .map(ul => {
      return { ul, index: 0 }
    });

  // console.log('--------------------------')
  while( queue.length > 0 ) {
    const { ul, index } = queue.shift();
    // console.log(index , ul, queue)
    
    // Process current ul
    if( index % 2 !== 0 ) {
      ul.classList.add("!list-[circle]");
    } else {
      ul.classList.remove("!list-[circle]");
    }
    

    // Enqueue child uls
    const childUls = [...ul.children]
      .filter((child) => child.nodeName === "UL")
      .map((childUl) => {
        return { ul: childUl, index: index + 1 };
      });
    
    queue.push(...childUls);
  }
}

export default formatBullets;