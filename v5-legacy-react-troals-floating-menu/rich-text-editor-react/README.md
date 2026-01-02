# Rich Text Editor React

This project is a rich text editor built with React. It allows users to input and format text using a variety of formatting options. The editor integrates a floating menu that appears when text is selected, providing quick access to formatting commands.

## Features

- **Rich Text Formatting**: Users can apply bold, italic, underline, strikethrough, and create lists.
- **Floating Menu**: A context-sensitive floating menu appears when text is selected, offering formatting options.
- **Link Creation**: Users can easily create hyperlinks by pasting URLs or using the link button.
- **Custom Hooks**: Utilizes custom hooks for managing editor commands and text selection.

## Project Structure

```
rich-text-editor-react
├── public
│   ├── index.html        # Main HTML file for the React application
│   └── favicon.ico       # Favicon for the application
├── src
│   ├── components        # Contains all React components
│   │   ├── Editor       # Rich text editor component
│   │   ├── FloatingMenu  # Floating menu for formatting options
│   │   └── Toolbar       # Toolbar for quick formatting commands
│   ├── context           # Context provider for managing editor state
│   ├── hooks             # Custom hooks for editor functionality
│   ├── utils             # Utility functions for formatting and selection
│   ├── App.jsx           # Main application component
│   ├── index.js          # Entry point of the React application
├── package.json          # NPM configuration file
└── README.md             # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd rich-text-editor-react
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the application in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.