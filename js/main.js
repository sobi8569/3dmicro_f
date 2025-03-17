import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createLabelRenderer, updateLabels, removeAllLabels } from './labelUtils.js';
import { setupControls, updateComponentToggles } from './controls.js';

// Import fossil models
import { createFusulineModel, getFusulineInfo } from './fossils/fusuline.js';
import { createRadiolarianModel, getRadiolarianInfo } from './fossils/radiolarian.js';
import { createForaminiferaModel, getForaminiferaInfo } from './fossils/foraminifera.js';
import { createDiatomModel, getDiatomInfo } from './fossils/diatom.js';
import { createConodontModel, getConodontInfo } from './fossils/conodont.js';
import { createOstracodModel, getOstracodInfo } from './fossils/ostracod.js';
import { createAcritarchModel, getAcritarchInfo } from './fossils/acritarch.js';

// Global variables
let scene, camera, renderer, controls, labelRenderer;
let currentModel = null;
let crossSectionEnabled = false;
let fossilType = 'fusuline';

// Make labels globally accessible for all fossil modules
window.labels = [];
window.labelContainer = null; // Will store reference to container

// Add a diagnostic function to help debug label issues
window.checkForOrphanedLabels = function() {
    const labelElements = document.querySelectorAll('.fossil-label');
    console.log(`Found ${labelElements.length} label elements in the DOM`);
    console.log(`Global labels array has ${window.labels.length} entries`);
    
    // Force cleanup of all labels
    removeAllLabels(scene);
    
    // Check again
    const remainingLabels = document.querySelectorAll('.fossil-label');
    console.log(`After cleanup: ${remainingLabels.length} label elements remain in the DOM`);
    
    return remainingLabels.length;
};

// Initialize the application
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        getAspectRatio(),
        0.1,
        1000
    );
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(getContainerWidth(), getContainerHeight());
    document.getElementById('model-container').appendChild(renderer.domElement);

    // Set up orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create label renderer
    labelRenderer = createLabelRenderer(getContainerWidth(), getContainerHeight());
    document.getElementById('model-container').appendChild(labelRenderer.domElement);
    window.labelContainer = document.getElementById('model-container');

    // Add lights
    addLights();

    // Set up user interface controls
    setupControls(resetView, toggleLabels, toggleCrossSection);

    // Load initial fossil
    loadFossil(fossilType);

    // Set up event listeners
    window.addEventListener('resize', onWindowResize);
    document.getElementById('fossil-select').addEventListener('change', onFossilChange);

    // Start animation loop
    animate();
}

// Add lights to the scene
function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
    scene.add(hemisphereLight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    if (window.labels && window.labels.length > 0) {
        updateLabels(window.labels, camera);
    }
    
    renderer.render(scene, camera);
    if (labelRenderer) labelRenderer.render(scene, camera);
}

// Load a fossil model
function loadFossil(type) {
    // Clear previous model
    if (currentModel) {
        scene.remove(currentModel);
    }
    
    // Clear all previous labels
    removeAllLabels(scene);
    
    // Reset cross-section
    crossSectionEnabled = false;
    renderer.clippingPlanes = [];

    // Load new model based on type
    fossilType = type;
    let components = [];
    let info = '';

    switch (type) {
        case 'fusuline':
            currentModel = createFusulineModel(scene);
            components = currentModel.userData.components;
            info = getFusulineInfo();
            break;
        case 'radiolarian':
            currentModel = createRadiolarianModel(scene);
            components = currentModel.userData.components;
            info = getRadiolarianInfo();
            break;
        case 'foraminifera':
            currentModel = createForaminiferaModel(scene);
            components = currentModel.userData.components;
            info = getForaminiferaInfo();
            break;
        case 'diatom':
            currentModel = createDiatomModel(scene);
            components = currentModel.userData.components;
            info = getDiatomInfo();
            break;
        case 'conodont':
            currentModel = createConodontModel(scene);
            components = currentModel.userData.components;
            info = getConodontInfo();
            break;
        case 'ostracod':
            currentModel = createOstracodModel(scene);
            components = currentModel.userData.components;
            info = getOstracodInfo();
            break;
        case 'acritarch':
            currentModel = createAcritarchModel(scene);
            components = currentModel.userData.components;
            info = getAcritarchInfo();
            break;
    }

    // Setup model and update UI
    scene.add(currentModel);
    updateComponentToggles(components);
    updateFossilInfo(info);
    resetView();
}

