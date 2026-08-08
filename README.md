# Simple Notes App

A lightweight, structured web application for managing notes with categorization, a fully functional trash bin, and automatic persistence.

---

## 🚀 Features

- **Organize & Group:** Create notes under existing categories or create new topic groups.
- **Dynamic Dropdown:** Existing note titles are automatically extracted and offered as selection options.
- **Trash Bin Functionality (`<dialog>`):**
  - Move notes to the trash bin and restore them when needed.
  - Close the trash modal via button or backdrop click.
  - Delete notes permanently from the trash bin.
- **Local Storage:** Automatic state synchronization with the browser's `localStorage`.
- **Accessible UI:** Built using native HTML5 elements like `<dialog>` for modals.

---

## 🛠️ Tech Stack

- **HTML5** (Semantic layout, `<dialog>` modal)
- **CSS3** (Custom styling, rotated diamonds as bullet points via pseudo-elements)
- **JavaScript (ES6+)** (DOM manipulation, data-driven rendering, state management)
- **JSDoc** (Complete type and function documentation)

---

## 📁 Project Structure

├── assets/
│ ├── fonts/
│ ├── icons/ # SVG icons for trash bin and notebook
│ └── imgs/
├── css/
│ └── styles/
│ ├── assets.css
│ ├── fonts.css
│ ├── standard.css
│ └── variables.css
├── scripts/
│ └── templates.js # HTML template functions
├── index.html # Main HTML file
├── README.md
├── script.js # Main logic & state management
└── style.css # Global stylesheet file

---

## 💻 Installation & Getting Started

1. **Clone or download the repository:**
   git clone https://github.com/your-username/your-project-name.git

2. **Open the project:**
   - Simply open `index.html` directly in your browser of choice or use an extension like **Live Server** in VS Code.

---

## 📚 Generate Documentation (JSDoc)

The codebase is fully documented using JSDoc comments. To generate the HTML documentation in your terminal:

# Install JSDoc globally if you haven't already

npm install -g jsdoc

# Generate documentation (scans all JS files recursively)

jsdoc -r .

You can find the generated output in the newly created `./out/index.html` folder.
