import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return a fusuline fossil model
export function createFusulineModel(scene) {
    // Create a group to hold all components
    const fusulineGroup = new THREE.Group();
    fusulineGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Add components to the model
    createShell(fusulineGroup);
    createSepta(fusulineGroup);
    createAperture(fusulineGroup);
    createChambers(fusulineGroup);
    
    // Add new components based on the diagram
    createChomata(fusulineGroup);
    createTunnel(fusulineGroup);
    createCuniculus(fusulineGroup);
    createSeptalPores(fusulineGroup);

    return fusulineGroup;
}

// Create the outer shell
function createShell(group) {
    // Create outer shell geometry (elongated ellipsoid)
    const geometry = new THREE.SphereGeometry(1, 32, 24);
    geometry.scale(1.5, 0.8, 0.8);
    
    // Apply material with slight transparency
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xd0d0d0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3,
        metalness: 0.1
    });
    
    // Create mesh and add to group
    const shell = new THREE.Mesh(geometry, material);
    group.add(shell);
    
    // Store component data for UI controls
    const component = {
        name: 'shell',
        displayName: 'Outer Shell',
        mesh: shell,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        // Using global window.labels if it exists, otherwise use an empty array
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Outer Shell (Test)', new THREE.Vector3(1.7, 0, 0), component);
    }
    
    return shell;
}

// Create internal septa (walls between chambers)
function createSepta(group) {
    const septaGroup = new THREE.Group();
    
    // Create material for septa
    const material = new THREE.MeshStandardMaterial({
        color: 0xa0a0a0,
        side: THREE.DoubleSide
    });
    
    // Create spiral-arranged septa inside the shell following fusuline anatomy
    // Shell dimensions (shell is 1.5 in x-axis, 0.8 in y and z)
    const shellRadiusX = 1.5;
    const shellRadiusZ = 0.8;
    
    // Create spiral septa that divide the internal space into chambers
    const numChambers = 8;
    const maxRadius = 0.65; // Keep septa inside the shell
    
    // Calculate spiral points for the septa
    for (let i = 0; i < numChambers; i++) {
        // Create a spiral pattern - each septum rotates and gets slightly larger
        const angle = (i / numChambers) * Math.PI * 6; // Multiple turns of spiral
        const ratio = i / numChambers;
        const radius = maxRadius * (0.3 + ratio * 0.7); // Growing radius for spiral effect
        
        // Calculate position inside the shell
        const posX = radius * Math.cos(angle);
        const posZ = radius * Math.sin(angle);
        
        // Create the septum shape - make it a curved wall shape
        const shape = new THREE.Shape();
        
        // Define the internal wall shape
        const wallHeight = 0.4 - ratio * 0.1; // Slightly smaller toward center
        shape.moveTo(0, -wallHeight);
        shape.quadraticCurveTo(0.2, 0, 0, wallHeight);
        shape.lineTo(radius * 0.6, wallHeight * 0.8);
        shape.quadraticCurveTo(radius * 0.7, 0, radius * 0.6, -wallHeight * 0.8);
        shape.lineTo(0, -wallHeight);
        
        const geometry = new THREE.ShapeGeometry(shape);
        const septum = new THREE.Mesh(geometry, material);
        
        // Position and orient the septum within the shell
        septum.position.set(posX, 0, posZ);
        
        // Orient to align with spiral pattern
        const nextAngle = ((i + 0.5) / numChambers) * Math.PI * 6;
        const nextPosX = radius * Math.cos(nextAngle);
        const nextPosZ = radius * Math.sin(nextAngle);
        septum.lookAt(nextPosX, 0, nextPosZ);
        
        septaGroup.add(septum);
    }
    
    group.add(septaGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'septa',
        displayName: 'Septa (Chamber Walls)',
        group: septaGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label for the internal septa
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Septa', new THREE.Vector3(0.5, 0.2, 0.5), component);
    }
    
    return septaGroup;
}

