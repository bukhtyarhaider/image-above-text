<div align="center">
  <h1>Turquoise Editor 🎨</h1>
  <p>Responsive Web-Based Design Tool for Image Editing, Text Overlay & Export</p>

  <a href="https://turquoise-editor.web.app/">
    <img src="https://img.shields.io/badge/Live-Demo-28a745?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/bukhtyarhaider/turquoise-editor">
    <img src="https://img.shields.io/github/stars/bukhtyarhaider/turquoise-editor?style=for-the-badge&logo=github" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/bukhtyarhaider/turquoise-editor/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/bukhtyarhaider/turquoise-editor?style=for-the-badge&logo=license" alt="License" />
  </a>
  <br />
  <a href="#">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Konva-3D3D3D?style=for-the-badge&logo=canvas&logoColor=white" alt="Konva" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Firebase Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase Hosting" />
  </a>
  <br />
  <a href="mailto:bukhtyar.haider1@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D44638?style=for-the-badge&logo=gmail&logoColor=ffffff" alt="Gmail" />
  </a>
  <a href="https://www.linkedin.com/in/bukhtyar/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=Linkedin&logoColor=ffffff" alt="LinkedIn" />
  </a>
</div>
<br />

Turquoise Editor is a fully responsive web-based design tool that allows you to upload images, remove their backgrounds, add and style text overlays, and export final designs as images. It is built entirely by me (the creator of this repository) with React, TypeScript, Konva, and Tailwind CSS, optimized for both desktop and mobile usage.

![banner](https://github.com/user-attachments/assets/3c09c8a1-d809-4e6c-a60b-bfaef8594326)


---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

Turquoise Editor is designed to provide a smooth and intuitive design experience by combining powerful image processing with dynamic text styling. You can quickly upload images (either by drag-and-drop or file selection), automatically remove backgrounds, overlay customizable text, and export the final design. Furthermore, it supports offline usage and auto-saves in the background.

### Core Technologies

- **React + TypeScript:** For building modular and type-safe components.
- **Konva + react-konva:** For rendering the stage (canvas) and allowing dynamic manipulation of images and text.
- **IndexedDB (via custom hooks):** For storing and auto-saving project states, enabling offline functionality.
- **Tailwind CSS:** For rapid, utility-first styling.

---

## Features

1. **Image Upload & Background Removal**
   - Drag-and-drop file uploads for convenience.
   - Automated background removal and image scaling.

2. **Text Overlay & Styling**
   - Add multiple text items to the canvas.
   - Modify text content, font family (with Google Fonts integration), color, opacity, and positioning.
   - Keyboard navigation for text selection on desktop; touch-friendly behavior on mobile.

3. **Offline-Capable & Auto-Save**
   - An offline indicator warns when not connected.
   - State auto-saves periodically, ensuring minimal data loss.

4. **Responsive Design**
   - A sidebar for controls on larger screens.
   - Floating Action Buttons (FAB) and bottom sheets on mobile devices.

5. **Export/Download**
   - Export the entire canvas with all text overlays as a PNG file.
   - Reset the workspace at any time to start fresh.

---

## Directory Structure

Below is a snapshot of the project’s primary directories and files. This project was solely designed and developed by me.

```
.
├── .github/
├── dist/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   ├── favicon.ico
│   │   └── offline-placeholder.png
│   ├── components/
│   │   ├── Editor.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── TextControls.tsx
│   │   └── TextList.tsx
│   ├── constants/
│   │   └── fonts.ts
│   ├── hooks/
│   │   ├── useImageProcessing.ts
│   │   ├── useStageSize.ts
│   │   └── useTextManagement.ts
│   ├── lib/
│   │   └── db.ts
│   ├── types/
│   │   └── index.d.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

---

## Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or above)
- npm (v6+) or yarn (v1+)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/turquoise-editor.git
   cd turquoise-editor
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   This should open the app at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. **Image Upload:**  
   Click on the main canvas or drag and drop an image file. Once background removal finishes, the processed image is shown.

2. **Add/Edit Text:**  
   - Create new text elements via the “Add Text” button (desktop) or the FAB (mobile).  
   - Edit text content, choose fonts from the included Google Fonts, pick colors, and set opacity.

3. **Canvas Controls:**  
   - On desktop, use the sidebar to select existing text, delete items, or adjust settings.  
   - On mobile, you’ll see a floating toolbar, color picker, and bottom sheet for font selection.

4. **Export/Download:**  
   Click the "Export Image" button to save your design as a PNG file.

5. **Reset Workspace:**  
   Use the “Reset Workspace” or “Clear State” button to remove all uploaded images and text from the canvas.

---

## Development

- **Code Organization:**  
  Each React component handles a distinct feature or interface section. We use hooks for logic around image processing (`useImageProcessing`), text management (`useTextManagement`), and canvas sizing (`useStageSize`).

- **Auto-Save Mechanism:**  
  The editor automatically saves your session state in `IndexedDB` every 15 seconds (debounced). This state is rehydrated on page load, even without an active internet connection.

- **Responsive & Offline Support:**  
  Tailwind CSS classes and conditional layout logic ensure a smooth UI on any screen size. An offline banner appears at the top of the app to inform users when connectivity is lost.

- **Error Handling:**  
  The `ErrorBoundary.tsx` component gracefully captures runtime errors, displaying a friendly message with the option to reload the application.

---

## Contributing

Contributions are welcome! If you would like to suggest improvements, please feel free to open an issue or a pull request. For major changes, open a discussion first to align on the plan.

**Steps to Contribute:**

1. Fork this repository.
2. Create a new branch: `git checkout -b feature/MyNewFeature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push the branch: `git push origin feature/MyNewFeature`.
5. Open a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE). You’re free to modify and distribute it as permitted by the license terms.

---

## Acknowledgments

- **React** and **TypeScript** for creating a solid foundation to build upon.
- **Konva** & **react-konva** for providing a powerful canvas library to manage graphics and text.
- **Tailwind CSS** for its utility-first approach to styling.
- **Heroicons** for beautifully designed icons.
- **Google Fonts** & **WebFont Loader** for font integration.
- Everyone who contributed to open-source projects and tools that made this editor possible.

---

**Designed and developed by Bukhtyar Haider.**  
Thank you for checking out Turquoise Editor! Feel free to reach out if you have any questions or feedback.
