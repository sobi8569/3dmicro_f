import * as THREE from 'three';
import { addLabel } from '../labelUtils.js';

// Create and return a conodont fossil model
export function createConodontModel(scene) {
    // Create a group to hold all components
    const conodontGroup = new THREE.Group();
    conodontGroup.userData = {
        components: [] // Will store all components for UI controls
    };

    // Add components to the model
    createElementBody(conodontGroup);
    createDenticles(conodontGroup);
    createCusp(conodontGroup);
    createBasalCavity(conodontGroup);
    createGrowthLines(conodontGroup);

    return conodontGroup;
}

// Create the main body of the conodont element
function createElementBody(group) {
    // Create a curved path for the conodont element body
    const points = [];
    const length = 2;
    const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-length/2, 0, 0),
        new THREE.Vector3(-length/4, 0.1, 0),
        new THREE.Vector3(length/4, -0.1, 0),
        new THREE.Vector3(length/2, 0, 0)
    );

    // Sample points along the curve - reduced number of points
    const numPoints = 40; // Reduced from 50
    const curvePoints = curve.getPoints(numPoints);
    
    // Create geometry along the curve
    const bodyGeometry = new THREE.BufferGeometry();
    const positions = [];
    const indices = [];
    const normals = [];
    
    // Create a blade-like structure
    for (let i = 0; i < curvePoints.length; i++) {
        const point = curvePoints[i];
        const width = 0.1 * (1 - Math.abs(i / numPoints - 0.5) * 1.5); // Narrower at ends
        const height = 0.4 * Math.sin(Math.PI * i / numPoints); // Taller in middle
        
        // Add top and bottom vertices
        positions.push(point.x, point.y + height, point.z + width/2);
        positions.push(point.x, point.y + height, point.z - width/2);
        positions.push(point.x, point.y, point.z + width/2);
        positions.push(point.x, point.y, point.z - width/2);
        
        // Add faces (two triangles make a quad)
        if (i < curvePoints.length - 1) {
            const vertexOffset = i * 4;
            // Top face
            indices.push(vertexOffset, vertexOffset + 4, vertexOffset + 1);
            indices.push(vertexOffset + 1, vertexOffset + 4, vertexOffset + 5);
            // Side face 1
            indices.push(vertexOffset, vertexOffset + 2, vertexOffset + 4);
            indices.push(vertexOffset + 2, vertexOffset + 6, vertexOffset + 4);
            // Side face 2
            indices.push(vertexOffset + 1, vertexOffset + 5, vertexOffset + 3);
            indices.push(vertexOffset + 3, vertexOffset + 5, vertexOffset + 7);
            // Bottom face
            indices.push(vertexOffset + 2, vertexOffset + 3, vertexOffset + 6);
            indices.push(vertexOffset + 3, vertexOffset + 7, vertexOffset + 6);
        }
        
        // Simple normals (not accurate but functional)
        for (let j = 0; j < 4; j++) {
            normals.push(0, 1, 0);
        }
    }
    
    bodyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    bodyGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    bodyGeometry.setIndex(indices);
    
    // Material for the conodont element
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xd0c0a0,
        transparent: true,
        opacity: 0.9,
        roughness: 0.4,
        metalness: 0.1
    });
    
    const body = new THREE.Mesh(bodyGeometry, material);
    group.add(body);
    
    // Store component data for UI controls
    const component = {
        name: 'body',
        displayName: 'Element Body',
        mesh: body,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Element Body', new THREE.Vector3(0, 0.3, 0.3), component);
    }
    
    return body;
}

// Create denticles (small tooth-like projections)
function createDenticles(group) {
    const denticleGroup = new THREE.Group();
    
    // Material for denticles
    const material = new THREE.MeshStandardMaterial({
        color: 0xd8d0c0,
        roughness: 0.3
    });
    
    // Create several denticles along the upper edge - reduced count
    const numDenticles = 5; // Reduced from 7
    const spacing = 1.6 / (numDenticles + 1);
    const startX = -0.8 + spacing;
    
    for (let i = 0; i < numDenticles; i++) {
        const x = startX + i * spacing;
        const height = 0.1 + 0.05 * Math.sin(Math.PI * i / (numDenticles - 1));
        
        // Create denticle geometry (cone) - reduced segments
        const geometry = new THREE.ConeGeometry(0.03, height, 6); // Reduced from 8
        const denticle = new THREE.Mesh(geometry, material);
        
        // Position denticle
        denticle.position.set(x, 0.2, 0);
        denticle.rotation.z = -Math.PI / 6; // Slightly angled
        
        denticleGroup.add(denticle);
    }
    
    group.add(denticleGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'denticles',
        displayName: 'Denticles',
        group: denticleGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Denticles', new THREE.Vector3(0.4, 0.4, 0.3), component);
    }
    
    return denticleGroup;
}

// Create the main cusp (largest denticle)
function createCusp(group) {
    // Create cusp geometry - reduced segments
    const geometry = new THREE.ConeGeometry(0.06, 0.3, 6); // Reduced from 8
    
    // Apply material
    const material = new THREE.MeshStandardMaterial({
        color: 0xe0d8c8,
        roughness: 0.3
    });
    
    // Create mesh and add to group
    const cusp = new THREE.Mesh(geometry, material);
    cusp.position.set(-0.3, 0.3, 0); // Position near one end
    cusp.rotation.z = -Math.PI / 8; // Slightly angled
    group.add(cusp);
    
    // Add white matter to the cusp - new component
    createWhiteMatter(group, cusp);
    
    // Store component data for UI controls
    const component = {
        name: 'cusp',
        displayName: 'Main Cusp',
        mesh: cusp,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Main Cusp', new THREE.Vector3(-0.3, 0.6, 0.3), component);
    }
    
    return cusp;
}