// Create aperture (opening)
function createAperture(group) {
    // Create aperture geometry (small tube)
    const geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
    
    // Apply material
    const material = new THREE.MeshStandardMaterial({
        color: 0x505050,
        side: THREE.DoubleSide
    });
    
    // Create mesh and add to group
    const aperture = new THREE.Mesh(geometry, material);
    aperture.position.set(1.5, 0, 0);
    aperture.rotation.z = Math.PI / 2;
    group.add(aperture);
    
    // Store component data for UI controls
    const component = {
        name: 'aperture',
        displayName: 'Aperture (Opening)',
        mesh: aperture,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Aperture', new THREE.Vector3(1.7, 0.3, 0), component);
    }
    
    return aperture;
}

// Create internal chambers
function createChambers(group) {
    const chamberGroup = new THREE.Group();
    
    // Create material for chambers
    const material = new THREE.MeshStandardMaterial({
        color: 0xbbaa90,
        transparent: true,
        opacity: 0.6
    });
    
    // Create several chambers with decreasing size
    const numChambers = 5;
    for (let i = 0; i < numChambers; i++) {
        const scale = 0.85 - (i * 0.15);
        
        // Create chamber geometry (ellipsoid)
        const geometry = new THREE.SphereGeometry(scale, 24, 16);
        geometry.scale(1.5, 0.8, 0.8);
        
        const chamber = new THREE.Mesh(geometry, material);
        chamber.position.set(-(i * 0.2), 0, 0);
        chamberGroup.add(chamber);
    }
    
    group.add(chamberGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'chambers',
        displayName: 'Internal Chambers',
        group: chamberGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Chambers', new THREE.Vector3(-0.5, 0.5, 0.5), component);
    }
    
    return chamberGroup;
}

// Create chomata (ridge-like structures)
function createChomata(group) {
    const chomataGroup = new THREE.Group();
    
    // Material for chomata - more accurate calcite-like appearance
    const material = new THREE.MeshStandardMaterial({
        color: 0xd8c8a0,
        roughness: 0.5,
        metalness: 0.1
    });
    
    // Based on scientific references, chomata are secondary deposits along the tunnel
    // that appear as thickenings on the floor of chambers adjacent to the tunnel
    // Create a series of chomata along the central axis on each side of the tunnel
    const numChomata = 6;
    const chomataSpacing = 0.4;  // Spacing along the x-axis
    
    for (let i = 0; i < numChomata; i++) {
        const xPos = -0.8 + (i * chomataSpacing);
        
        // Create left chomata (more organic/curved shape)
        const leftShape = new THREE.Shape();
        leftShape.moveTo(0, 0);
        leftShape.quadraticCurveTo(0.05, 0.08, 0.1, 0.06);
        leftShape.lineTo(0.15, 0);
        leftShape.quadraticCurveTo(0.08, -0.04, 0, 0);
        
        const leftExtrudeSettings = {
            steps: 1,
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 3
        };
        
        const leftGeometry = new THREE.ExtrudeGeometry(leftShape, leftExtrudeSettings);
        const leftChomata = new THREE.Mesh(leftGeometry, material);
        leftChomata.position.set(xPos, 0.05, 0.15);
        leftChomata.rotation.set(Math.PI/2, 0, 0);
        chomataGroup.add(leftChomata);
        
        // Create right chomata
        const rightShape = new THREE.Shape();
        rightShape.moveTo(0, 0);
        rightShape.quadraticCurveTo(0.05, 0.08, 0.1, 0.06);
        rightShape.lineTo(0.15, 0);
        rightShape.quadraticCurveTo(0.08, -0.04, 0, 0);
        
        const rightExtrudeSettings = {
            steps: 1,
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelSegments: 3
        };
        
        const rightGeometry = new THREE.ExtrudeGeometry(rightShape, rightExtrudeSettings);
        const rightChomata = new THREE.Mesh(rightGeometry, material);
        rightChomata.position.set(xPos, 0.05, -0.15);
        rightChomata.rotation.set(Math.PI/2, 0, Math.PI);
        chomataGroup.add(rightChomata);
    }
    
    group.add(chomataGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'chomata',
        displayName: 'Chomata',
        group: chomataGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Chomata', new THREE.Vector3(-0.4, 0.3, 0.3), component);
    }
    
    return chomataGroup;
}

