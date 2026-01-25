import { test, expect, Page } from "@playwright/test";

const URL = "http://localhost:8000/";
const SELECTOR_EDITOR = '[data-testid="posh"]';
const SELECTOR_BOLD_BTN = '[data-testid="btn-bold"]';

// prettier-ignore
const tests = [
  // Start at 0
  { before: `01234`, after: `01234`, start: 0, end: 0, selected: '' },
  { before: `01234`, after: `<b>0</b>1234`, start: 0, end: 1, selected: '0' },
  { before: `01234`, after: `<b>01</b>234`, start: 0, end: 2, selected: '01' },
  { before: `01234`, after: `<b>012</b>34`, start: 0, end: 3, selected: '012' },
  { before: `01234`, after: `<b>0123</b>4`, start: 0, end: 4, selected: '0123' },
  { before: `01234`, after: `<b>01234</b>`, start: 0, end: 5, selected: '01234' },
  // Start at 1
  { before: `01234`, after: `01234`, start: 1, end: 1, selected: '' },
  { before: `01234`, after: `0<b>1</b>234`, start: 1, end: 2, selected: '1' },
  { before: `01234`, after: `0<b>12</b>34`, start: 1, end: 3, selected: '12' },
  { before: `01234`, after: `0<b>123</b>4`, start: 1, end: 4, selected: '123' },
  { before: `01234`, after: `0<b>1234</b>`, start: 1, end: 5, selected: '1234' },
  // Start at 2
  { before: `01234`, after: `01234`, start: 2, end: 2, selected: '' },
  { before: `01234`, after: `01<b>2</b>34`, start: 2, end: 3, selected: '2' },
  { before: `01234`, after: `01<b>23</b>4`, start: 2, end: 4, selected: '23' },
  { before: `01234`, after: `01<b>234</b>`, start: 2, end: 5, selected: '234' },
  // Start at 3
  { before: `01234`, after: `01234`, start: 3, end: 3, selected: '' },
  { before: `01234`, after: `012<b>3</b>4`, start: 3, end: 4, selected: '3' },
  { before: `01234`, after: `012<b>34</b>`, start: 3, end: 5, selected: '34' },
  // Start at 4
  { before: `01234`, after: `01234`, start: 4, end: 4, selected: '' },
  { before: `01234`, after: `0123<b>4</b>`, start: 4, end: 5, selected: '4' },
  // Start at 5
  { before: `01234`, after: `01234`, start: 5, end: 5, selected: '' },
];
// prettier-ignore-end

test.describe("Simple Bold", () => {
  // Navigate once before all tests in this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  // Generate a separate test for each test case
  for (const testcase of tests) {
    const testName = `select [${testcase.start}, ${testcase.end}] → "${testcase.after}"`;

    test(testName, async ({ page }) => {
      // Seed HTML and select range
      await page.evaluate(
        ({ selectorEditor, testcase }) => {
          const editor = document.querySelector(selectorEditor) as HTMLElement;
          editor.innerHTML = `<p>${testcase.before}</p>`;

          const range = document.createRange();
          const textNode = editor.querySelector("p")!.firstChild!;
          range.setStart(textNode, testcase.start);
          range.setEnd(textNode, testcase.end);

          const sel = window.getSelection()!;
          sel.removeAllRanges();
          sel.addRange(range);
        },
        { selectorEditor: SELECTOR_EDITOR, testcase }
      );

      // Perform bold operation
      await page.click(SELECTOR_BOLD_BTN);

      const selectedText = await page.evaluate(() => {
        const sel = window.getSelection()!;
        return sel.toString();
      });

      // Verify resulting HTML
      const computedContent = await page
        .locator(`${SELECTOR_EDITOR} p`)
        .evaluate((el) => el.innerHTML);

      expect(computedContent).toEqual(testcase.after);
      expect(selectedText).toEqual(testcase.selected);
    });
  }
});
