// import { test, expect } from "@playwright/test";
// import fs from "fs";
// import path from "path";

// const URL = "http://localhost:8000/versions/v9-modern/";


// function selectionIsCollapsed(arr: (number | string)[]): boolean {
//   const startIndex = arr.indexOf('<span data-start=""></span>');
//   const endIndex = arr.indexOf('<span data-end=""></span>');
//   return startIndex + 1 === endIndex;
// }

// const testcasesHtml = `
// <div data-test>
//   <div data-before>
//     <p><span data-start></span><span data-end></span>01234</p>
//   </div>
//   <div data-after>
//     <p><span data-start></span><span data-end></span>01234</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p><span data-start></span>0<span data-end></span>1234</p>
//   </div>
//   <div data-after>
//     <p><span data-start></span><b>0</b><span data-end></span>1234</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p><span data-start></span>01<span data-end></span>234</p>
//   </div>
//   <div data-after>
//     <p><span data-start></span><b>01</b><span data-end></span>234</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p><span data-start></span>012<span data-end></span>34</p>
//   </div>
//   <div data-after>
//     <p><span data-start></span><b>012</b><span data-end></span>34</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p><span data-start></span>0123<span data-end></span>4</p>
//   </div>
//   <div data-after>
//     <p><span data-start></span><b>0123</b><span data-end></span>4</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p><span data-start></span>01234<span data-end></span></p>
//   </div>
//   <div data-after>
//     <p><span data-start></span><b>01234</b><span data-end></span></p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0<span data-start></span><span data-end></span>1234</p>
//   </div>
//   <div data-after>
//     <p>0<span data-start></span><span data-end></span>1234</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0<span data-start></span>1<span data-end></span>234</p>
//   </div>
//   <div data-after>
//     <p>0<span data-start></span><b>1</b><span data-end></span>234</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0<span data-start></span>12<span data-end></span>34</p>
//   </div>
//   <div data-after>
//     <p>0<span data-start></span><b>12</b><span data-end></span>34</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0<span data-start></span>123<span data-end></span>4</p>
//   </div>
//   <div data-after>
//     <p>0<span data-start></span><b>123</b><span data-end></span>4</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0<span data-start></span>1234<span data-end></span></p>
//   </div>
//   <div data-after>
//     <p>0<span data-start></span><b>1234</b><span data-end></span></p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>01<span data-start></span><span data-end></span>234</p>
//   </div>
//   <div data-after>
//     <p>01<span data-start></span><span data-end></span>234</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>01<span data-start></span>2<span data-end></span>34</p>
//   </div>
//   <div data-after>
//     <p>01<span data-start></span><b>2</b><span data-end></span>34</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>01<span data-start></span>23<span data-end></span>4</p>
//   </div>
//   <div data-after>
//     <p>01<span data-start></span><b>23</b><span data-end></span>4</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>01<span data-start></span>234<span data-end></span></p>
//   </div>
//   <div data-after>
//     <p>01<span data-start></span><b>234</b><span data-end></span></p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>012<span data-start></span><span data-end></span>34</p>
//   </div>
//   <div data-after>
//     <p>012<span data-start></span><span data-end></span>34</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>012<span data-start></span>3<span data-end></span>4</p>
//   </div>
//   <div data-after>
//     <p>012<span data-start></span><b>3</b><span data-end></span>4</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>012<span data-start></span>34<span data-end></span></p>
//   </div>
//   <div data-after>
//     <p>012<span data-start></span><b>34</b><span data-end></span></p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0123<span data-start></span><span data-end></span>4</p>
//   </div>
//   <div data-after>
//     <p>0123<span data-start></span><span data-end></span>4</p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>0123<span data-start></span>4<span data-end></span></p>
//   </div>
//   <div data-after>
//     <p>0123<span data-start></span><b>4</b><span data-end></span></p>
//   </div>
// </div>
// <div data-test>
//   <div data-before>
//     <p>01234<span data-start></span><span data-end></span></p>
//   </div>
//   <div data-after>
//     <p>01234<span data-start></span><span data-end></span></p>
//   </div>
// </div>
// `

// test("foo", async ({ page }) => {
//   await page.goto(URL);

//   const context = {
//     selectorEditor: '[data-testid="posh"]',
//     selectorBoldBtn: '[data-testid="btn-bold"]',
//     container: '[data-test][data-type="spans"]',
//     beforeSelector: "[data-before]",
//     afterSelector: "[data-after]",
//     containerSelector: "",
//     html: testcasesHtml,
//     index: 0,
//   };


//   const indeces = await page.evaluate((context) => {
//     // Seed deterministic HTML with selection markers
//     const editor = document.querySelector(
//       context.selectorEditor
//     ) as HTMLElement;
//     editor.innerHTML = context.html;

//     let elements = [...document.querySelectorAll("[data-test]")];
//     let i = 0;
//     let arr = [];
//     for(let el of elements) {
//       el.setAttribute('data-test', (++i).toString());
//       arr.push(i);
//     }
//     return arr;

//   }, context);

//   console.log("Indeces: ", indeces);

//   for await (let index of indeces) {
//     context.index = index;
//     context.containerSelector = `${context.selectorEditor} [data-test="${index}"]`;
//     console.log("Testing index: ", index);
//     // Test select test case
//     const expectedContent = await page.evaluate((context) => {
//       const { containerSelector, beforeSelector, afterSelector } = context;

//       const container = document.querySelector(containerSelector)! as HTMLElement;
//       ;
//       // Create selection from markers
//       const start = container.querySelector(`${beforeSelector} [data-start]`)!;
//       const end = container.querySelector(`${beforeSelector} [data-end]`)!;
//       const range = document.createRange();
//       range.setStartAfter(start);
//       range.setEndBefore(end);

//       const sel = window.getSelection()!;
//       sel.removeAllRanges();
//       sel.addRange(range);

//       return container.querySelector(afterSelector)!.innerHTML;
//     }, context);

//     // Perform bold operation (your UI button calls your bold code)
//     await page.click(context.selectorBoldBtn);

//     // Assert DOM invariants (avoid exact innerHTML where possible)
//     const computedContent = await page
//       .locator(
//         `${context.containerSelector} ${context.beforeSelector}`
//       )
//       .evaluate((el) => el.innerHTML);
    
//     // [EXPECT] Check that the content matches expected content after bolding
//     expect(computedContent).toEqual(expectedContent);

//     // [EXPECT] Check that selection is inside editor
//     const selectionWithinEditor = await page.evaluate((context) => {
//       const editor = document.querySelector(context.selectorEditor)!;
//       const sel = window.getSelection()!;
//       if (!sel.rangeCount) return false;
//       const r = sel.getRangeAt(0);
//       return (
//         editor.contains(r.startContainer) && editor.contains(r.endContainer)
//       );
//     }, context);
//     expect(selectionWithinEditor).toBe(true);
//   }

// });
