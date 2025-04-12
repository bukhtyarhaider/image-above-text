## Release: v1.0.0 — Initial Public Launch

Turquoise Editor is now officially released.

This is the first stable version of a web-based image editor that allows users to upload photos, remove backgrounds, add styled text layers, and export the final design. Designed with mobile-first responsiveness and offline capabilities in mind, this tool works seamlessly across devices and requires no installation.

---

### Features

**Image Upload**
- Drag and drop or click to upload an image.
- Background removal applied automatically.

**Canvas Editor**
- Built using `react-konva` for layered editing.
- Touch and mouse support for cross-platform interaction.

**Text Layer Controls**
- Add multiple text layers with full drag, drop, and resize capability.
- Font selection from Google Fonts with dynamic loading.
- Real-time control of font family, text color, opacity, and content.
- Keyboard navigation between layers (desktop only).

**Responsive UI**
- Sidebar panel on desktop for text and export options.
- Floating action button (FAB) and touch-optimized controls on mobile.
- Adaptive to keyboard height on small screens.

**Offline Support and Persistence**
- Application auto-saves every 15 seconds.
- IndexedDB used to retain images and text in local storage.
- Banner display for offline status awareness.

**Export and Reset**
- Export your full design as a downloadable PNG image.
- Reset button clears the canvas and local state instantly.

---

### Tech Stack

- React (with TypeScript)
- Tailwind CSS for styling
- Konva.js for canvas rendering
- WebFont Loader for Google Fonts
- Firebase Hosting
- IndexedDB for state persistence
- Heroicons for clean UI icons

---

### Project Status

This version is considered stable for general use and feedback. Future versions may include:
- Undo/Redo functionality
- Text alignment controls
- Multi-image canvas
- Custom background options

---

### License

Released under the MIT License.

---

### Developer Note

Turquoise Editor was solely designed and developed by Bukhtyar Haider.  
This project reflects a focus on clean UI, efficient UX, and code scalability. Contributions and suggestions are always welcome.