Here's a detailed README.md for the microfossils viewer project:

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

1. Fusuline
![alt text](image.png)
![alt text](image-1.png)

2. Radiolarian
![alt text](image-2.png)
![alt text](image-3.png)
3. Foraminifera
![alt text](image-4.png)
![alt text](image-5.png)
         
4. Diatom
![alt text](image-6.png)
![alt text](image-7.png)
5. Conodont
![alt text](image-8.png)

6. Ostracod
![alt text](image-9.png)
7. Acritarch
![alt text](image-10.png)
![alt text](image-11.png)

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

### Key Features

#### Interactive Controls
- Orbit controls for 3D rotation
- Zoom functionality
- Component visibility toggles
- Information panel

#### Fossil Components
Each fossil model includes:
- Anatomically accurate structures
- Interactive labels
- Transparent layers
- Educational descriptions

## Usage

1. Clone the repository
2. Open `index.html` in a modern web browser
3. Select different fossils from the dropdown menu
4. Use mouse controls:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll wheel to zoom



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

## Contributing

To add new fossils:
1. Create a new file in `js/fossils/`
2. Follow the existing component structure
3. Add to the fossil selector in `index.html`
4. Update the main.js import list

## License

MIT License - Feel free to use and modify for educational purposes.