// Create tunnel (opening along the axis)
function createTunnel(group) {
    // In fusulines, the tunnel is a low passage through successive septa along the
    // axis of coiling, created by resorption of parts of septa
    const tunnelGroup = new THREE.Group();
    
    // Accurate material for the tunnel - appears as a void in fossils
    const material = new THREE.MeshBasicMaterial({
        color: 0x202020,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    
    // Create a series of aligned tunnel segments to better represent
    // how tunnels pass through successive septa
    const numSegments = 8;
    const segmentSpacing = 0.3;
    const tunnelWidth = 0.2;
    const tunnelHeight = 0.12; // Lower height for more realistic appearance
    
    for (let i = 0; i < numSegments; i++) {
        const xPos = -1 + (i * segmentSpacing);
        
        // Create a custom shape for the tunnel segment (more oval than circular)
        const segment = new THREE.Mesh(
            new THREE.CylinderGeometry(tunnelWidth/2, tunnelWidth/2, tunnelHeight, 12, 1, true),
            material
        );
        segment.rotation.z = Math.PI / 2; // Orient along x-axis
        segment.position.set(xPos, 0, 0);
        
        tunnelGroup.add(segment);
    }
    
    group.add(tunnelGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'tunnel',
        displayName: 'Tunnel',
        group: tunnelGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Tunnel', new THREE.Vector3(0, 0.2, 0), component);
    }
    
    return tunnelGroup;
}

// Create cuniculi (small passages through septa)
function createCuniculus(group) {
    // Cuniculi are small tubular passages connecting adjacent chambers,
    // often in patterns that bypass the main tunnel
    const cuniculusGroup = new THREE.Group();
    
    // Material for cuniculi
    const material = new THREE.MeshStandardMaterial({
        color: 0x505050,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    
    // Based on scientific literature, cuniculi form networks of passages
    // Create a more accurate representation of these networks
    const radius = 0.04; // Smaller radius for more realistic scale
    
    // Create cuniculi along specific paths between septa
    // These should form a mesh-like network across chamber boundaries
    const cunicularPaths = [
        // Each path defined by start and end points at different chambers
        [new THREE.Vector3(-0.9, 0.2, 0.3), new THREE.Vector3(-0.7, 0.3, 0.2)],
        [new THREE.Vector3(-0.7, 0.3, 0.2), new THREE.Vector3(-0.5, 0.25, 0.3)],
        [new THREE.Vector3(-0.5, 0.25, 0.3), new THREE.Vector3(-0.3, 0.2, 0.35)],
        
        [new THREE.Vector3(-0.8, 0.3, -0.2), new THREE.Vector3(-0.6, 0.25, -0.25)],
        [new THREE.Vector3(-0.6, 0.25, -0.25), new THREE.Vector3(-0.4, 0.2, -0.3)],
        
        [new THREE.Vector3(-0.2, 0.2, 0.4), new THREE.Vector3(0, 0.25, 0.4)],
        [new THREE.Vector3(0, 0.25, 0.4), new THREE.Vector3(0.2, 0.3, 0.35)],
        
        [new THREE.Vector3(-0.3, 0.25, -0.4), new THREE.Vector3(0, 0.2, -0.4)],
        [new THREE.Vector3(0, 0.2, -0.4), new THREE.Vector3(0.3, 0.25, -0.35)],
        
        [new THREE.Vector3(0.4, 0.2, 0.3), new THREE.Vector3(0.6, 0.25, 0.3)],
        [new THREE.Vector3(0.6, 0.25, 0.3), new THREE.Vector3(0.8, 0.2, 0.25)],
        
        [new THREE.Vector3(0.5, 0.25, -0.3), new THREE.Vector3(0.7, 0.2, -0.25)],
        [new THREE.Vector3(0.7, 0.2, -0.25), new THREE.Vector3(0.9, 0.25, -0.2)]
    ];
    
    cunicularPaths.forEach(path => {
        const [start, end] = path;
        
        // Create a curve for the cuniculus
        const curve = new THREE.CatmullRomCurve3([
            start,
            new THREE.Vector3(
                (start.x + end.x) / 2,
                (start.y + end.y) / 2 + 0.03, // Slight curve upward
                (start.z + end.z) / 2
            ),
            end
        ]);
        
        // Create tube geometry along curve
        const tubeGeometry = new THREE.TubeGeometry(curve, 8, radius, 6, false);
        const cuniculus = new THREE.Mesh(tubeGeometry, material);
        
        cuniculusGroup.add(cuniculus);
    });
    
    group.add(cuniculusGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'cuniculus',
        displayName: 'Cuniculi',
        group: cuniculusGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Cuniculi', new THREE.Vector3(-0.6, 0.4, 0.3), component);
    }
    
    return cuniculusGroup;
}

// Create septal pores (small openings in septa)
function createSeptalPores(group) {
    // Septal pores are small rounded openings in the septa,
    // allowing communication between chambers
    const poresGroup = new THREE.Group();
    
    // Material for pores - dark to show the opening
    const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    });
    
    // Based on paleontological studies, septal pores have specific patterns
    // on the septa walls, often in regular arrangements
    const numSepta = 8; // Should match the number in createSepta
    const poreRadius = 0.02; // Smaller for more realistic scale
    
    // Create pore arrangement based on scientific references
    for (let i = 0; i < numSepta; i++) {
        const angle = (i / numSepta) * Math.PI * 2;
        const septumRadius = 0.7; // Should match septa radius
        
        // Define pore patterns for this septum - more accurate pattern
        // based on actual fossils
        const porePattern = [
            // Each array is [radialPosition, heightPosition]
            [0.4, -0.1],
            [0.5, 0],
            [0.6, 0.1],
            [0.7, 0.2],
            [0.5, -0.2],
            [0.6, -0.1],
            [0.7, 0],
            [0.8, 0.1]
        ];
        
        porePattern.forEach(([radial, height]) => {
            const poreX = septumRadius * Math.cos(angle) * radial;
            const poreY = height;
            const poreZ = septumRadius * Math.sin(angle) * radial;
            
            const geometry = new THREE.CircleGeometry(poreRadius, 8);
            const pore = new THREE.Mesh(geometry, material);
            
            // Position the pore
            pore.position.set(poreX, poreY, poreZ);
            
            // Orient the pore perpendicular to radius for correct appearance
            const center = new THREE.Vector3(0, poreY, 0);
            pore.lookAt(center);
            
            poresGroup.add(pore);
        });
    }
    
    group.add(poresGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'septalPores',
        displayName: 'Septal Pores',
        group: poresGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Septal Pores', new THREE.Vector3(0.4, 0, 0.6), component);
    }
    
    return poresGroup;
}

// Update the information section with more scientifically accurate descriptions
export function getFusulineInfo() {
    return `
        <h3>Fusuline</h3>
        <p>Fusulines are an extinct group of marine organisms (Foraminifera) that were abundant during the late Paleozoic era, particularly in the Carboniferous and Permian periods (358-252 million years ago).</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Shape:</strong> Elongated, fusiform (spindle-shaped) test, typically 3-15mm in length</li>
            <li><strong>Composition:</strong> Calcareous test made of calcite</li>
            <li><strong>Interior:</strong> Divided into numerous chambers by walls (septa) arranged in a planispiral pattern</li>
            <li><strong>Growth Pattern:</strong> Coiled structure that expands with growth, with each whorl enveloping previous ones</li>
            <li><strong>Chomata:</strong> Secondary deposits along the tunnel margins that appear as thickenings on the floor of chambers</li>
            <li><strong>Tunnel:</strong> A low passage through successive septa along the axis of coiling, formed by resorption</li>
            <li><strong>Cuniculi:</strong> Small tubular passages connecting adjacent chambers, often forming networks that bypass the main tunnel</li>
            <li><strong>Septal Pores:</strong> Small rounded openings in the septa that allow communication between chambers</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Fusulines evolved rapidly during the late Paleozoic, making them excellent index fossils used to date and correlate rock layers. Different species have distinctive morphologies that indicate specific time periods, making them valuable biostratigraphic markers in limestone formations worldwide.</p>
    `;
} 