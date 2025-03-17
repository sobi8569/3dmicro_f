import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return an acritarch fossil model
export function createAcritarchModel(scene) {
    // Create a group to hold all components
    const acritarchGroup = new THREE.Group();
    acritarchGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Add components to the model
    createVesicle(acritarchGroup);
    createProcesses(acritarchGroup);
    createOperculum(acritarchGroup);
    createInteriorStructure(acritarchGroup);
    createWallUltrastructure(acritarchGroup);
    createSurfaceOrnamentation(acritarchGroup);

    return acritarchGroup;
}

// Create the vesicle (central body)
function createVesicle(group) {
    // Create vesicle geometry (spherical body) - reduced segments
    const geometry = new THREE.SphereGeometry(0.7, 24, 16); // Reduced from 32, 32
    
    // Apply material with slight transparency
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xc8dcc0, // Light greenish
        transparent: true,
        opacity: 0.8,
        roughness: 0.4,
        metalness: 0.1
    });
    
    // Create mesh and add to group
    const vesicle = new THREE.Mesh(geometry, material);
    group.add(vesicle);
    
    // Store component data for UI controls
    const component = {
        name: 'vesicle',
        displayName: 'Vesicle (Central Body)',
        mesh: vesicle,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Vesicle', new THREE.Vector3(0, 0.8, 0), component);
    }
    
    return vesicle;
}

// Create processes (spines)
function createProcesses(group) {
    const processesGroup = new THREE.Group();
    
    // Material for processes - make it slightly more transparent to match image
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xc0c8b8, // Slightly greenish color to better match the image
        transparent: true,
        opacity: 0.85,
        roughness: 0.5,
        metalness: 0.1
    });
    
    // Create many processes radiating outward - optimized count
    const numProcesses = 60; // Reduced for better performance
    
    // Instead of cone geometry, use a custom geometry to create flat, blade-like processes
    // that more closely resemble the image
    
    // Create a single flat blade geometry that will be instanced
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.1, 0.1);
    shape.lineTo(0.1, 0.5);  // Tall blade
    shape.lineTo(0.05, 0.65); // Tapered tip
    shape.lineTo(0, 0.5);
    shape.lineTo(0, 0);
    
    // Extrude the shape to create a thin blade
    const extrudeSettings = {
        steps: 1,
        depth: 0.02,
        bevelEnabled: false
    };
    
    const processGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    processGeometry.scale(1, 1, 1); // Scale to appropriate size
    processGeometry.translate(-0.05, 0, -0.01); // Center the blade
    
    // Use instanced mesh for better performance
    const processMesh = new THREE.InstancedMesh(processGeometry, material, numProcesses);
    const dummy = new THREE.Object3D();
    
    // Distribution parameters
    const radius = 0.7; // Should match vesicle radius
    
    for (let i = 0; i < numProcesses; i++) {
        // Use fibonacci distribution for even spacing on sphere
        const phi = Math.acos(-1 + (2 * i) / numProcesses);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Calculate position on sphere surface
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Set position on vesicle surface
        dummy.position.set(x, y, z);
        
        // Make the blade look outward from the center
        dummy.lookAt(0, 0, 0);
        dummy.rotateY(Math.PI); // Rotate to face outward
        
        // Add some random rotation around the radial axis for natural appearance
        dummy.rotateZ(Math.random() * Math.PI * 2);
        
        // Randomize the scale a bit
        const scaleY = 1.2 + Math.random() * 0.8; // Length variation
        const scaleX = 0.8 + Math.random() * 0.4; // Width variation
        dummy.scale.set(scaleX, scaleY, 1);
        
        dummy.updateMatrix();
        processMesh.setMatrixAt(i, dummy.matrix);
    }
    
    processesGroup.add(processMesh);
    
    // Create a few larger, more prominent processes like in the image
    const numProminentProcesses = 15;
    const prominentProcessMesh = new THREE.InstancedMesh(processGeometry, material, numProminentProcesses);
    
    for (let i = 0; i < numProminentProcesses; i++) {
        // More sparse distribution
        const phi = Math.acos(-1 + (2 * i) / numProminentProcesses);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Position on vesicle surface
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        dummy.position.set(x, y, z);
        
        // Make the blade look outward from the center
        dummy.lookAt(0, 0, 0);
        dummy.rotateY(Math.PI); // Rotate to face outward
        dummy.rotateZ(Math.random() * Math.PI * 2);
        
        // Make these processes larger
        const scaleY = 2.0 + Math.random() * 1.0; // Much longer
        const scaleX = 1.2 + Math.random() * 0.6; // Wider
        dummy.scale.set(scaleX, scaleY, 1);
        
        dummy.updateMatrix();
        prominentProcessMesh.setMatrixAt(i, dummy.matrix);
    }
    
    processesGroup.add(prominentProcessMesh);
    group.add(processesGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'processes',
        displayName: 'Processes (Spines)',
        group: processesGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Processes', new THREE.Vector3(1.1, 0, 0.3), component);
    }
    
    return processesGroup;
}

