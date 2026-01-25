(function () {
  function generateRecursiveRandomVirtualDOM(treeDepth) {
    if (treeDepth <= 0) {
      return {
        type: "text",
        value: `Text node ${Math.random().toString(36).substring(7)}`,
      };
    }

    const tags = [
      "div",
      "span",
      "section",
      "article",
      "header",
      "footer",
      "nav",
      "main",
    ];
    const numChildren = Math.floor(Math.random() * 4) + 1; // 1-4 children

    return {
      type: tags[Math.floor(Math.random() * tags.length)],
      props: {
        id: `node-${Math.random().toString(36).substring(7)}`,
        className: `class-${Math.random().toString(36).substring(7)}`,
      },
      children: Array.from({ length: numChildren }, () =>
        generateRecursiveRandomVirtualDOM(treeDepth - 1)
      ),
    };
  }
  function generateIterativeRandomVirtualDOM(treeDepth) {
    const tags = [
      "div",
      "span",
      "section",
      "article",
      "header",
      "footer",
      "nav",
      "main",
    ];

    const root = {
      type: tags[Math.floor(Math.random() * tags.length)],
      props: {
        id: `node-${Math.random().toString(36).substring(7)}`,
        className: `class-${Math.random().toString(36).substring(7)}`,
      },
      children: [],
    };

    const stack = [{ node: root, depth: treeDepth }];

    while (stack.length > 0) {
      const { node, depth } = stack.pop();

      if (depth <= 0) continue;

      const numChildren = Math.floor(Math.random() * 4) + 1;

      for (let i = 0; i < numChildren; i++) {
        if (depth - 1 <= 0) {
          node.children.push({
            type: "text",
            value: `Text node ${Math.random().toString(36).substring(7)}`,
          });
        } else {
          const child = {
            type: tags[Math.floor(Math.random() * tags.length)],
            props: {
              id: `node-${Math.random().toString(36).substring(7)}`,
              className: `class-${Math.random().toString(36).substring(7)}`,
            },
            children: [],
          };
          node.children.push(child);
          stack.push({ node: child, depth: depth - 1 });
        }
      }
    }

    return root;
  }

  for(let treeDepth = 10; treeDepth <= 50; treeDepth += 1) {
    console.log(`\n---- Tree depth [${treeDepth}] ----`);

    const startTimeRecursive = performance.now();
    generateRecursiveRandomVirtualDOM(treeDepth);
    const endTimeRecursive = performance.now();
    const durationRecursive = endTimeRecursive - startTimeRecursive;
    // console.log(`Total run time (recursive): ${(durationRecursive).toFixed(2)}ms`);

    const startTimeIterative = performance.now();
    generateIterativeRandomVirtualDOM(treeDepth);
    const endTimeIterative = performance.now();
    const durationIterative = endTimeIterative - startTimeIterative;
    // console.log(`Total run time (iterative): ${(durationIterative).toFixed(2)}ms`);

    const percentFaster = ((durationRecursive - durationIterative) / durationRecursive) * 100;
    console.table({
      "Recursive (ms)": durationRecursive.toFixed(2),
      "Iterative (ms)": durationIterative.toFixed(2),
      "Percent Faster (%)": percentFaster.toFixed(2),
    })
    // console.log(`Iterative approach is ${percentFaster.toFixed(2)}% faster than recursive approach.`);
  }
})();