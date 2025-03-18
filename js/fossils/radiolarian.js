import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return a radiolarian fossil model
export function createRadiolarianModel(scene) {
    // Create a group to hold all components
    const radGroup = new THREE.Group();
    radGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Add components to the model
    createSiliceousSkeleton(radGroup);
    createCentralCapsule(radGroup);
    createSpines(radGroup);
    createAxopods(radGroup);

    return radGroup;
}

// Create the siliceous skeleton
function createSiliceousSkeleton(group) {
    // Create a scientifically accurate but lighter representation of the siliceous skeleton
    const skeletonGroup = new THREE.Group();
    
    // Material properties for opaline silica - adjusted for better visibility
    const latticeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xCCDDEE, // Light blue-gray color for better visibility
        transparent: true,
        opacity: 0.9, // Increased opacity
        roughness: 0.2,
        metalness: 0.2 // Slight increase in metalness for highlight reflection
    });
    
    // Create a simplified but recognizable lattice structure
    // Use a wireframe icosahedron with visible lines for the main structure
    const outerGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const outerSkeleton = new THREE.Mesh(
        outerGeometry,
        new THREE.MeshBasicMaterial({
            color: 0xB0C4DE, // Light steel blue for better visibility
            transparent: true,
            opacity: 0.9, // Increased opacity
            wireframe: true,
            wireframeLinewidth: 2
        })
    );
    skeletonGroup.add(outerSkeleton);
    
    // Create inner framework with better visibility
    const innerGeometry = new THREE.IcosahedronGeometry(0.6, 1);
    const innerSkeleton = new THREE.Mesh(
        innerGeometry,
        new THREE.MeshBasicMaterial({
            color: 0xA0B8D0, // Slightly darker blue for contrast
            transparent: true,
            opacity: 0.7,
            wireframe: true,
            wireframeLinewidth: 1
        })
    );
    skeletonGroup.add(innerSkeleton);
    
    // Add a few key structural bars for visual interest instead of full lattice
    // Use just 12 strategic bars representing main structural elements
    const keyPositions = [
        [0, 1, 0],
        [0, -1, 0],
        [1, 0, 0],
        [-1, 0, 0],
        [0, 0, 1],
        [0, 0, -1]
    ];
    
    keyPositions.forEach(pos => {
        const normalizedPos = new THREE.Vector3(pos[0], pos[1], pos[2]).normalize();
        const outerPoint = normalizedPos.clone().multiplyScalar(0.8);
        const innerPoint = normalizedPos.clone().multiplyScalar(0.6);
        
        // Create a connecting bar between layers
        const direction = new THREE.Vector3().subVectors(outerPoint, innerPoint);
        const length = direction.length();
        
        const barGeometry = new THREE.CylinderGeometry(0.025, 0.025, length, 6, 1); // Slightly thicker
        const bar = new THREE.Mesh(barGeometry, latticeMaterial);
        
        // Position at midpoint
        bar.position.copy(innerPoint).add(outerPoint).multiplyScalar(0.5);
        
        // Orient correctly
        bar.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );
        
        skeletonGroup.add(bar);
    });
    
    group.add(skeletonGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'skeleton',
        displayName: 'Siliceous Skeleton',
        group: skeletonGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Siliceous Skeleton', new THREE.Vector3(1.0, 0.5, 0), component);
    }
    
    return skeletonGroup;
}

// Create central capsule
function createCentralCapsule(group) {
    // Create a lighter but still accurate central capsule
    const capsuleGroup = new THREE.Group();
    
    // Outer membrane material - golden-yellow as shown in the reference image
    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xd4c170, // Golden color to match reference
        transparent: true,
        opacity: 0.7,
        roughness: 0.3
    });
    
    // Create the central capsule with fewer segments
    const capsuleGeometry = new THREE.SphereGeometry(0.4, 16, 12); // Reduced geometry
    const capsule = new THREE.Mesh(capsuleGeometry, membraneMaterial);
    capsuleGroup.add(capsule);
    
    // Add nucleus with fewer segments
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8c080,
        roughness: 0.4
    });
    
    const nucleusGeometry = new THREE.SphereGeometry(0.2, 8, 6); // Significantly reduced
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    capsuleGroup.add(nucleus);
    
    group.add(capsuleGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'capsule',
        displayName: 'Central Capsule',
        group: capsuleGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Central Capsule', new THREE.Vector3(0.2, -0.6, 0.2), component);
    }
    
    return capsuleGroup;
}

