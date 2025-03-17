import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return a diatom fossil model
export function createDiatomModel(scene) {
    // Create a group to hold all components
    const diatomGroup = new THREE.Group();
    diatomGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Create a simple placeholder model - reduced segments
    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 24); // Reduced from 32
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xe0e0c0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3
    });
    
    const diatom = new THREE.Mesh(geometry, material);
    diatomGroup.add(diatom);
    
    // Add ornaments to represent the diatom's patterned surface
    const ornamentGroup = createOrnaments();
    diatomGroup.add(ornamentGroup);
    
    // Add new components
    const chloroplastGroup = createChloroplasts();
    diatomGroup.add(chloroplastGroup);
    
    const rapheGroup = createRaphe();
    diatomGroup.add(rapheGroup);
    
    // Store components for UI controls
    diatomGroup.userData.components = [
        {
            name: 'frustule',
            displayName: 'Frustule (Shell)',
            mesh: diatom,
            visible: true
        },
        {
            name: 'ornaments',
            displayName: 'Surface Ornaments',
            group: ornamentGroup,
            visible: true
        },
        {
            name: 'chloroplasts',
            displayName: 'Chloroplasts',
            group: chloroplastGroup,
            visible: true
        },
        {
            name: 'raphe',
            displayName: 'Raphe System',
            group: rapheGroup,
            visible: true
        }
    ];

    // Add labels
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(diatomGroup, labelsArray, 'Frustule', new THREE.Vector3(0, 0.4, 0.9), diatomGroup.userData.components[0]);
        addLabel(diatomGroup, labelsArray, 'Surface Ornaments', new THREE.Vector3(0.9, 0.2, 0), diatomGroup.userData.components[1]);
        addLabel(diatomGroup, labelsArray, 'Chloroplasts', new THREE.Vector3(-0.9, 0, 0.2), diatomGroup.userData.components[2]);
        addLabel(diatomGroup, labelsArray, 'Raphe', new THREE.Vector3(0, 0.3, -0.9), diatomGroup.userData.components[3]);
    }

    return diatomGroup;
}

// Create surface ornaments
function createOrnaments() {
    const group = new THREE.Group();
    
    // Create a pattern of small holes on the diatom surface
    const radius = 0.8;
    const height = 0.3;
    const numRows = 4; // Reduced from 5
    const holesPerRow = 12; // Reduced from 16
    
    for (let row = 0; row < numRows; row++) {
        const y = (row / (numRows - 1) - 0.5) * height;
        
        for (let i = 0; i < holesPerRow; i++) {
            const angle = (i / holesPerRow) * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const z = radius * Math.sin(angle);
            
            // Reduced segments
            const holeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 5); // Reduced from 6
            const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x303030 });
            const hole = new THREE.Mesh(holeGeometry, holeMaterial);
            
            hole.position.set(x, y, z);
            hole.rotation.x = Math.PI / 2;
            hole.lookAt(0, y, 0);
            
            group.add(hole);
        }
    }
    
    return group;
}

// Create chloroplasts (photosynthetic organelles)
function createChloroplasts() {
    const group = new THREE.Group();
    
    // Create several plate-like chloroplasts in golden-brown color
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xc2a035, // Golden-brown color typical of diatom chloroplasts
        transparent: true,
        opacity: 0.7,
        roughness: 0.3
    });
    
    // Use instanced mesh for better performance
    const chloroplastGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.15);
    chloroplastGeometry.translate(0, 0, 0.1); // Position slightly away from center
    
    const numChloroplasts = 8; // Keep number low for performance
    const instancedMesh = new THREE.InstancedMesh(chloroplastGeometry, material, numChloroplasts);
    
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < numChloroplasts; i++) {
        const angle = (i / numChloroplasts) * Math.PI * 2;
        const radius = 0.5;
        
        dummy.position.set(
            radius * Math.cos(angle),
            (Math.random() - 0.5) * 0.2,
            radius * Math.sin(angle)
        );
        
        dummy.lookAt(0, 0, 0);
        
        // Add slight random rotation
        dummy.rotation.z = Math.random() * Math.PI * 0.3;
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    
    group.add(instancedMesh);
    
    return group;
}

// Create raphe system (slit in pennate diatoms for movement)
function createRaphe() {
    const group = new THREE.Group();
    
    // Create raphe as a slightly curved line along one side
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, -0.15, -0.79),  // Start at bottom edge
        new THREE.Vector3(0, 0, -0.81),      // Control point slightly curved out
        new THREE.Vector3(0, 0.15, -0.79)    // End at top edge
    );
    
    // Create tube with minimal segments
    const tubeGeometry = new THREE.TubeGeometry(curve, 8, 0.01, 4, false);
    const material = new THREE.MeshBasicMaterial({ color: 0x303030 });
    const rapheTube = new THREE.Mesh(tubeGeometry, material);
    
    group.add(rapheTube);
    
    // Add a central nodule
    const noduleGeometry = new THREE.SphereGeometry(0.02, 6, 4); // Very low poly
    const nodule = new THREE.Mesh(noduleGeometry, material);
    nodule.position.set(0, 0, -0.81);
    
    group.add(nodule);
    
    // Add polar nodules (ends of raphe)
    const polarNodule1 = nodule.clone();
    polarNodule1.position.set(0, 0.15, -0.79);
    polarNodule1.scale.set(0.8, 0.8, 0.8);
    
    const polarNodule2 = nodule.clone();
    polarNodule2.position.set(0, -0.15, -0.79);
    polarNodule2.scale.set(0.8, 0.8, 0.8);
    
    group.add(polarNodule1);
    group.add(polarNodule2);
    
    return group;
}

// Return information about diatoms
export function getDiatomInfo() {
    return `
        <h3>Diatom</h3>
        <p>Diatoms are photosynthetic microalgae belonging to the class Bacillariophyceae. These unicellular organisms first appeared in the Jurassic period (~185 MYA) and diversified significantly during the Cretaceous. Today, diatoms are responsible for approximately 20-25% of global primary productivity.</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Frustule:</strong> Cell wall composed of hydrated amorphous silica (SiO₂·nH₂O) with two overlapping halves (epitheca and hypotheca)</li>
            <li><strong>Surface Ornaments:</strong> Species-specific patterns of pores (areolae) arranged in striae, with 10-40 striae per 10μm in many species</li>
            <li><strong>Morphology:</strong> Two major groups - centric (radial symmetry) and pennate (bilateral symmetry); some pennate forms possess a raphe for motility</li>
            <li><strong>Chloroplasts:</strong> Typically golden-brown due to fucoxanthin pigments, 1-2 per cell in pennate forms, numerous in centric forms</li>
            <li><strong>Size:</strong> 2-200 micrometers, with most species in the 10-50μm range</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Diatom frustules accumulate in marine and freshwater settings, forming diatomaceous earth (diatomite) used in filtration, insulation, and abrasives. Their short life cycles and sensitivity to environmental conditions make them excellent ecological indicators. The distribution of fossil diatoms helps reconstruct past climate and environmental conditions, especially in the Cenozoic Era.</p>
        
        <h4>Taxonomy & Classification:</h4>
        <p>Domain: Eukaryota | Kingdom: Chromista | Phylum: Bacillariophyta | Class: Bacillariophyceae | Orders include: Centrales, Pennales, Thalassiosirales</p>
        
        <p><em>Data sourced from the Diatom Herbarium Database, DiatomBase, and AlgaeBase</em></p>
    `;
} 