import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return a foraminifera fossil model
export function createForaminiferaModel(scene) {
    // Create a group to hold all components
    const foramGroup = new THREE.Group();
    foramGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Add components to the model
    createTest(foramGroup);
    createChambers(foramGroup);
    createAperture(foramGroup);
    createPseudopodia(foramGroup);
    createSymbioticAlgae(foramGroup);
    createPoreSystem(foramGroup);

    return foramGroup;
}

// Create the test (shell)
function createTest(group) {
    // Create a spiral arrangement of chambers for the test
    const testGroup = new THREE.Group();
    
    // Material for the test shell
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xf5f5dc, // Beige color
        transparent: true,
        opacity: 0.8,
        roughness: 0.3,
        metalness: 0.1
    });
    
    // Create outer surface of the test - reduced segments
    const geometry = new THREE.SphereGeometry(1.05, 24, 16); // Reduced from 32, 24
    geometry.scale(1, 0.6, 1);
    
    const testSurface = new THREE.Mesh(geometry, material);
    testGroup.add(testSurface);
    
    group.add(testGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'test',
        displayName: 'Test (Shell)',
        group: testGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Test (Shell)', new THREE.Vector3(0, 1, 0), component);
    }
    
    return testGroup;
}

// Create chambers
function createChambers(group) {
    const chamberGroup = new THREE.Group();
    
    // Material for the chambers
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xe0d8c0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2
    });
    
    // Create a spiral arrangement of chambers - same number but reduced segments
    const numChambers = 8; 
    const startRadius = 0.3;
    const growthRate = 0.12;
    const rotationIncrement = Math.PI * 0.6;
    
    for (let i = 0; i < numChambers; i++) {
        const angle = i * rotationIncrement;
        const radius = startRadius + (i * growthRate);
        const size = 0.2 + (i * 0.05);
        
        // Create chamber geometry with reduced segments
        const geometry = new THREE.SphereGeometry(size, 12, 8); // Reduced from 16, 12
        const chamber = new THREE.Mesh(geometry, material);
        
        // Position the chamber in a spiral
        chamber.position.x = radius * Math.cos(angle);
        chamber.position.z = radius * Math.sin(angle);
        chamber.position.y = 0;
        
        chamberGroup.add(chamber);
    }
    
    group.add(chamberGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'chambers',
        displayName: 'Chambers',
        group: chamberGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Chambers', new THREE.Vector3(-0.5, 0, 0.5), component);
    }
    
    return chamberGroup;
}

// Create aperture (opening)
function createAperture(group) {
    // Create aperture geometry with reduced segments
    const geometry = new THREE.TorusGeometry(0.15, 0.05, 12, 18); // Reduced from 16, 24
    
    // Apply material
    const material = new THREE.MeshStandardMaterial({
        color: 0x505050,
        side: THREE.DoubleSide
    });
    
    // Create mesh and add to group
    const aperture = new THREE.Mesh(geometry, material);
    aperture.position.set(0.85, 0, 0);
    aperture.rotation.y = Math.PI / 2;
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
        addLabel(group, labelsArray, 'Aperture', new THREE.Vector3(1.1, 0.3, 0), component);
    }
    
    return aperture;
}

// Create pseudopodia (temporary extensions)
function createPseudopodia(group) {
    const pseudopodiaGroup = new THREE.Group();
    
    // Material for pseudopodia
    const material = new THREE.MeshStandardMaterial({
        color: 0xd0e0f0,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1
    });
    
    // Create several pseudopodia extending from the aperture - reduced count
    const numPseudopodia = 5; // Reduced from 7
    const baseX = 0.9;
    
    for (let i = 0; i < numPseudopodia; i++) {
        // Create a curved path for each pseudopodium
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(baseX, 0, 0),
            new THREE.Vector3(baseX + 0.3, 0.1 + (i * 0.05), 0.1),
            new THREE.Vector3(baseX + 0.6, 0.2 - (i * 0.04), 0.2),
            new THREE.Vector3(baseX + 0.9, (i - numPseudopodia/2) * 0.1, (i - numPseudopodia/2) * 0.1)
        );
        
        // Reduced tubular segments and radial segments
        const tubeGeometry = new THREE.TubeGeometry(curve, 16, 0.02, 6, false); // Reduced from 20, 8
        const pseudopod = new THREE.Mesh(tubeGeometry, material);
        
        pseudopodiaGroup.add(pseudopod);
    }
    
    group.add(pseudopodiaGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'pseudopodia',
        displayName: 'Pseudopodia',
        group: pseudopodiaGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Pseudopodia', new THREE.Vector3(1.6, 0.5, 0.3), component);
    }
    
    return pseudopodiaGroup;
}

