# posh-editor

Multiple implementations of a Rich Text Editor

# Implemented Features

- Virtualize DOM HTML to Virtual DOM
- Render Virtual DOM to DOM HTML
- [Format] Bolding text selection (button)
- [Detection] Bolding text selection (button)

# Features to be Implemented

- [Format/Detection] Bolding text selection (button)
- [Format/Detection] Italicize text selection (button)
- [Format/Detection] Underline text selection (button)
- [Format/Detection] Strikethrough text selection (button)
- [Format/Detection] Hyperlink text selection (button)
- [Format/Detection] Set h1,...,h6 on text selection (button)
- [Format/Detection] Change font on text selection (dropdown)
- [Format/Detection] Align text selection (left,right,center,justify) (button)
- [Format/Detection] Change to basic numbered bullet
- [Format/Detection] Change to basic unnumbered bullet
- [Format/Detection] Change to advanced numbered bullet (1,a,A,ii,III)
- [Format/Detection] Change to advanced unnumbered bullet (circle, disc, square)
- [Format/Detection] Change to advanced checkbox bullet (checked/unchecked)
- [Format/Detection] Line height
- [Format/Detection] Left/Right indent
- [Format/Detection] Foreground color with color pallette and picker
- [Format/Detection] Background color with color pallette and picker
- [Format/Detection] Transform to upper, lower, title, camel or snake case
- [Format/Detection] Code formatting for single code word/line
- [Format/Detection] Code formatting (Ace editor insertion) for code block
- [Format/Detection] Superscript and subscript
- Insert image
- Insert table
- Insert video
- Insert iframe
- Show link preview (image, site meta card with opengraph)
- Copy/Paste with/without formatting
- Emojii or special character picker
- Insert LaTex math symbols
- Toggle for RAW HTML, JSON or Markdown (depending on implementation)
- Toggle between \<p\>/\<div\> block, \n character or \<br\> tag newlines
- Fullscreen view button
- Undo/Redo operations
- History
- Block editor mode (content stored as JSON)
- Markdown mode (content stored as markdown)
- Mobile support
- Browser Support (Chrome/FireFox/Safari)
- Word, sentence, media, image, video, iframe counts
- Query mode for counts or stats
- [UI/UX] Styling menu above text selection
- Annotation/Drawing tool
- Modes Draft/Preview/Suggestion
- Collaboration
- Commenting
- [UI/UX] `/` (or Cmd+k) command pallete
- [UI/UX] `@` contact tagging/reference
- Multiple pages
- Multiple tabs
- [Chip] Date
- [Chip] Dropdown
- [Chip] Variable
- [Chip] Bookmark
- [Extension] Custom Chips
- [Extension] Custom formatting (eg span with classes)
- [Extension] Custom transformations
- [UI/UX] View showing keyboard shortcuts
- [Customization] Customize keyboard shortcuts
- Accessibility
- JSON Editor/Builder
- [Keyboard] \* [Space] creates unordered list
- [Keyboard] 1. [Space] creates ordered list
- [Keyboard] Ordered list, tab creates sublist
- [Keyboard] Ordered list, Shift+tab exits list one level up
- [Lists] Be able to start list with 1. | a. | A. | i. | I. | \* | - (should be supported by list-style CSS prop)

# Divs/Paragraphs vs LineBreaks

| Aspect                    | `<br>`-only (single line breaks)                                                                                | `<p>` \/ `<div>` blocks                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Semantics & accessibility | Just a line break. Screen readers don’t announce a new paragraph—just "line break."Good for poems or addresses. | True paragraphs\/sections. Screen readers announce “paragraph X of Y,” improving structure.        |
| Styling & spacing         | All styling must be manual (e.g. marginal spacing via CSS on <br> or wrapper).No automatic margin before/after. | Browsers apply default margins, you can target blocks via CSS selectors, control spacing globally. |
| Copy-paste resilience     | You end up with huge runs of text with `<br>`s; editors or other apps may collapse or misinterpret them.        | Blocks map naturally to most paste targets (Word, Gmail, etc.). You get real paragraphs.           |
| Editing UX                | No notion of “current paragraph” means features like “toggle paragraph style” are awkward.                      | You can select, drag, or style entire paragraphs more easily.                                      |
| HTML payload size         | Slightly lighter per “Enter” than wrapping a full `<p>…\<p>`.                                                   | More markup overhead per block, but negligible unless authoring massive docs.                      |

---

---

---

# Create React App Readme

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