// Update fossil information panel
function updateFossilInfo(info) {
    const fossilInfoDiv = document.getElementById('fossil-info');
    
    // Helper function to create tabbed content
    function createTabbedContent(htmlContent) {
        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Extract the main title (h3)
        const title = doc.querySelector('h3') ? doc.querySelector('h3').outerHTML : '';
        
        // Create the tabbed interface
        let result = title;
        result += '<div class="info-tabs">';
        
        // Add tabs for each section
        const sections = [];
        
        // Add Overview tab (first paragraph after h3)
        if (doc.querySelector('h3 + p')) {
            const overviewContent = doc.querySelector('h3 + p').outerHTML;
            sections.push({
                id: 'overview',
                title: 'Overview',
                content: overviewContent
            });
        }
        
        // Add Key Features tab
        const featuresH4 = Array.from(doc.querySelectorAll('h4')).find(h => h.textContent.includes('Key Features'));
        if (featuresH4) {
            let featuresContent = featuresH4.outerHTML;
            let nextElement = featuresH4.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'H4') {
                featuresContent += nextElement.outerHTML;
                nextElement = nextElement.nextElementSibling;
            }
            sections.push({
                id: 'features',
                title: 'Features',
                content: featuresContent
            });
        }
        
        // Add Geological Significance tab
        const geoH4 = Array.from(doc.querySelectorAll('h4')).find(h => h.textContent.includes('Geological Significance'));
        if (geoH4) {
            let geoContent = geoH4.outerHTML;
            let nextElement = geoH4.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'H4') {
                geoContent += nextElement.outerHTML;
                nextElement = nextElement.nextElementSibling;
            }
            sections.push({
                id: 'significance',
                title: 'Significance',
                content: geoContent
            });
        }
        
        // Add Taxonomy tab
        const taxH4 = Array.from(doc.querySelectorAll('h4')).find(h => h.textContent.includes('Taxonomy'));
        if (taxH4) {
            let taxContent = taxH4.outerHTML;
            let nextElement = taxH4.nextElementSibling;
            while (nextElement && nextElement.tagName !== 'H4') {
                taxContent += nextElement.outerHTML;
                nextElement = nextElement.nextElementSibling;
            }
            sections.push({
                id: 'taxonomy',
                title: 'Taxonomy',
                content: taxContent
            });
        }
        
        // Add source information to the taxonomy tab or create a new tab if needed
        const sourceEm = doc.querySelector('em');
        if (sourceEm && sections.length > 0) {
            if (sections[sections.length - 1].id === 'taxonomy') {
                sections[sections.length - 1].content += sourceEm.outerHTML;
            } else {
                sections.push({
                    id: 'source',
                    title: 'Source',
                    content: sourceEm.outerHTML
                });
            }
        }
        
        // Create tab buttons
        sections.forEach((section, index) => {
            result += `<div class="info-tab ${index === 0 ? 'active' : ''}" data-tab="${section.id}">${section.title}</div>`;
        });
        
        result += '</div>';
        
        // Create tab content
        sections.forEach((section, index) => {
            result += `<div class="info-content ${index === 0 ? 'active' : ''}" id="tab-${section.id}">${section.content}</div>`;
        });
        
        return result;
    }
    
    // If it's just a simple message, don't create tabs
    if (info.trim().length < 50 || !info.includes('<h3>')) {
        fossilInfoDiv.innerHTML = info;
    } else {
        fossilInfoDiv.innerHTML = createTabbedContent(info);
        
        // Add event listeners to tabs
        const tabs = fossilInfoDiv.querySelectorAll('.info-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                const tabContents = fossilInfoDiv.querySelectorAll('.info-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`tab-${tabId}`).classList.add('active');
            });
        });
    }
}

// Handle fossil selection change
function onFossilChange(event) {
    loadFossil(event.target.value);
}

// Reset camera view
function resetView() {
    camera.position.set(0, 0, 5);
    controls.reset();
}

// Toggle the visibility of labels
function toggleLabels() {
    if (window.labels) {
        window.labels.forEach(label => {
            if (label.element) {
                label.element.style.display = 
                    label.element.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
}

// Toggle cross-section view
function toggleCrossSection() {
    crossSectionEnabled = !crossSectionEnabled;
    if (currentModel) {
        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), crossSectionEnabled ? 0 : 5);
        renderer.clippingPlanes = crossSectionEnabled ? [clippingPlane] : [];
    }
}

// Handle window resize
function onWindowResize() {
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();
    renderer.setSize(getContainerWidth(), getContainerHeight());
    if (labelRenderer) {
        labelRenderer.setSize(getContainerWidth(), getContainerHeight());
    }
}

// Helper functions for dimensions
function getContainerWidth() {
    return document.getElementById('model-container').clientWidth;
}

function getContainerHeight() {
    return document.getElementById('model-container').clientHeight;
}

function getAspectRatio() {
    return getContainerWidth() / getContainerHeight();
}

// Initialize when the page is loaded
window.addEventListener('load', init); 