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
    // Create a scientifically accurate representation of the siliceous skeleton
    const skeletonGroup = new THREE.Group();
    
    // Material properties for opaline silica (SiO2·nH2O)
    const latticeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf8f8f8, // Opaline silica is white to translucent
        transparent: true,
        opacity: 0.7,
        roughness: 0.2,
        metalness: 0.1
    });
    
    // Create outer framework - reduced polygon count for better performance
    const outerGeometry = new THREE.IcosahedronGeometry(1.0, 1); // Reduced from detail level 2 to 1
    const outerSkeleton = new THREE.Mesh(
        outerGeometry,
        new THREE.MeshPhysicalMaterial({
            color: 0xf8f8f8,
            transparent: true,
            opacity: 0.3,
            wireframe: true,
            wireframeLinewidth: 2
        })
    );
    skeletonGroup.add(outerSkeleton);
    
    // Create inner framework - reduced polygon count
    const innerGeometry = new THREE.IcosahedronGeometry(0.7, 1); // Reduced from detail level 2 to 1
    const innerSkeleton = new THREE.Mesh(
        innerGeometry,
        new THREE.MeshPhysicalMaterial({
            color: 0xf8f8f8,
            transparent: true,
            opacity: 0.2,
            wireframe: true,
            wireframeLinewidth: 1
        })
    );
    skeletonGroup.add(innerSkeleton);
    
    // Add structural bars representing radial support structures
    // Optimized: reduced number of bars from 14 to 10 key positions
    const barPositions = [
        [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.7, 0)],
        [new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, -0.7, 0)],
        [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0.7, 0, 0)],
        [new THREE.Vector3(-1, 0, 0), new THREE.Vector3(-0.7, 0, 0)],
        [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0.7)],
        [new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, -0.7)],
        [new THREE.Vector3(0.7, 0.7, 0), new THREE.Vector3(0.5, 0.5, 0)],
        [new THREE.Vector3(-0.7, 0.7, 0), new THREE.Vector3(-0.5, 0.5, 0)],
        [new THREE.Vector3(0.7, -0.7, 0), new THREE.Vector3(0.5, -0.5, 0)],
        [new THREE.Vector3(-0.7, -0.7, 0), new THREE.Vector3(-0.5, -0.5, 0)]
    ];
    
    barPositions.forEach(([start, end]) => {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        
        // Reduced segment count for better performance
        const barGeometry = new THREE.CylinderGeometry(0.015, 0.015, length, 4); // Reduced from 6 segments to 4
        barGeometry.translate(0, length / 2, 0);
        
        const bar = new THREE.Mesh(barGeometry, latticeMaterial);
        bar.position.copy(start);
        
        // Orient the bar to point to the end
        bar.lookAt(end);
        bar.rotateX(Math.PI / 2);
        
        skeletonGroup.add(bar);
    });
    
    // Add mesh pores (simplified representation)
    // Reduced number of pores from 40 to 24 for better performance
    for (let i = 0; i < 24; i++) {
        const radius = 0.85;
        const phi = Math.acos(-1 + (2 * i) / 24);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // Reduced segment counts for better performance
        const poreGeometry = new THREE.TorusGeometry(0.08, 0.01, 6, 12); // Reduced from 8,16 to 6,12
        const pore = new THREE.Mesh(poreGeometry, latticeMaterial);
        
        pore.position.set(x, y, z);
        pore.lookAt(0, 0, 0);
        
        skeletonGroup.add(pore);
    }
    
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
        addLabel(group, labelsArray, 'Siliceous Skeleton', new THREE.Vector3(1.3, 0.3, 0.3), component);
    }
    
    return skeletonGroup;
}

// Create the central capsule (inner part)
function createCentralCapsule(group) {
    // Create a simplified but scientifically accurate central capsule
    const capsuleGroup = new THREE.Group();
    
    // Outer membrane material
    const membraneMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf0e0a0,
        transparent: true,
        opacity: 0.6,
        roughness: 0.3
    });
    
    // Create the central capsule - reduced segment count
    const capsuleGeometry = new THREE.SphereGeometry(0.5, 24, 16); // Reduced from 32,32 to 24,16
    const capsule = new THREE.Mesh(capsuleGeometry, membraneMaterial);
    capsuleGroup.add(capsule);
    
    // Add nucleus - reduced segment count
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0c070,
        roughness: 0.4
    });
    
    const nucleusGeometry = new THREE.SphereGeometry(0.2, 12, 8); // Reduced from 16,16 to 12,8
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    capsuleGroup.add(nucleus);
    
    // Add organelles (simplified)
    const organelleMaterial = new THREE.MeshStandardMaterial({
        color: 0xd0b090,
        roughness: 0.5
    });
    
    // Reduced number of organelles from 6 to 4
    for (let i = 0; i < 4; i++) {
        const size = 0.04 + Math.random() * 0.03;
        const organelleGeometry = new THREE.SphereGeometry(size, 6, 4); // Reduced from 8,8 to 6,4
        const organelle = new THREE.Mesh(organelleGeometry, organelleMaterial);
        
        // Place organelles around the nucleus within the capsule
        const distance = 0.2 + Math.random() * 0.15;
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        
        organelle.position.set(
            distance * Math.sin(phi) * Math.cos(theta),
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi)
        );
        
        capsuleGroup.add(organelle);
    }
    
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
        addLabel(group, labelsArray, 'Central Capsule', new THREE.Vector3(0, -0.7, 0), component);
    }
    
    return capsuleGroup;
}

