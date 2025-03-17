# Microfossil 3D Viewer

An interactive 3D visualization tool for studying and understanding important microfossils using Three.js.

## Overview

This web application provides detailed 3D models of various microfossils commonly studied in micropaleontology. It features:

- Interactive 3D models with rotation and zoom capabilities
- Detailed anatomical labels
- Component highlighting
- Educational descriptions
- Cross-sectional views

## Supported Microfossils

The application includes the following microfossil models:

1. **Fusuline** - Extinct marine organisms from the late Paleozoic era
2. **Radiolarian** - Single-celled marine organisms with intricate mineral skeletons
3. **Foraminifera** - Single-celled marine organisms with calcium carbonate shells
4. **Diatom** - Microscopic algae with silica cell walls
5. **Conodont** - Primitive marine vertebrates with tooth-like feeding elements
6. **Ostracod** - Small crustaceans with bivalved shells
7. **Acritarch** - Organic microfossils of uncertain biological affinity

## Usage

1. Open `index.html` in a modern web browser (Chrome recommended)
2. Select different fossils from the dropdown menu
3. Use mouse controls:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll wheel to zoom
4. Toggle components visibility using the checkboxes
5. Read detailed information in the info panel

## Technical Details

### Dependencies
- Three.js (v0.160.0)
- ES Module Shims (v1.8.0)

### Project Structure
```plaintext
microfossils-viewer/
├── index.html          # Main entry point
├── styles.css          # Styling
└── js/
    ├── main.js         # Core application logic
    ├── controls.js     # UI controls
    ├── labelUtils.js   # Label management
    └── fossils/        # Individual fossil models
        ├── fusuline.js
        ├── radiolarian.js
        └── ...
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires WebGL support and a modern browser with ES6+ capabilities.

## Educational Use

This tool is designed for:
- Paleontology students
- Researchers
- Educational institutions
- Anyone interested in micropaleontology

Each fossil includes detailed information about:
- Morphological features
- Key identifying characteristics
- Historical significance
- Geological importance

## License

MIT License - Feel free to use and modify for educational purposes. 