// Create operculum (lid-like opening)
function createOperculum(group) {
    // Create operculum geometry - reduced segments
    const geometry = new THREE.CircleGeometry(0.2, 16); // Reduced from 32
    
    // Apply material
    const material = new THREE.MeshStandardMaterial({
        color: 0x90b080,
        side: THREE.DoubleSide
    });
    
    // Create mesh and add to group
    const operculum = new THREE.Mesh(geometry, material);
    operculum.position.set(0, 0, 0.7); // Position on surface of vesicle
    group.add(operculum);
    
    // Store component data for UI controls
    const component = {
        name: 'operculum',
        displayName: 'Operculum (Opening)',
        mesh: operculum,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Operculum', new THREE.Vector3(0, 0.3, 1.0), component);
    }
    
    return operculum;
}

// Create interior structure
function createInteriorStructure(group) {
    // Create interior structure geometry - reduced segments
    const geometry = new THREE.SphereGeometry(0.4, 16, 12); // Reduced from 24, 16
    
    // Apply material with higher transparency
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xe0f0e0,
        transparent: true,
        opacity: 0.4,
        roughness: 0.3
    });
    
    // Create mesh and add to group
    const interior = new THREE.Mesh(geometry, material);
    group.add(interior);
    
    // Store component data for UI controls
    const component = {
        name: 'interior',
        displayName: 'Interior Structure',
        mesh: interior,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Interior', new THREE.Vector3(0, -0.3, 0.5), component);
    }
    
    return interior;
}

// Create wall ultrastructure (layered wall structure)
function createWallUltrastructure(group) {
    const wallGroup = new THREE.Group();
    
    // Create a thin section of the vesicle wall to show lamination
    // Position it slightly offset from the main vesicle for visibility
    
    // Material for the wall layers
    const outerWallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xc0d0b0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.4
    });
    
    const innerWallMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xa8b898,
        transparent: true,
        opacity: 0.8,
        roughness: 0.3
    });
    
    // Position the wall section at the edge of the vesicle
    const sectionPosition = new THREE.Vector3(1.0, 0, 0);
    
    // Create the outer wall layer
    const outerWallGeometry = new THREE.BoxGeometry(0.03, 0.2, 0.2);
    const outerWall = new THREE.Mesh(outerWallGeometry, outerWallMaterial);
    outerWall.position.copy(sectionPosition);
    wallGroup.add(outerWall);
    
    // Create the inner wall layer
    const innerWallGeometry = new THREE.BoxGeometry(0.02, 0.18, 0.18);
    const innerWall = new THREE.Mesh(innerWallGeometry, innerWallMaterial);
    innerWall.position.copy(sectionPosition);
    innerWall.position.x -= 0.01; // Position slightly inside the outer layer
    wallGroup.add(innerWall);
    
    // Add boundary lines for better visibility
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x606060 });
    
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array([
        // Top edge
        sectionPosition.x - 0.02, sectionPosition.y + 0.1, sectionPosition.z + 0.1,
        sectionPosition.x + 0.02, sectionPosition.y + 0.1, sectionPosition.z + 0.1,
        
        // Bottom edge
        sectionPosition.x - 0.02, sectionPosition.y - 0.1, sectionPosition.z + 0.1,
        sectionPosition.x + 0.02, sectionPosition.y - 0.1, sectionPosition.z + 0.1,
        
        // Left edge
        sectionPosition.x - 0.02, sectionPosition.y + 0.1, sectionPosition.z + 0.1,
        sectionPosition.x - 0.02, sectionPosition.y - 0.1, sectionPosition.z + 0.1,
        
        // Right edge
        sectionPosition.x + 0.02, sectionPosition.y + 0.1, sectionPosition.z + 0.1,
        sectionPosition.x + 0.02, sectionPosition.y - 0.1, sectionPosition.z + 0.1
    ]);
    
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    wallGroup.add(lines);
    
    group.add(wallGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'wallUltrastructure',
        displayName: 'Wall Ultrastructure',
        group: wallGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Wall Ultrastructure', new THREE.Vector3(1.2, 0.3, 0), component);
    }
    
    return wallGroup;
}

