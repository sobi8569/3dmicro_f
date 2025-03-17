import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return an ostracod fossil model
export function createOstracodModel(scene) {
    // Create a group to hold all components
    const ostracodeGroup = new THREE.Group();
    ostracodeGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Add components to the model
    createCarapace(ostracodeGroup);
    createHinge(ostracodeGroup);
    createAppendages(ostracodeGroup);
    createInternalBody(ostracodeGroup);
    createMuscleScars(ostracodeGroup);
    createEyeSpots(ostracodeGroup);

    return ostracodeGroup;
}

// Create the carapace (external shell)
function createCarapace(group) {
    // Create a bean-shaped geometry for the carapace
    const length = 1.5;
    const height = 0.8;
    const width = 0.9;
    
    // Create left valve
    const leftValve = createValve(-0.02, 0xdad0c0);
    
    // Create right valve (slightly displaced)
    const rightValve = createValve(0.02, 0xd5cbb5);
    
    // Add both valves to a group
    const carapaceGroup = new THREE.Group();
    carapaceGroup.add(leftValve);
    carapaceGroup.add(rightValve);
    
    group.add(carapaceGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'carapace',
        displayName: 'Carapace (Shell)',
        group: carapaceGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Carapace', new THREE.Vector3(0, 0.6, 0.6), component);
    }
    
    // Helper function to create a valve
    function createValve(offset, color) {
        const shape = new THREE.Shape();
        
        // Create bean-like shape
        shape.moveTo(-length/2, 0);
        shape.bezierCurveTo(-length/2, height/2, -length/4, height/1.7, 0, height/2);
        shape.bezierCurveTo(length/4, height/1.7, length/2, height/2, length/2, 0);
        shape.bezierCurveTo(length/2, -height/2, length/4, -height/1.7, 0, -height/2);
        shape.bezierCurveTo(-length/4, -height/1.7, -length/2, -height/2, -length/2, 0);
        
        const extrudeSettings = {
            steps: 1, // Reduced from 2
            depth: width/2,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 3 // Reduced from 5
        };
        
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Apply material
        const material = new THREE.MeshPhysicalMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            roughness: 0.4,
            metalness: 0.1
        });
        
        // Create mesh and position
        const valve = new THREE.Mesh(geometry, material);
        valve.position.set(0, 0, offset);
        valve.rotation.x = Math.PI / 2;
        
        return valve;
    }
    
    return carapaceGroup;
}

// Create the hinge connecting the two valves
function createHinge(group) {
    // Create hinge geometry - simple box with minimal segments
    const length = 1;
    const hingeGeometry = new THREE.BoxGeometry(length, 0.03, 0.01, 1, 1, 1); // Added explicit segment counts
    
    // Apply material
    const material = new THREE.MeshStandardMaterial({
        color: 0x8a8070,
        roughness: 0.7
    });
    
    // Create mesh and add to group
    const hinge = new THREE.Mesh(hingeGeometry, material);
    hinge.position.set(0, 0.35, 0);
    group.add(hinge);
    
    // Store component data for UI controls
    const component = {
        name: 'hinge',
        displayName: 'Hinge Line',
        mesh: hinge,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Hinge Line', new THREE.Vector3(0, 0.5, 0.3), component);
    }
    
    return hinge;
}

// Create appendages (simplified)
function createAppendages(group) {
    const appendageGroup = new THREE.Group();
    
    // Material for appendages
    const material = new THREE.MeshStandardMaterial({
        color: 0xc0c0d0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3
    });
    
    // Create several appendages - reduced count
    const numAppendages = 4; // Reduced from 5
    const startX = -0.4;
    const spacing = 0.25; // Adjusted for fewer appendages
    
    for (let i = 0; i < numAppendages; i++) {
        const x = startX + i * spacing;
        
        // Create curved appendage with reduced segments
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(x, -0.2, 0),
            new THREE.Vector3(x, -0.4, 0.1),
            new THREE.Vector3(x + 0.1, -0.5, 0.2),
            new THREE.Vector3(x + 0.2, -0.6, 0.3)
        );
        
        // Reduced segments for tube geometry
        const tubeGeometry = new THREE.TubeGeometry(curve, 12, 0.02, 6, false); // Reduced from 20, 8
        const appendage = new THREE.Mesh(tubeGeometry, material);
        
        appendageGroup.add(appendage);
    }
    
    group.add(appendageGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'appendages',
        displayName: 'Appendages',
        group: appendageGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Appendages', new THREE.Vector3(0.2, -0.7, 0.5), component);
    }
    
    return appendageGroup;
}

// Create internal body
function createInternalBody(group) {
    // Create geometry for internal body - reduced segments
    const geometry = new THREE.SphereGeometry(0.4, 16, 12); // Reduced from 24, 16
    geometry.scale(1, 0.7, 0.6);
    
    // Apply material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xe0c090,
        transparent: true,
        opacity: 0.6,
        roughness: 0.3
    });
    
    // Create mesh and add to group
    const body = new THREE.Mesh(geometry, material);
    body.position.set(0, 0, 0);
    group.add(body);
    
    // Store component data for UI controls
    const component = {
        name: 'body',
        displayName: 'Internal Body',
        mesh: body,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Internal Body', new THREE.Vector3(0, 0, 0.7), component);
    }
    
    return body;
}