// Create spines
function createSpines(group) {
    // Create scientifically accurate but optimized radial spines
    const spineGroup = new THREE.Group();
    
    // Material for spines - siliceous like the skeleton
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xf8f8f8,
        roughness: 0.3,
        metalness: 0.1
    });
    
    // Use fewer spines for better performance
    const primarySpinePositions = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
        // Just a few diagonal spines
        new THREE.Vector3(0.7, 0.7, 0),
        new THREE.Vector3(-0.7, -0.7, 0),
        new THREE.Vector3(0, 0.7, -0.7)
    ];
    
    // Create an instanced mesh for better performance
        const spineGeometry = new THREE.CylinderGeometry(
            0.01, // Tip width
        0.05, // Base width
        1.8,  // Length
        5,    // Even fewer radial segments
        1     // Height segments
    );
    
    const instancedSpines = new THREE.InstancedMesh(
        spineGeometry,
        material,
        primarySpinePositions.length
    );
    
    const dummy = new THREE.Object3D();
    
    primarySpinePositions.forEach((position, index) => {
        const normalizedPos = position.clone().normalize();
        
        // Position with base at the skeleton surface (0.8 radius) and extending outward
        const surfacePoint = normalizedPos.clone().multiplyScalar(0.8);
        dummy.position.copy(surfacePoint);
        
        // Align spine to point outward
        dummy.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            normalizedPos
        );
        
        // Move the spine so that it extends outward from the surface
        dummy.translateY(1.8 / 2);
        
        dummy.updateMatrix();
        instancedSpines.setMatrixAt(index, dummy.matrix);
    });
    
    spineGroup.add(instancedSpines);
    group.add(spineGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'spines',
        displayName: 'Radial Spines',
        group: spineGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Radial Spines', new THREE.Vector3(0, 1.8, 0), component);
    }
    
    return spineGroup;
}

// Create axopods (extensions)
function createAxopods(group) {
    // Create lightweight axopods
    const axopodGroup = new THREE.Group();
    
    // Material for axopods
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xd0e8ff,
        transparent: true,
        opacity: 0.5,
        roughness: 0.2
    });
    
    // Significantly reduce the number of axopods
    const numAxopods = 6; // Much fewer
    
    // Use simpler geometry and instancing for better performance
    const axopodGeometry = new THREE.CylinderGeometry(0.01, 0.015, 0.8, 4, 1);
    const instancedAxopods = new THREE.InstancedMesh(
        axopodGeometry, 
        material,
        numAxopods
    );
    
    const dummy = new THREE.Object3D();
    
    // Create evenly spaced axopods
    for (let i = 0; i < numAxopods; i++) {
        const phi = Math.acos(-1 + (2 * i) / numAxopods);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        // Direction vector from center
        const direction = new THREE.Vector3();
        direction.setFromSphericalCoords(1, phi, theta);
        
        // Position starting at central capsule going outward
        const startPoint = direction.clone().multiplyScalar(0.4);
        dummy.position.copy(startPoint);
        
        // Orient along the radial direction
        dummy.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction
        );
        
        // Move outward along axis
        dummy.translateY(0.4);
        
        dummy.updateMatrix();
        instancedAxopods.setMatrixAt(i, dummy.matrix);
    }
    
    axopodGroup.add(instancedAxopods);
    group.add(axopodGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'axopods',
        displayName: 'Axopods',
        group: axopodGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Axopods', new THREE.Vector3(1.0, -0.3, 0.8), component);
    }
    
    return axopodGroup;
}

// Update the information section with scientifically accurate descriptions
export function getRadiolarianInfo() {
    return `
        <h3>Radiolarian</h3>
        <p>Radiolarians are single-celled marine protists belonging to the supergroup Rhizaria, with a fossil record extending back to the early Cambrian (approximately 541 MYA). These planktonic organisms are characterized by their intricate mineral skeletons and complex cellular organization.</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Skeleton:</strong> Siliceous (opaline silica, SiO₂·nH₂O) with geometric, lattice-like structures formed according to precise radial symmetry laws (Müller's law)</li>
            <li><strong>Central Capsule:</strong> Perforated membranous structure dividing the cell into endo- and ectoplasm, containing the nucleus (often 1 in Spumellaria, multiple in Nassellaria)</li>
            <li><strong>Radial Spines:</strong> Primary (radial beams) and secondary spines that provide structural support and buoyancy; up to 20 primary spines in many species</li>
            <li><strong>Axopods:</strong> Thin pseudopodia reinforced by axial microtubules, extending 100-500μm, used for prey capture and buoyancy</li>
            <li><strong>Size:</strong> 30-300 micrometers (0.03-0.3mm), with some species reaching 1-2mm</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Radiolarian fossils form siliceous deposits (radiolarites) in deep marine settings. Their rapid evolution makes them valuable biostratigraphic markers, especially for Mesozoic and Cenozoic marine strata. The Permian-Triassic boundary (~252 MYA) is marked by a major radiolarian extinction event, with over 95% of species disappearing.</p>
        
        <h4>Taxonomy & Classification:</h4>
        <p>Domain: Eukaryota | Kingdom: Rhizaria | Phylum: Retaria | Class: Polycystinea | Orders: Spumellaria, Nassellaria, Collodaria</p>
        
        <p><em>Data sourced from the Radiolarian Database of Benson and the Mesozoic Planktonic Microfossil Database</em></p>
    `;
} 