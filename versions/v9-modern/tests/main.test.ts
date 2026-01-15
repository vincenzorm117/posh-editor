import { test, expect } from "@playwright/test";

const URL = "http://localhost:8000/versions/v9-modern/";
const context = {
  selectorEditor: '[data-testid="posh"]',
  selectorBoldBtn: '[data-testid="btn-bold"]',
  html: "",
  seq: [] as (number | string)[],
};

function generateArray(size: number) {
  return Array.from({ length: size }, (_, i) => i);
}

function* combinations(
  size: number,
  startTag: string,
  endTag: string
): Generator<(number | string)[]> {
  for (let i = 0; i < size+1; i++) {
    for (let j = i + 1; j < size + 2; j++) {
      let seq = generateArray(size) as (number | string)[];
      seq.splice(i, 0, startTag);
      seq.splice(j, 0, endTag);
      yield seq;
    }
  }
}

function selectionIsCollapsed(arr: (number | string)[]): boolean {
  const startIndex = arr.indexOf('<span data-start=""></span>');
  const endIndex = arr.indexOf('<span data-end=""></span>');
  return startIndex + 1 === endIndex;
}

function generateBoldTextWithArray(arr: (number | string)[]): string {
  const startIndex = arr.indexOf('<span data-start=""></span>');
  const endIndex = arr.indexOf('<span data-end=""></span>');

  let result = "";
  for (let i = 0; i < arr.length; i++) {
    if (i > 0) result += " ";
    if (i === startIndex) continue;
    if (i === endIndex) continue;
    if (i > startIndex && i < endIndex) {
      result += `<b>${arr[i]}</b>`;
    } else {
      result += arr[i];
    }
  }
  return result;
}

// <p>0<span data-start></span>12<span data-end></span>34</p>
// <p>0<span data-start=""></span><b>12</b><span data-end=""></span>34</p>

function generateBoldedHtml(seq: (number | string)[]): string {
  if(selectionIsCollapsed(seq)) {
    return `<p>${seq.join('')}</p>`;
  }

  let result = [];
  for(let i = 0; i < seq.length; i++) {
    if(seq[i] === '<span data-start=""></span>') {
      result.push(seq[i]);
      result.push('<b>')
    } else if(seq[i] == '<span data-end=""></span>') {
      result.push('</b>')
      result.push(seq[i]);
    } else {
      result.push(seq[i]);
    }
  }
  return `<p>${result.join('')}</p>`;
}


test("bold toggles selection and preserves selection", async ({ page }) => {
  await page.goto(URL);

  const testString = `<p>This is <span data-start></span>me <strong>bold text</strong> alread<span data-end></span>y in it.</p>`;


  for await (let seq of combinations(5, "<span data-start=\"\"></span>", "<span data-end=\"\"></span>")) {
    context.seq = seq;
    context.html = `<p>${seq.join("")}</p>`;
    console.log("Testing sequence: ", context.html);

    await page.evaluate((context) => {
      // Seed deterministic HTML with selection markers
      const editor = document.querySelector(
        context.selectorEditor
      ) as HTMLElement;
      editor.innerHTML = context.html;

      // Create selection from markers
      const start = editor.querySelector("[data-start]")!;
      const end = editor.querySelector("[data-end]")!;

      const range = document.createRange();
      range.setStartAfter(start);
      range.setEndBefore(end);

      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);
    }, context);

    // Perform bold operation (your UI button calls your bold code)
    await page.click(context.selectorBoldBtn);

    // Assert DOM invariants (avoid exact innerHTML where possible)
    const html = await page
      .locator(context.selectorEditor)
      .evaluate((el) => el.innerHTML);

    expect(html).toContain("<p>");
    expect(html).toContain("</p>");
    // if (selectionIsCollapsed(seq)) {
    //   expect(html).not.toMatch(/<strong>|<b>/); // depending on what you emit
    // } else {
    //   expect(html).toMatch(/<strong>|<b>/); // depending on what you emit
    // }
    // Assert selected text is still the same logical string
    // const selectedText = await page.evaluate(
    //   () => window.getSelection()?.toString() ?? ""
    // );
    // console.log("Selected text: ", selectedText);
    // console.log("HTML after bold: ", html);
    const expected = generateBoldedHtml(context.seq);
    // console.log("Expected HTML: ", expected);
    expect(html).toEqual(expected);

    // Optional: assert selection is still within editor
    const selectionWithinEditor = await page.evaluate((context) => {
      const editor = document.querySelector(context.selectorEditor)!;
      const sel = window.getSelection()!;
      if (!sel.rangeCount) return false;
      const r = sel.getRangeAt(0);
      return (
        editor.contains(r.startContainer) && editor.contains(r.endContainer)
      );
    }, context);
    expect(selectionWithinEditor).toBe(true);
  }

  // Seed deterministic HTML with selection markers
  // await page.evaluate((context) => {
  //   const editor = document.querySelector(context.selectorEditor) as HTMLElement;
  //   editor.innerHTML = `<p>This is <span data-start></span>me <strong>bold text</strong> alread<span data-end></span>y in it.</p>`;
  // }, context);

  // // Create selection from markers
  // await page.evaluate((context) => {
  //   const editor = document.querySelector(context.selectorEditor)!;
  //   const start = editor.querySelector("[data-start]")!;
  //   const end = editor.querySelector("[data-end]")!;

  //   const range = document.createRange();
  //   range.setStartAfter(start);
  //   range.setEndBefore(end);

  //   const sel = window.getSelection()!;
  //   sel.removeAllRanges();
  //   sel.addRange(range);
  // }, context);

  // // Perform bold operation (your UI button calls your bold code)
  // await page.click(context.selectorBoldBtn);

  // // Assert DOM invariants (avoid exact innerHTML where possible)
  // const html = await page
  //   .locator(context.selectorEditor)
  //   .evaluate((el) => el.innerHTML);

  // expect(html).toContain("<p>");
  // expect(html).toContain("</p>");
  // expect(html).toMatch(/<strong>|<b>/); // depending on what you emit

  // // Assert selected text is still the same logical string
  // const selectedText = await page.evaluate(
  //   () => window.getSelection()?.toString() ?? ""
  // );
  // expect(selectedText.replace(/\s+/g, " ").trim()).toBe("me bold text alread");

  // // Optional: assert selection is still within editor
  // const selectionWithinEditor = await page.evaluate((context) => {
  //   const editor = document.querySelector(context.selectorEditor)!;
  //   const sel = window.getSelection()!;
  //   if (!sel.rangeCount) return false;
  //   const r = sel.getRangeAt(0);
  //   return editor.contains(r.startContainer) && editor.contains(r.endContainer);
  // }, context);
  // expect(selectionWithinEditor).toBe(true);
});
