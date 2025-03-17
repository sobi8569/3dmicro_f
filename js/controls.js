// Function to set up control buttons
export function setupControls(onResetView, onToggleLabels, onToggleCrossSection) {
    // Set up event listeners for original control buttons
    document.getElementById('reset-view').addEventListener('click', onResetView);
    document.getElementById('toggle-labels').addEventListener('click', onToggleLabels);
    document.getElementById('toggle-cross-section').addEventListener('click', onToggleCrossSection);
    
    // Set up event listeners for floating control buttons
    document.getElementById('reset-view-float').addEventListener('click', onResetView);
    document.getElementById('toggle-labels-float').addEventListener('click', onToggleLabels);
    document.getElementById('toggle-cross-section-float').addEventListener('click', onToggleCrossSection);
}

// Function to update component toggle checkboxes
export function updateComponentToggles(components) {
    const togglesContainer = document.getElementById('component-toggles');
    
    // Clear previous toggles
    togglesContainer.innerHTML = '';
    
    // Create toggles for each component
    components.forEach(component => {
        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'component-toggle';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `toggle-${component.name}`;
        checkbox.checked = component.visible;
        checkbox.addEventListener('change', () => {
            toggleComponentVisibility(component, checkbox.checked);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `toggle-${component.name}`;
        label.textContent = component.displayName || component.name;
        
        toggleDiv.appendChild(checkbox);
        toggleDiv.appendChild(label);
        togglesContainer.appendChild(toggleDiv);
    });
}

// Function to toggle component visibility
function toggleComponentVisibility(component, isVisible) {
    if (component.mesh) {
        component.mesh.visible = isVisible;
        component.visible = isVisible;
    } else if (component.group) {
        component.group.visible = isVisible;
        component.visible = isVisible;
    }
    
    // Toggle associated labels if any
    if (component.labels) {
        component.labels.forEach(label => {
            label.element.style.display = isVisible ? 'block' : 'none';
        });
    }
} 