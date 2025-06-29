# posh-editor
Multiple implementations of a Rich Text Editor


# Features
* [Format/Detection] Bolding text selection (button)
* [Format/Detection] Italicize text selection (button)
* [Format/Detection] Underline text selection (button)
* [Format/Detection] Strikethrough text selection (button)
* [Format/Detection] Hyperlink text selection (button)
* [Format/Detection] Set h1,...,h6 on text selection (button)
* [Format/Detection] Change font on text selection (dropdown)
* [Format/Detection] Align text selection (left,right,center,justify) (button)
* [Format/Detection] Change to basic numbered bullet
* [Format/Detection] Change to basic unnumbered bullet
* [Format/Detection] Change to advanced numbered bullet (1,a,A,ii,III)
* [Format/Detection] Change to advanced unnumbered bullet (circle, disc, square)
* [Format/Detection] Change to advanced checkbox bullet (checked/unchecked)
* [Format/Detection] Line height
* [Format/Detection] Left/Right indent
* [Format/Detection] Foreground color with color pallette and picker
* [Format/Detection] Background color with color pallette and picker
* [Format/Detection] Transform to upper, lower, title, camel or snake case
* [Format/Detection] Code formatting for single code word/line
* [Format/Detection] Code formatting (Ace editor insertion) for code block
* [Format/Detection] Superscript and subscript
* Insert image
* Insert table
* Insert video
* Insert iframe
* Show link preview (image, site meta card with opengraph)
* Copy/Paste with/without formatting
* Emojii or special character picker
* Insert LaTex math symbols
* Toggle for RAW HTML, JSON or Markdown (depending on implementation)
* Toggle between \<p\>/\<div\> block, \n character or \<br\> tag newlines
* Fullscreen view button
* Undo/Redo operations
* History
* Block editor mode (content stored as JSON)
* Markdown mode (content stored as markdown)
* Mobile support
* Browser Support (Chrome/FireFox/Safari)
* Word, sentence, media, image, video, iframe counts
* Query mode for counts or stats
* [UI/UX] Styling menu above text selection
* Annotation/Drawing tool
* Modes Draft/Preview/Suggestion
* Collaboration
* Commenting
* [UI/UX] `/` (or Cmd+k) command pallete 
* [UI/UX] `@` contact tagging/reference
* Multiple pages
* Multiple tabs
* [Chip] Date
* [Chip] Dropdown
* [Chip] Variable
* [Chip] Bookmark
* [Extension] Custom Chips
* [Extension] Custom formatting (eg span with classes)
* [Extension] Custom transformations
* [UI/UX] View showing keyboard shortcuts
* [Customization] Customize keyboard shortcuts
* Accessibility
* JSON Editor/Builder
* [Keyboard] * [Space] creates unordered list
* [Keyboard] 1. [Space] creates ordered list
* [Keyboard] Ordered list, tab creates sublist
* [Keyboard] Ordered list, Shift+tab exits list one level up



# Divs/Paragraphs vs LineBreaks
| Aspect | `<br>`-only (single line breaks) | `<p>` \/ `<div>` blocks |
|--------|--------------------------------|---------------------------|
| Semantics & accessibility | Just a line break. Screen readers don’t announce a new paragraph—just "line break."Good for poems or addresses. | True paragraphs\/sections. Screen readers announce “paragraph X of Y,” improving structure. |
| Styling & spacing | All styling must be manual (e.g. marginal spacing via CSS on <br> or wrapper).No automatic margin before/after. | Browsers apply default margins, you can target blocks via CSS selectors, control spacing globally. |
| Copy-paste resilience | You end up with huge runs of text with `<br>`s; editors or other apps may collapse or misinterpret them. | Blocks map naturally to most paste targets (Word, Gmail, etc.). You get real paragraphs. |
| Editing UX | No notion of “current paragraph” means features like “toggle paragraph style” are awkward. | You can select, drag, or style entire paragraphs more easily. |
| HTML payload size | Slightly lighter per “Enter” than wrapping a full `<p>…\<p>`. | More markup overhead per block, but negligible unless authoring massive docs. |