// Create muscle scars on the interior of the valve
function createMuscleScars(group) {
    const scarGroup = new THREE.Group();
    
    // Material for muscle scars
    const material = new THREE.MeshBasicMaterial({
        color: 0x707070,
        side: THREE.DoubleSide
    });
    
    // Create a pattern of muscle scars - typical adductor muscle scar pattern
    // Keep everything very low-poly for performance
    
    // Main adductor muscle scar cluster position
    const centerX = -0.2;
    const centerY = 0;
    const centerZ = 0.44; // Just inside the valve surface
    
    // Create several small circles in a pattern for the adductor muscle scars
    const positions = [
        [0, 0.08],  // Top
        [0, -0.08], // Bottom
        [0.07, 0.04], // Top right
        [0.07, -0.04], // Bottom right
        [-0.07, 0.04], // Top left
        [-0.07, -0.04] // Bottom left
    ];
    
    // Use instanced mesh for better performance
    const scarGeometry = new THREE.CircleGeometry(0.03, 5); // Very low poly count
    const instancedMesh = new THREE.InstancedMesh(scarGeometry, material, positions.length);
    
    const dummy = new THREE.Object3D();
    
    positions.forEach((pos, index) => {
        const [offsetX, offsetY] = pos;
        
        dummy.position.set(centerX + offsetX, centerY + offsetY, centerZ);
        dummy.lookAt(centerX + offsetX, centerY + offsetY, 0); // Orient to face interior
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(index, dummy.matrix);
    });
    
    scarGroup.add(instancedMesh);
    
    group.add(scarGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'muscleScars',
        displayName: 'Muscle Scars',
        group: scarGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Muscle Scars', new THREE.Vector3(-0.2, 0.1, 0.7), component);
    }
    
    return scarGroup;
}

// Create eye spots (many ostracods have simple light-sensing organs)
function createEyeSpots(group) {
    const eyeGroup = new THREE.Group();
    
    // Material for eye spots
    const material = new THREE.MeshStandardMaterial({
        color: 0x404040,
        emissive: 0x202020, // Slight glow effect
        roughness: 0.3
    });
    
    // Create two eye spots
    const eyeGeometry = new THREE.SphereGeometry(0.05, 6, 4); // Very low poly count
    
    // Left eye
    const leftEye = new THREE.Mesh(eyeGeometry, material);
    leftEye.position.set(0.5, 0.3, 0.3);
    eyeGroup.add(leftEye);
    
    // Right eye
    const rightEye = new THREE.Mesh(eyeGeometry, material);
    rightEye.position.set(0.5, 0.3, -0.3);
    eyeGroup.add(rightEye);
    
    // Add transparent eye covers
    const coverMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0d8c0, // Same color as carapace
        transparent: true,
        opacity: 0.5,
        roughness: 0.2
    });
    
    // Eye covers slightly larger than the eyes
    const coverGeometry = new THREE.SphereGeometry(0.06, 6, 4);
    
    const leftCover = new THREE.Mesh(coverGeometry, coverMaterial);
    leftCover.position.copy(leftEye.position);
    eyeGroup.add(leftCover);
    
    const rightCover = new THREE.Mesh(coverGeometry, coverMaterial);
    rightCover.position.copy(rightEye.position);
    eyeGroup.add(rightCover);
    
    group.add(eyeGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'eyeSpots',
        displayName: 'Eye Spots',
        group: eyeGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Eye Spots', new THREE.Vector3(0.6, 0.5, 0), component);
    }
    
    return eyeGroup;
}

// Return information about ostracods
export function getOstracodInfo() {
    return `
        <h3>Ostracod</h3>
        <p>Ostracods are small bivalved crustaceans (Class Ostracoda) that have existed since the early Ordovician (~485 MYA). With over 33,000 described species (living and fossil), they represent one of the most diverse groups of crustaceans and have successfully colonized marine, freshwater, and even semi-terrestrial environments.</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Carapace:</strong> Bivalved shell composed of low-magnesium calcite (CaCO₃), with hingement types including adont, lophodont, and heterodont</li>
            <li><strong>Ornamentation:</strong> Shell surface may bear distinctive ridges, reticulation, or tubercles with taxonomic significance</li>
            <li><strong>Appendages:</strong> Up to 7 pairs (antennae, mandibles, maxillae, and limbs), rarely preserved in fossils but vital for classification</li>
            <li><strong>Dimorphism:</strong> Many taxa exhibit sexual dimorphism, with females often possessing brood pouches (loculi) for egg incubation</li>
            <li><strong>Size:</strong> Typically 0.5-2mm, with Paleozoic forms (Leperditicopida) reaching up to 80mm</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Ostracods serve as important paleoecological indicators due to their sensitivity to water chemistry, temperature, and depth. Their calcified carapaces preserve well in the fossil record, making them valuable for biostratigraphy, especially in non-marine deposits where other index fossils may be absent. The oxygen isotope composition (δ¹⁸O) of ostracod valves is widely used in paleoclimate reconstructions to determine ancient water temperatures and salinity.</p>
        
        <h4>Taxonomy & Classification:</h4>
        <p>Domain: Eukaryota | Kingdom: Animalia | Phylum: Arthropoda | Subphylum: Crustacea | Class: Ostracoda | Major orders: Podocopida, Myodocopida, Palaeocopida</p>
        
        <p><em>Data sourced from the World Ostracoda Database and Kempf Ostracod Database</em></p>
    `;
} 