// Create surface ornamentation (microgranules, reticulation)
function createSurfaceOrnamentation(group) {
    const ornamentGroup = new THREE.Group();
    
    // Material for the surface ornamentation
    const material = new THREE.MeshStandardMaterial({
        color: 0xdde8d0,
        roughness: 0.7
    });
    
    // Create several small bumps on the vesicle surface
    // Use instanced mesh for better performance
    const granuleGeometry = new THREE.SphereGeometry(0.02, 4, 3); // Very low poly
    
    const numGranules = 120; // Reasonable number for good coverage
    const instancedMesh = new THREE.InstancedMesh(granuleGeometry, material, numGranules);
    
    const dummy = new THREE.Object3D();
    const radius = 0.7; // Should match vesicle radius
    
    for (let i = 0; i < numGranules; i++) {
        // Use fibonacci distribution for even spacing on sphere
        const phi = Math.acos(-1 + (2 * i) / numGranules);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Avoid positions where processes are (every ~8th position)
        if (i % 8 === 0) continue;
        
        // Calculate position on vesicle surface and add tiny offset outward
        const normalizedPos = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        );
        
        const position = normalizedPos.clone().multiplyScalar(radius + 0.01);
        
        dummy.position.copy(position);
        
        // Look along normal for proper orientation
        dummy.lookAt(0, 0, 0);
        
        // Add slight random scaling for natural appearance
        const scale = 0.7 + Math.random() * 0.6;
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    
    ornamentGroup.add(instancedMesh);
    group.add(ornamentGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'surfaceOrnamentation',
        displayName: 'Surface Ornamentation',
        group: ornamentGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Surface Ornamentation', new THREE.Vector3(-0.5, 0.9, 0.3), component);
    }
    
    return ornamentGroup;
}

// Return information about acritarchs
export function getAcritarchInfo() {
    return `
        <h3>Acritarch</h3>
        <p>Acritarchs are organic-walled microfossils of uncertain biological affinity, first appearing in the Proterozoic (~1.8 billion years ago). The term "acritarch" (from Greek: akritos = uncertain, arche = origin) reflects their enigmatic nature, though most are now considered to be cysts of extinct marine algae or protists.</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Vesicle:</strong> Central body (5-150μm) composed of acid-resistant organic compounds similar to sporopollenin or dinosporin</li>
            <li><strong>Processes:</strong> Spine-like projections in various arrangements (concentric, polar, scattered) that can be solid or hollow</li>
            <li><strong>Excystment Opening:</strong> Many forms possess an operculum or pylome that could open to release cellular contents</li>
            <li><strong>Wall Ultrastructure:</strong> Single or multi-layered wall (0.1-2μm thick) with various surface textures (psilate, granulate, echinate)</li>
            <li><strong>Preservation:</strong> Typically preserved as compressed carbonaceous films in shales or as three-dimensional structures in cherts</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Acritarchs experienced a dramatic biodiversification during the Cambrian explosion (~541 MYA), making them valuable index fossils for Paleozoic marine strata. Their morphological changes mark key geological boundaries, especially in the late Proterozoic and early Paleozoic. Their widespread distribution in marine sediments makes them crucial for correlating strata across different paleocontinental blocks. A major extinction of complex acritarch taxa occurred during the Late Devonian crisis (~372 MYA).</p>
        
        <h4>Taxonomy & Classification:</h4>
        <p>Acritarchs are not a natural taxonomic group but represent a polyphyletic assemblage. Many are now classified as:
        Domain: Eukaryota | Kingdom: Uncertain (possibly Chromista) | Informal groupings include: Acanthomorphs, Sphaeromorphs, Polygonomorphs</p>
        
        <p><em>Data sourced from the Paleobiology Database and CHRONOS Acritarch Database</em></p>
    `;
} 