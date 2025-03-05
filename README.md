# Neurd VS Code Extension

A VS Code extension for working with the Neurd note-taking system, designed for AI-enhanced note-taking and journaling.

## Features

This extension provides commands to quickly create new note files based on templates:

- **Create Daily Note**: Generates a new daily journal entry from the daily template
- **Create Weekly Note**: Generates a weekly journal entry with automatic week numbering
- **Create General Note**: Creates a new note with a custom title

## Prerequisites

This extension assumes you have a Neurd project structure with:
- `/templates` directory containing template files:
  - `daily.md`
  - `weekly.md`
  - `note.md`
- `/content` directory for storing generated notes:
  - `/content/daily`
  - `/content/weekly`
  - `/content/notes`

## Usage

1. Open your Neurd project in VS Code
2. Use the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for "Neurd"
3. Select one of the Neurd commands:
   - "Neurd: Create Daily Note"
   - "Neurd: Create Weekly Note"
   - "Neurd: Create General Note"

The extension will:
1. Create the appropriate directory if it doesn't exist
2. Generate a new file based on the corresponding template
3. Replace any template variables (like `${date}`, `${time}`)
4. Open the file in the editor for immediate editing

## Template Variables

The following variables are supported in templates:
- `${date}` - Current date in YYYY-MM-DD format
- `${time}` - Current time
- `${datetime}` - Current date and time

## Installation

### Local Development

1. Clone this repository
2. Run `npm install`
3. Press F5 to start debugging (opens a new VS Code window with the extension loaded)

### Building VSIX

To build a VSIX package for manual installation:

```bash
npm install -g vsce
npm install
vsce package
```

This will generate a `.vsix` file that can be installed via:
- VS Code -> Extensions -> "..." menu -> "Install from VSIX..."