// Create white matter (internal structure)
function createWhiteMatter(group, cusp) {
    // Create a slightly smaller cone for the white matter inside the cusp
    const geometry = new THREE.ConeGeometry(0.035, 0.2, 5); // Very low poly
    
    // White matter material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xf5f5f0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2
    });
    
    const whiteMatter = new THREE.Mesh(geometry, material);
    
    // Position white matter inside the cusp
    whiteMatter.position.copy(cusp.position);
    whiteMatter.position.y += 0.03; // Slightly higher in the cusp
    whiteMatter.rotation.copy(cusp.rotation);
    
    group.add(whiteMatter);
    
    // Store component data for UI controls
    const component = {
        name: 'whiteMatter',
        displayName: 'White Matter',
        mesh: whiteMatter,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'White Matter', new THREE.Vector3(-0.3, 0.45, 0.5), component);
    }
    
    return whiteMatter;
}

// Create basal cavity (attachment area)
function createBasalCavity(group) {
    // Create basal cavity geometry - simplified shape with fewer points
    const shape = new THREE.Shape();
    shape.moveTo(-0.6, 0);
    shape.bezierCurveTo(-0.4, -0.1, 0.4, -0.1, 0.6, 0);
    shape.bezierCurveTo(0.4, 0.05, -0.4, 0.05, -0.6, 0);
    
    const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false,
        steps: 1 // Reduced steps for extrusion
    };
    
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Apply material
    const material = new THREE.MeshStandardMaterial({
        color: 0x908880,
        side: THREE.DoubleSide
    });
    
    // Create mesh and add to group
    const basalCavity = new THREE.Mesh(geometry, material);
    basalCavity.position.set(0, -0.05, -0.05);
    basalCavity.rotation.x = Math.PI / 2;
    group.add(basalCavity);
    
    // Store component data for UI controls
    const component = {
        name: 'basalCavity',
        displayName: 'Basal Cavity',
        mesh: basalCavity,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Basal Cavity', new THREE.Vector3(0, -0.2, 0.3), component);
    }
    
    return basalCavity;
}

// Add growth lines to the conodont element - new function
function createGrowthLines(group) {
    const growthLinesGroup = new THREE.Group();
    
    // Material for growth lines
    const material = new THREE.MeshBasicMaterial({
        color: 0x605040,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    
    // Create growth lines on the element body
    const numLines = 6; // Keep low for performance
    
    for (let i = 0; i < numLines; i++) {
        // Create a thin ring to represent a growth line
        const radius = 0.06 + (i * 0.01);
        const height = 0.005;
        const position = -0.8 + (i * 0.25);
        
        // Use low-poly ring for better performance
        const ringGeometry = new THREE.TorusGeometry(radius, height, 4, 8);
        const ring = new THREE.Mesh(ringGeometry, material);
        
        ring.position.set(position, 0.1, 0);
        ring.rotation.y = Math.PI / 2;
        
        growthLinesGroup.add(ring);
    }
    
    group.add(growthLinesGroup);
    
    // Store component data for UI controls
    const component = {
        name: 'growthLines',
        displayName: 'Growth Lines',
        group: growthLinesGroup,
        visible: true
    };
    
    group.userData.components.push(component);
    
    // Add label
    if (typeof addLabel === 'function') {
        const labelsArray = window.labels || [];
        addLabel(group, labelsArray, 'Growth Lines', new THREE.Vector3(0.2, 0.2, 0.5), component);
    }
    
    return growthLinesGroup;
}

// Return information about conodonts
export function getConodontInfo() {
    return `
        <h3>Conodont</h3>
        <p>Conodonts were early vertebrates that existed from the late Cambrian to the end of the Triassic (~500-200 MYA). Though the soft-bodied animal (conodont animal) was rarely preserved, their tooth-like elements composed of calcium phosphate are abundant microfossils.</p>
        
        <h4>Key Features:</h4>
        <ul>
            <li><strong>Element Body:</strong> Composed of calcium phosphate (apatite: Ca₅(PO₄)₃(OH,F,Cl)) with a distinctive white matter core in advanced forms</li>
            <li><strong>Denticles:</strong> Tooth-like projections with growth lamellae of 2-5μm thickness, revealing incremental formation</li>
            <li><strong>Main Cusp:</strong> The largest denticle, often with internal growth lines and a basal cavity</li>
            <li><strong>Apparatus:</strong> Complete conodont apparatus typically contains 15-19 elements organized in a bilateral arrangement</li>
            <li><strong>Preservation:</strong> Conodont elements change color progressively with heating (Conodont Alteration Index: CAI 1-5)</li>
        </ul>
        
        <h4>Geological Significance:</h4>
        <p>Conodonts are among the most important index fossils for Paleozoic and Triassic rocks due to their rapid evolution and widespread distribution. The Conodont Alteration Index (CAI) serves as a geothermometer, indicating the thermal maturity of host rocks - crucial information for hydrocarbon exploration. Their extinction at the Triassic-Jurassic boundary (~201.3 MYA) marks a significant biostratigraphic datum.</p>
        
        <h4>Taxonomy & Classification:</h4>
        <p>Domain: Eukaryota | Kingdom: Animalia | Phylum: Chordata | Class: Conodonta | Orders include: Ozarkodinida, Prioniodinida</p>
        
        <p><em>Data sourced from the Paleobiology Database and The Conodont Page (Jim Barrick, Texas Tech)</em></p>
    `;
} 