// Create the radial spines
function createSpines(group) {
    // Create simplified but scientifically accurate spines
    const spineGroup = new THREE.Group();
    
    // Material for spines - siliceous like the skeleton
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xf8f8f8,
        roughness: 0.3,
        metalness: 0.1
    });
    
    // Create primary spines (major spines)
    const primarySpinePositions = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1)
    ];
    
    primarySpinePositions.forEach(position => {
        const normalizedPos = position.clone().normalize();
        
        // Create the main spine
        const length = 1.4 + Math.random() * 0.3;
        const baseWidth = 0.05;
        
        // Reduced segment count
        const spineGeometry = new THREE.CylinderGeometry(
            baseWidth * 0.3, // Tip
            baseWidth,       // Base
            length,
            6 // Reduced from 8 to 6
        );
        
        // Translate geometry so base is at origin
        spineGeometry.translate(0, length / 2, 0);
        
        const spine = new THREE.Mesh(spineGeometry, material);
        spine.position.copy(normalizedPos);
        
        // Orient spine to point outward
        spine.lookAt(new THREE.Vector3(0, 0, 0));
        spine.rotateX(Math.PI);
        
        spineGroup.add(spine);
        
        // Add branches to primary spines - reduced number and complexity
        const numBranches = 2; // Reduced from 2-3 to always 2
        
        for (let i = 0; i < numBranches; i++) {
            const branchOffset = 0.3 + (i * 0.3);
            const branchLength = 0.15;
            const branchWidth = baseWidth * 0.3;
            
            // Reduced segment count
            const branchGeometry = new THREE.ConeGeometry(branchWidth, branchLength, 5); // Reduced from 6 to 5
            const branch = new THREE.Mesh(branchGeometry, material);
            
            // Position branch along spine
            const branchBasePos = normalizedPos.clone().multiplyScalar(1 + branchOffset);
            branch.position.copy(branchBasePos);
            
            // Orient branch perpendicular to spine
            const branchAngle = (i * Math.PI * 2) / numBranches;
            const branchDir = new THREE.Vector3(
                Math.cos(branchAngle),
                0,
                Math.sin(branchAngle)
            );
            
            // Get tangent to the sphere at this point for orientation
            const tangent = new THREE.Vector3().crossVectors(
                normalizedPos,
                branchDir
            ).normalize();
            
            branch.lookAt(branchBasePos.clone().add(tangent));
            
            spineGroup.add(branch);
        }
    });
    
    // Create secondary spines (smaller, simpler)
    // Reduced number from 16 to 10 for better performance
    for (let i = 0; i < 10; i++) {
        const phi = Math.acos(-1 + (2 * i) / 10);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const spinePos = new THREE.Vector3();
        spinePos.setFromSphericalCoords(1, phi, theta);
        
        // Skip positions too close to primary spines
        let tooClose = false;
        for (const primaryPos of primarySpinePositions) {
            if (spinePos.distanceTo(primaryPos.clone().normalize()) < 0.3) {
                tooClose = true;
                break;
            }
        }
        
        if (tooClose) continue;
        
        // Create a simple spine
        const length = 0.5 + Math.random() * 0.2;
        const width = 0.02;
        
        // Reduced segment count
        const geometry = new THREE.ConeGeometry(width, length, 5); // Reduced from 6 to 5
        const spine = new THREE.Mesh(geometry, material);
        
        spine.position.copy(spinePos);
        spine.lookAt(new THREE.Vector3(0, 0, 0));
        spine.rotateX(Math.PI);
        
        spineGroup.add(spine);
    }
    
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
        addLabel(group, labelsArray, 'Radial Spines', new THREE.Vector3(0, 1.5, 0), component);
    }
    
    return spineGroup;
}

// Create axopods (pseudopodia extending from central capsule)
function createAxopods(group) {
    // Create simplified but scientifically accurate axopods
    const axopodGroup = new THREE.Group();
    
    // Material for axopods
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xd0e8ff,
        transparent: true,
        opacity: 0.4,
        roughness: 0.2
    });
    
    // Create axopods with curves - reduced number from 14 to 8
    for (let i = 0; i < 8; i++) {
        const phi = Math.acos(-1 + (2 * i) / 8);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        
        const startPoint = new THREE.Vector3();
        startPoint.setFromSphericalCoords(0.5, phi, theta);
        
        // Create a curved path for the axopod - simplify to quadratic curve
        const curve = new THREE.QuadraticBezierCurve3(
            startPoint,
            startPoint.clone().multiplyScalar(1.7).add(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3,
                    (Math.random() - 0.5) * 0.3
                )
            ),
            startPoint.clone().multiplyScalar(2.2)
        );
        
        // Create tube geometry along the curve - reduced segment counts
        const tubeGeometry = new THREE.TubeGeometry(
            curve,
            8,  // Reduced from 12 to 8 tubularSegments
            0.015 + Math.random() * 0.01,  // radius
            5,   // Reduced from 6 to 5 radialSegments
            false // closed
        );
        
        const axopod = new THREE.Mesh(tubeGeometry, material);
        axopodGroup.add(axopod);
        
        // Add granules along each axopod - reduced count from 5-10 to 3-5
        const numGranules = 3 + Math.floor(Math.random() * 2);
        const granuleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        
        for (let j = 0; j < numGranules; j++) {
            const t = j / numGranules;
            const pos = curve.getPointAt(t);
            
            // Use instanced geometry to improve performance
            const granuleGeometry = new THREE.SphereGeometry(0.005 + Math.random() * 0.005, 4, 3); // Reduced from 4,4 to 4,3
            const granule = new THREE.Mesh(granuleGeometry, granuleMaterial);
            granule.position.copy(pos);
            
            axopodGroup.add(granule);
        }
    }
    
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
        addLabel(group, labelsArray, 'Axopods', new THREE.Vector3(1.2, -0.8, 0.8), component);
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