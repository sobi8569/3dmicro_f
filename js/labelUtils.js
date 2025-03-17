import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Create a CSS2D renderer for labels
export function createLabelRenderer(width, height) {
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    return labelRenderer;
}

// Create a label for a component
export function createLabel(text, position, component) {
    // Create HTML element for the label
    const labelElement = document.createElement('div');
    labelElement.className = 'fossil-label';
    labelElement.textContent = text;
    
    // Create CSS2D object with the HTML element
    const label = new CSS2DObject(labelElement);
    label.position.set(position.x, position.y, position.z);
    
    // Store reference to the component
    label.userData = { component };
    
    return label;
}

// Add a label to a scene and the labels array
export function addLabel(scene, labelsArray, text, position, component) {
    const label = createLabel(text, position, component);
    scene.add(label);
    
    // Add to labels array with reference to HTML element
    const labelInfo = {
        object: label,
        element: label.element,
        component
    };
    
    // Add to global labels array if provided
    if (Array.isArray(labelsArray)) {
        labelsArray.push(labelInfo);
    }
    
    // Add to component's labels array if it exists
    if (component) {
        if (!component.labels) {
            component.labels = [];
        }
        
        component.labels.push({
            object: label,
            element: label.element
        });
    }
    
    return label;
}

// Remove all labels from the scene and DOM
export function removeAllLabels(scene) {
    // First, find and remove all CSS2DObjects from the scene
    // Need to search for all objects in the scene hierarchy that are CSS2DObjects
    const objectsToRemove = [];
    scene.traverse((object) => {
        if (object instanceof CSS2DObject) {
            objectsToRemove.push(object);
        }
    });
    
    // Remove the found objects from the scene
    objectsToRemove.forEach((object) => {
        scene.remove(object);
    });
    
    // Clean up any HTML elements that might be left
    if (window.labels) {
        window.labels.forEach(label => {
            if (label.element && label.element.parentNode) {
                label.element.parentNode.removeChild(label.element);
            }
        });
        
        // Clear the global labels array
        window.labels.length = 0;
    }
    
    // Also look for any .fossil-label elements that might be orphaned
    if (window.labelContainer) {
        const labelElements = window.labelContainer.querySelectorAll('.fossil-label');
        labelElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }
}

// Update labels to face camera
export function updateLabels(labels, camera) {
    const cameraPosition = new THREE.Vector3();
    camera.getWorldPosition(cameraPosition);
    
    labels.forEach(label => {
        if (!label.object) return;
        
        const labelPosition = new THREE.Vector3();
        label.object.getWorldPosition(labelPosition);
        
        // Calculate distance from camera
        const distance = labelPosition.distanceTo(cameraPosition);
        
        // Update visibility based on distance (optional)
        if (distance > 10) {
            label.element.style.opacity = '0.3';
        } else {
            label.element.style.opacity = '1';
        }
    });
} 