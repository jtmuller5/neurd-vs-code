# Neurd VS Code Extension

A VS Code extension for working with the Neurd note-taking system, designed for AI-enhanced note-taking and journaling.

## Features

This extension provides commands to quickly create new note files based on templates:

- **Create Daily Note**: Generates a new daily journal entry from the daily template
- **Create Weekly Note**: Generates a weekly journal entry with automatic week numbering
- **Create General Note**: Creates a new note with a custom title

## Installation

You can install this extension directly from the VS Code marketplace:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Neurd Notes"
4. Click Install

## Setup

The extension works with Neurd projects that follow this structure:

```
your-neurd-project/
├── templates/        # Optional - Templates for notes
│   ├── daily.md
│   ├── weekly.md
│   └── note.md
└── content/          # Required - Where notes are stored
    ├── daily/
    ├── weekly/
    ├── notes/
    └── private/      # Git-ignored by default
```

If the templates don't exist, the extension will use default templates.

## Usage

1. Open your Neurd project in VS Code
2. Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for "Neurd"
3. Select one of the Neurd commands:
   - "Neurd: Create Daily Note"
   - "Neurd: Create Weekly Note"
   - "Neurd: Create General Note"
4. Choose whether the note should be public (stored in standard directories) or private (stored in the private directory that is git-ignored)

The extension will:
1. Create the appropriate directory if it doesn't exist
2. Generate a new file based on the corresponding template
3. Replace any template variables (like `${date}`, `${time}`)
4. Open the file in the editor for immediate editing

### Public vs Private Notes

When creating any note, you'll be prompted to choose between:

- **Public** - Stored in the standard directories (`daily`, `weekly`, or `notes`)
- **Private** - Stored in the `content/private` directory, which is excluded from Git by default

## Template Variables

The following variables are supported in templates:
- `${date}` - Current date in YYYY-MM-DD format
- `${time}` - Current time
- `${datetime}` - Current date and time
- `${title}` - The title you provide (for general notes)

## Custom Templates

You can create your own templates in the `/templates` directory of your project:

- `daily.md` - Template for daily notes
- `weekly.md` - Template for weekly notes
- `note.md` - Template for general notes

If these templates don't exist, the extension will use built-in default templates.

## Development

### Building from Source

1. Clone this repository
2. Run `npm install`
3. Run `npm run watch` to compile in watch mode
4. Press F5 to start debugging

### Building VSIX

To build a VSIX package for manual installation:

```bash
npm install -g vsce
npm install
vsce package
```

This will generate a `.vsix` file that can be installed via:
- VS Code -> Extensions -> "..." menu -> "Install from VSIX..."