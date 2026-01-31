# Test Suite Description

This is a comprehensive test suite for a **rich text editor's bold formatting functionality**. The tests verify that bold formatting (`<b>` tags) is correctly applied and removed across various selection scenarios.

## Test Structure

Each test case contains:

- **`before`**: Initial HTML state of the editor
- **`after`**: Expected HTML state after executing commands
- **`selected`**: The visible text that should be selected
- **`commands`**: Array of commands to execute (selection commands followed by formatting commands)

The selection format is: `select[blockIndex,inlineIndex,nodeIndex|offset][blockIndex,inlineIndex,nodeIndex|offset]`

## Test Categories

### 1. **Bold Only** (Single Paragraph)

Tests applying bold to various selections within a single paragraph (`<p>01234</p>`):

- Selections starting at each position (0-5)
- Selections of varying lengths (0-5 characters)
- Collapsed selections (cursor position with no selection)
- Verifies that `<b>` tags are correctly inserted around selected text

### 2. **Bold and Unbold** (Single Paragraph)

Tests toggling bold on/off by applying the bold command twice:

- Same selection scenarios as "Bold Only"
- Verifies that double-bold returns to the original state (no `<b>` tags)
- Ensures bold is properly removed when toggled off

### 3. **Bold Across Two Paragraphs**

Tests bold formatting that spans paragraph boundaries:

- Selections starting in the first paragraph and extending into the second
- Tests all combinations of start/end positions across `<p>01234</p><p>56789</p>`
- Verifies correct handling of paragraph boundaries (`&ZeroWidthSpace;` markers)
- Ensures bold tags are properly applied to both paragraphs independently

### 4. **Bold Unbold Across Two Paragraphs**

Tests toggling bold across paragraph boundaries:

- Same scenarios as "Bold Across Two Paragraphs"
- Verifies that bold can be cleanly removed across multiple paragraphs
- Special case: `&ZeroWidthSpace;` remains bolded when selection spans paragraph boundary at end

### 5. **Bold Across Three Paragraphs**

Tests bold formatting spanning three paragraphs:

- Examples include selections like `2\n\n345\n\n` and `2\n\n345\n\n6`
- Verifies correct handling of zero-width space markers at paragraph boundaries

### 6. **Bold Unbold Across Three Paragraphs**

Tests toggling bold across three paragraphs:

- Ensures bold can be removed cleanly across multiple paragraph boundaries

## Key Testing Patterns

- **Collapsed selections** (start = end): Should not apply formatting
- **Single character selections**: Should wrap that character in `<b>` tags
- **Full paragraph selections**: Should bold entire content
- **Cross-paragraph selections**: Should apply bold to each paragraph independently with proper boundary handling
- **Zero-width space markers**: Used at paragraph boundaries when selection extends across them
