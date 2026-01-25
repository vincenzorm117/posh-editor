import { test, expect, Page } from '@playwright/test';

import { domIsValidDocument } from '../domIsValidDocument';
import { domIsSelectionInEditor } from '../domIsSelectionInEditor';

// Each test: { name, html, expected }
const tests = [
  {
    name: 'Valid: single <p> with text',
    html: '<p>Hello world</p>',
    expected: true,
  },
  // {
  //   name: 'Valid: <p> with inline elements',
  //   html: '<div><p>Hello <strong>world</strong> <em>!</em></p></div>',
  //   expected: true,
  // },
  // {
  //   name: 'Invalid: <div> with no <p>',
  //   html: '<div><span>Not a block</span></div>',
  //   expected: false,
  // },
  // {
  //   name: 'Valid: empty <p>',
  //   html: '<div><p></p></div>',
  //   expected: true,
  // },
  // {
  //   name: 'Invalid: block element not allowed (<h1>)',
  //   html: '<div><h1>Heading</h1></div>',
  //   expected: false,
  // },
  // {
  //   name: 'Invalid: <p> with block child',
  //   html: '<div><p><p>Nested</p></p></div>',
  //   expected: false,
  // },
  // {
  //   name: 'Valid: whitespace text nodes between blocks',
  //   html: '<div>\n  <p>One</p>\n  <p>Two</p>\n</div>',
  //   expected: true,
  // },
  // {
  //   name: 'Invalid: <ul> as block (not allowed in allowedBlockTags)',
  //   html: '<div><ul><li>Item</li></ul></div>',
  //   expected: false,
  // },
  // {
  //   name: 'Invalid: <p> with disallowed inline (<div>)',
  //   html: '<div><p><div>Bad</div></p></div>',
  //   expected: false,
  // },
  // {
  //   name: 'Valid: <p> with <br>',
  //   html: '<div><p>Line<br>Break</p></div>',
  //   expected: true,
  // },
  // {
  //   name: 'Valid: <p> with nested inline elements',
  //   html: '<div><p><strong><em>Deep</em></strong></p></div>',
  //   expected: true,
  // },
  // {
  //   name: 'Invalid: <p> with <br> that has children',
  //   html: '<div><p>Bad<br><span>child</span></br></p></div>',
  //   expected: false,
  // },
  // {
  //   name: 'Valid: only text nodes at root',
  //   html: '<div>Just text</div>',
  //   expected: true,
  // },
  // {
  //   name: 'Invalid: comment node at root',
  //   html: '<div><!-- comment --><p>Text</p></div>',
  //   expected: false,
  // },
];

test.describe('domIsValidDocument', () => {
  // Navigate once before all tests in this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
  });

  tests.forEach(({ name, html, expected }) => {
    test(name, async ({ page }) => {
      const predicted = await page.evaluate(
        ({ domIsSelectionInEditor, html }) => {
          const container = document.createElement('div');
          container.innerHTML = html;
          // Use the first child as the editorElement
          const editorElement = container.firstElementChild as HTMLElement;
          return domIsValidDocument(editorElement);
        },
        { domIsSelectionInEditor, html },
      );
      expect(predicted).toBe(expected);
    });
  });
});