// New function to create symbiotic algae (dinoflagellates)
function createSymbioticAlgae(group) {
    const algaeGroup = new THREE.Group();
    
    // Material for algae with golden-brown color (dinoflagellate color)
    const material = new THREE.MeshStandardMaterial({
        color: 0xd4a76a,
        transparent: true,
        opacity: 0.7,
        roughness: 0.3
    });
    
    // Create several small algae cells distributed mainly in the chambers
    const numAlgae = 12; // Small number to keep lightweight
    
    // Create a single geometry to be reused
    const algaeGeometry = new THREE.SphereGeometry(0.05, 6, 4); // Very low poly count
    
    for (let i = 0; i < numAlgae; i++) {
        // Calculate algae positions - mostly in outer chambers of the spiral
        const angle = (i / numAlgae) * Math.PI * 2;
        const radius = 0.3 + (i % 5) * 0.12;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = (Math.random() - 0.5) * 0.3;
        
        const algaeCell = new THREE.Mesh(algaeGeometry, material);
        algaeCell.position.set(x, y, z);
        
        // Add slight random scale variation
        const scale = 0.8 + Math.random() * 0.4;
        algaeCell.scale.set(scale, scale, scale);
        
        algaeGroup.add(algaeCell);
    }
    
    group.add(algaeGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'symbiotic_algae',
        displayName: 'Symbiotic Algae',
        group: algaeGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Symbiotic Algae', new THREE.Vector3(0.5, 0.2, 0.5), component);
    }
    
    return algaeGroup;
}

// New function to create pore system
function createPoreSystem(group) {
    const poreGroup = new THREE.Group();
    
    // Material for pores
    const material = new THREE.MeshBasicMaterial({
        color: 0x404040,
        side: THREE.DoubleSide
    });
    
    // Use instanced mesh for better performance
    const poreGeometry = new THREE.CircleGeometry(0.01, 4); // Extremely low poly
    const poreMesh = new THREE.InstancedMesh(poreGeometry, material, 50); // Limit to 50 pores
    
    const dummy = new THREE.Object3D();
    
    // Create pores on surface of test with Fibonacci distribution for even spacing
    for (let i = 0; i < 50; i++) {
        const phi = Math.acos(-1 + (2 * i) / 50);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Calculate position on surface of the test
        const x = 1.05 * Math.sin(phi) * Math.cos(theta);
        const y = 0.65 * Math.cos(phi); // Adjusted for the flattened sphere shape
        const z = 1.05 * Math.sin(phi) * Math.sin(theta);
        
        dummy.position.set(x, y, z);
        
        // Orient normal to surface
        dummy.lookAt(0, 0, 0);
        
        dummy.updateMatrix();
        poreMesh.setMatrixAt(i, dummy.matrix);
    }
    
    poreGroup.add(poreMesh);
    group.add(poreGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'pore_system',
        displayName: 'Pore System',
        group: poreGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Pore System', new THREE.Vector3(0, -0.8, 0.5), component);
    }
    
    return poreGroup;
}

// Return information about foraminifera
export function getForaminiferaInfo() {
    return `
        <h3>Foraminifera</h3>
        <p>Foraminifera (forams) are marine protists belonging to the Order Foraminiferida (phylum Retaria). These single-celled organisms have existed since the Cambrian period (541 MYA) and remain abundant in modern oceans.</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Test (Shell):</strong> Composed of calcium carbonate (CaCO₃) in the form of calcite or aragonite, or agglutinated sediment particles</li>
            <li><strong>Chambers:</strong> Arranged in various patterns (planispiral, trochospiral, biserial, uniserial) with up to 3-5 chambers per whorl in many species</li>
            <li><strong>Aperture:</strong> Primary opening in the final chamber, allowing communication with the environment</li>
            <li><strong>Pseudopodia:</strong> Granuloreticulose extensions of cytoplasm used for locomotion, feeding, and test formation</li>
            <li><strong>Size:</strong> 100μm-1mm (benthic forms), with some planktonic species reaching 20mm</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Foraminifera are abundant in the fossil record and serve as valuable biostratigraphic markers. The ratio of stable oxygen isotopes (¹⁸O/¹⁶O) in their calcite tests provides a record of past ocean temperatures and global ice volume. The extinction patterns of large foraminifera mark major boundaries in the Cenozoic Era.</p>
        
        <h4>Taxonomy & Classification:</h4>
        <p>Domain: Eukaryota | Kingdom: Rhizaria | Phylum: Retaria | Class: Foraminifera | Order: Foraminiferida</p>
        
        <p><em>Data sourced from the World Foraminifera Database and Ocean Micropaleontology Database</em></p>
    `;
} 