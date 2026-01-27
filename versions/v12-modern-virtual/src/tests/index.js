(function () {
  const SELECTOR_EDITOR = '[data-testid="posh"]';
  const SELECTOR_BOLD_BTN = '[data-testid="btn-bold"]';

  const waitAtBreakpoint = 'bold-unbold';

  // prettier-ignore
  const tests = [
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Bold Only
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Start at 0
  { breakpoint: 'bold-only' },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 0, selected: '',      commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p><b>0</b>1234</p>`, start: 0, end: 1, selected: '0',     commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p><b>01</b>234</p>`, start: 0, end: 2, selected: '01',    commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p><b>012</b>34</p>`, start: 0, end: 3, selected: '012',   commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p><b>0123</b>4</p>`, start: 0, end: 4, selected: '0123',  commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p><b>01234</b></p>`, start: 0, end: 5, selected: '01234', commands: ['bold'] },
  // Start at 1
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 1, end: 1, selected: '',      commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>0<b>1</b>234</p>`, start: 1, end: 2, selected: '1',     commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>0<b>12</b>34</p>`, start: 1, end: 3, selected: '12',    commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>0<b>123</b>4</p>`, start: 1, end: 4, selected: '123',   commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>0<b>1234</b></p>`, start: 1, end: 5, selected: '1234',  commands: ['bold'] },
  // Start at 2
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 2, end: 2, selected: '',      commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>01<b>2</b>34</p>`, start: 2, end: 3, selected: '2',     commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>01<b>23</b>4</p>`, start: 2, end: 4, selected: '23',    commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>01<b>234</b></p>`, start: 2, end: 5, selected: '234',   commands: ['bold'] },
  // Start at 3
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 3, end: 3, selected: '',      commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>012<b>3</b>4</p>`, start: 3, end: 4, selected: '3',     commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>012<b>34</b></p>`, start: 3, end: 5, selected: '34',    commands: ['bold'] },
  // Start at 4
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 4, end: 4, selected: '',      commands: ['bold'] },
  { before: `<p>01234</p>`, after: `<p>0123<b>4</b></p>`, start: 4, end: 5, selected: '4',     commands: ['bold'] },
  // Start at 5
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 5, end: 5, selected: '',      commands: ['bold'] },
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Bold and then unbold
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Start at 0
  { breakpoint: 'bold-unbold' },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 0, selected: '',      commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 1, selected: '0',     commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 2, selected: '01',    commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 3, selected: '012',   commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 4, selected: '0123',  commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 0, end: 5, selected: '01234', commands: ['bold', 'bold'] },
  // Start at 1
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 1, end: 1, selected: '',      commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 1, end: 2, selected: '1',     commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 1, end: 3, selected: '12',    commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 1, end: 4, selected: '123',   commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 1, end: 5, selected: '1234',  commands: ['bold', 'bold'] },
  // Start at 2
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 2, end: 2, selected: '',      commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 2, end: 3, selected: '2',     commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 2, end: 4, selected: '23',    commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 2, end: 5, selected: '234',   commands: ['bold', 'bold'] },
  // Start at 3
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 3, end: 3, selected: '',      commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 3, end: 4, selected: '3',     commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 3, end: 5, selected: '34',    commands: ['bold', 'bold'] },
  // Start at 4
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 4, end: 4, selected: '',      commands: ['bold', 'bold'] },
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 4, end: 5, selected: '4',     commands: ['bold', 'bold'] },
  // // Start at 5
  { before: `<p>01234</p>`, after: `<p>01234</p>`,        start: 5, end: 5, selected: '',      commands: ['bold', 'bold'] },
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Bold across multiple paragraphs
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  { breakpoint: 'bold-multiple-paragraphs' },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01234</p><p>56789</p>`, start: 0, end: 0, selected: '', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p><b>0</b>1234</p><p>56789</p>`, start: 0, end: 1, selected: '0', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p><b>01</b>234</p><p>56789</p>`, start: 0, end: 2, selected: '01', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p><b>012</b>34</p><p>56789</p>`, start: 0, end: 3, selected: '012', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p><b>0123</b>4</p><p>56789</p>`, start: 0, end: 4, selected: '0123', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p><b>01234</b></p><p>56789</p>`, start: 0, end: 5, selected: '01234', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01234</p><p>56789</p>`, start: 1, end: 1, selected: '', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>0<b>1</b>234</p><p>56789</p>`, start: 1, end: 2, selected: '1', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>0<b>12</b>34</p><p>56789</p>`, start: 1, end: 3, selected: '12', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>0<b>123</b>4</p><p>56789</p>`, start: 1, end: 4, selected: '123', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>0<b>1234</b></p><p>56789</p>`, start: 1, end: 5, selected: '1234', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01234</p><p>56789</p>`, start: 2, end: 2, selected: '', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01<b>2</b>34</p><p>56789</p>`, start: 2, end: 3, selected: '2', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01<b>23</b>4</p><p>56789</p>`, start: 2, end: 4, selected: '23', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01<b>234</b></p><p>56789</p>`, start: 2, end: 5, selected: '234', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01234</p><p>56789</p>`, start: 3, end: 3, selected: '', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>012<b>3</b>4</p><p>56789</p>`, start: 3, end: 4, selected: '3', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>012<b>34</b></p><p>56789</p>`, start: 3, end: 5, selected: '34', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01234</p><p>56789</p>`, start: 4, end: 4, selected: '', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>0123<b>4</b></p><p>56789</p>`, start: 4, end: 5, selected: '4', commands: ['bold'] },
  { before: `<p>01234</p><p>56789</p>`, after: `<p>01234</p><p>56789</p>`, start: 5, end: 5, selected: '', commands: ['bold'] }
];
  // prettier-ignore-end

  // Create and inject the test results table
  function createTestResultsTable() {
    const container = document.createElement('div');
    container.id = 'test-results-container';
    container.className =
      'fixed bottom-0 left-0 right-0 max-w-full overflow-auto bg-white shadow-2xl border-t-4 border-indigo-500 z-50';
    container.style.height = '40vh';
    container.style.minHeight = '150px';
    container.style.maxHeight = '80vh';

    container.innerHTML = `
    <div id="resize-handle" class="absolute top-0 left-0 right-0 h-3 bg2-indigo-500 cursor-ns-resize hover:bg-indigo-400 transition-colors z-10" style="margin-top: -4px;"></div>
    <div class="top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h2 class="text-base font-bold text-white">🧪 Test Results</h2>
        <span id="test-summary" class="text-xs text-indigo-100"></span>
      </div>
      <button id="toggle-tests" class="text-white hover:bg-white/20 rounded px-2 py-0.5 text-xs transition-colors">
        Collapse ▼
      </button>
    </div>
    <div id="test-table-wrapper" class="overflow-x-auto">
      <table class="w-full text-xs">
        <thead class="bg-gray-50 sticky top-0">
          <tr>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">#</th>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">Status</th>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">Commands</th>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">Selection</th>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">Before</th>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">After</th>
            <th class="px-2 py-1.5 text-left font-semibold text-gray-700 border-b border-gray-200">Expected</th>
          </tr>
        </thead>
        <tbody id="test-results-body" class="divide-y divide-gray-100">
        </tbody>
      </table>
    </div>
  `;

    document.body.appendChild(container);

    // Resize functionality
    const resizeHandle = container.querySelector('#resize-handle');
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = container.offsetHeight;
      document.body.style.cursor = 'ns-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const deltaY = startY - e.clientY;
      const newHeight = startHeight + deltaY;
      const minHeight = 150;
      const maxHeight = window.innerHeight * 0.8;
      
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        container.style.height = newHeight + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
      }
    });

    // Toggle collapse functionality
    const toggleBtn = container.querySelector('#toggle-tests');
    const tableWrapper = container.querySelector('#test-table-wrapper');
    let isCollapsed = false;

    toggleBtn.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      tableWrapper.style.display = isCollapsed ? 'none' : 'block';
      toggleBtn.textContent = isCollapsed ? 'Expand ▲' : 'Collapse ▼';
    });

    return container.querySelector('#test-results-body');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function addBreakpointRow(tbody, breakpointName) {
    const row = document.createElement('tr');
    row.className = 'bg-indigo-100';
    row.innerHTML = `
    <td colspan="7" class="px-2 py-1.5 font-semibold text-indigo-700 text-xs">
      <span class="inline-flex items-center gap-1">
        <span class="text-indigo-400">▶</span>
        ${escapeHtml(breakpointName)}
      </span>
    </td>
  `;
    tbody.prepend(row);
  }

  function addPendingTestRow(tbody, index, testcase) {
    const row = document.createElement('tr');
    row.id = `test-row-${index}`;
    row.className = 'bg-yellow-50 hover:bg-yellow-100 transition-colors';

    const statusIcon =
      '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500 text-white text-[10px] animate-pulse">⏳</span>';

    const selectionRange = `[${testcase.start}, ${testcase.end}]`;
    const selectionText = testcase.selected || '(empty)';

    const commandsList = testcase.commands
      .map(
        (cmd) =>
          `<span class="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-[10px] font-mono">${escapeHtml(cmd)}</span>`,
      )
      .join(' ');

    row.innerHTML = `
    <td class="px-2 py-1 font-mono text-gray-600">${index + 1}</td>
    <td class="px-2 py-1">${statusIcon}</td>
    <td class="px-2 py-1">
      <div class="flex flex-wrap gap-0.5">${commandsList}</div>
    </td>
    <td class="px-2 py-1">
      <span class="text-gray-500">${selectionRange}</span>
      <code class="bg-blue-100 px-1 rounded text-blue-800 font-mono">"${escapeHtml(selectionText)}"</code>
    </td>
    <td class="px-2 py-1">
      <code class="bg-gray-100 px-1 rounded text-gray-800 font-mono">${escapeHtml(testcase.before)}</code>
    </td>
    <td class="px-2 py-1">
      <code class="bg-gray-200 px-1 rounded text-gray-500 font-mono whitespace-nowrap">—</code>
    </td>
    <td class="px-2 py-1">
      <code class="bg-gray-100 px-1 rounded text-gray-800 font-mono whitespace-nowrap">${escapeHtml(testcase.after)}</code>
    </td>
  `;

    tbody.prepend(row);
    return row;
  }

  function updateTestResult(
    row,
    index,
    testcase,
    actualHTML,
    actualSelection,
    passed,
  ) {
    row.className = passed
      ? 'bg-green-50 hover:bg-green-100 transition-colors'
      : 'bg-red-50 hover:bg-red-100 transition-colors';

    const statusIcon = passed
      ? '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white text-[10px]">✓</span>'
      : '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px]">✗</span>';

    const selectionRange = `[${testcase.start}, ${testcase.end}]`;
    const selectionText = testcase.selected || '(empty)';

    const htmlMatches = actualHTML === testcase.after;

    const commandsList = testcase.commands
      .map(
        (cmd) =>
          `<span class="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-[10px] font-mono">${escapeHtml(cmd)}</span>`,
      )
      .join(' ');

    row.innerHTML = `
    <td class="px-2 py-1 font-mono text-gray-600">${index + 1}</td>
    <td class="px-2 py-1">${statusIcon}</td>
    <td class="px-2 py-1">
      <div class="flex flex-wrap gap-0.5">${commandsList}</div>
    </td>
    <td class="px-2 py-1">
      <span class="text-gray-500">${selectionRange}</span>
      <code class="bg-blue-100 px-1 rounded text-blue-800 font-mono">"${escapeHtml(selectionText)}"</code>
    </td>
    <td class="px-2 py-1">
      <code class="bg-gray-100 px-1 rounded text-gray-800 font-mono">${escapeHtml(testcase.before)}</code>
    </td>
    <td class="px-2 py-1">
      <code class="${htmlMatches ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-1 rounded font-mono whitespace-nowrap">${escapeHtml(actualHTML)}</code>
    </td>
    <td class="px-2 py-1">
      <code class="bg-gray-100 px-1 rounded text-gray-800 font-mono whitespace-nowrap">${escapeHtml(testcase.after)}</code>
    </td>
  `;
  }

  function updateSummary(passed, failed, current, total) {
    const summary = document.getElementById('test-summary');
    const progressText =
      current < total ? `Test ${current + 1} of ${total} | ` : '';
    summary.innerHTML = `
    <span class="inline-flex items-center gap-2">
      <span class="text-indigo-100">${progressText}</span>
      <span class="bg-green-400/30 text-green-100 px-2 py-0.5 rounded-full">${passed} passed</span>
      <span class="bg-red-400/30 text-red-100 px-2 py-0.5 rounded-full">${failed} failed</span>
    </span>
  `;
  }

  function createContinueButton() {
    const btnContainer = document.createElement('div');
    btnContainer.id = 'continue-btn-container';
    btnContainer.className = 'fixed bottom-4 right-4 z-[100]';
    btnContainer.innerHTML = `
    <button id="continue-btn" class="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2">
      <span id="continue-btn-text">Continue to Next Test</span>
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
      </svg>
    </button>
  `;
    document.body.appendChild(btnContainer);
    return document.getElementById('continue-btn');
  }

  function waitForContinue(continueBtn) {
    return new Promise((resolve) => {
      const btnText = document.getElementById('continue-btn-text');
      btnText.textContent = 'Run Test';
      continueBtn.style.display = 'flex';

      const handler = () => {
        continueBtn.removeEventListener('click', handler);
        resolve();
      };
      continueBtn.addEventListener('click', handler);
    });
  }

  function cloneAndCleanHtml(element) {
    const clone = element.cloneNode(true);

    // Clean blocks by removing data-id attributes
    for (const block of clone.childNodes) {
      block.removeAttribute('data-id');

      const inlines = Array.from(block.childNodes);
      for (const inline of inlines) {
        inline.removeAttribute('data-id');

        // If span, only one child and it's a text node, unwrap it
        if (
          inline.childNodes.length == 1 &&
          inline.firstChild.nodeType === Node.TEXT_NODE &&
          inline.nodeName === 'SPAN'
        ) {
          block.replaceChild(inline.firstChild, inline);
        }
      }
    }

    const stack = Array.from(clone.childNodes);
    while (stack.length > 0) {
      const node = stack.pop();
      if (node.nodeType === Node.ELEMENT_NODE) {
        node.removeAttribute('data-id');
      }
      stack.push(...Array.from(node.childNodes));
    }
    // Remove any unwanted attributes or elements here if needed
    return clone;
  }

  // Initialize the table and continue button
  const tbody = createTestResultsTable();
  const continueBtn = createContinueButton();
  let passedCount = 0;
  let failedCount = 0;

  async function runTests() {
    let shouldWait = false;
    for (let index = 0; index < tests.length; index++) {
      const testcase = tests[index];

      if (testcase.breakpoint === waitAtBreakpoint) {
        shouldWait = true;
      }
      if (testcase.hasOwnProperty('breakpoint')) {
        // Add breakpoint row to table
        addBreakpointRow(tbody, testcase.breakpoint);
        continue;
      }

      // Add pending row before running
      const row = addPendingTestRow(tbody, index, testcase);

      // Wait for user to click continue before proceeding
      if (shouldWait) {
        await waitForContinue(continueBtn);
      }

      // Update summary to show current progress
      updateSummary(passedCount, failedCount, index, tests.length);
      // Set up editor content and selection
      const editor = document.querySelector(SELECTOR_EDITOR);

      // Temporarily set innerHTML to parse it into virtual doc
      editor.innerHTML = testcase.before;
      // Initialize virtual state with new html content
      state.virtualDocument = virtualizeDOM(editor, {
        trimBlockWhiteSpace: true,
        shrinkConsecutiveSpaces: true,
        convertNewlinesToSpaces: true,
      });
      state.virtualIndex = virtualBuildIndex(state);
      state.virtualSelection = virtualizeSelection(state);
      render(state);

      // Set selection
      const range = document.createRange();
      const textNode = editor.querySelector('p').firstChild.firstChild;
      range.setStart(textNode, testcase.start);
      range.setEnd(textNode, testcase.end);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      // Trigger selectionchange event
      document.dispatchEvent(new Event('selectionchange'));
      // Click bold button
      const boldBtn = document.querySelector(SELECTOR_BOLD_BTN);
      for (const command of testcase.commands) {
        if (command === 'bold') {
          boldBtn.click();
        }
      }
      // Get selected text
      const selection = window.getSelection().toString();
      // Get resulting HTML
      const afterHTML = cloneAndCleanHtml(editor).innerHTML;

      // Check results
      const htmlPassed = afterHTML === testcase.after;
      const selectionPassed = selection === testcase.selected;
      const testPassed = htmlPassed && selectionPassed;

      if (testPassed) {
        passedCount++;
      } else {
        failedCount++;
      }

      // Add result to table
      updateTestResult(row, index, testcase, afterHTML, selection, testPassed);

      // Keep console assertions for debugging
      console.assert(
        afterHTML === testcase.after,
        `Test case ${index + 1} failed: expected after HTML to be "${testcase.after}", but got "${afterHTML}"`,
      );

      console.assert(
        selection === testcase.selected,
        `Test case ${index + 1} failed: expected selected text to be "${testcase.selected}", but got "${selection}"`,
      );
    }

    // Update summary after all tests and hide continue button
    updateSummary(passedCount, failedCount, tests.length, tests.length);
    continueBtn.parentElement.style.display = 'none';
  }

  // Start running tests
  setTimeout(runTests, 1000);
})();
