// renderer.js - Complete Frontend Logic for React Project Installer
class ReactInstaller {
    constructor() {
        this.selectedProjectType = 'create-react-app';
        this.isInstalling = false;
        this.systemInfo = null;
        this.currentCategory = 'all';
        this.currentSearchTerm = '';
        this.lastCreatedProjectPath = null; // Store the path of the last created project
        this.packagesData = this.initializePackagesData();
        
        this.initializeEventListeners();
        this.initializeWindowControls();
        this.initializeTabs();
        this.initializePackages();
        this.loadSystemInfo();
    }

    initializePackagesData() {
        return [
            // UI Components
            { name: 'React Router', command: 'npm install react-router-dom', description: 'Declarative routing for React applications', category: 'routing' },
            { name: 'Material-UI', command: 'npm install @mui/material @emotion/react @emotion/styled', description: 'React components implementing Google\'s Material Design', category: 'ui' },
            { name: 'Ant Design', command: 'npm install antd', description: 'Enterprise-ready UI components for React', category: 'ui' },
            { name: 'Chakra UI', command: 'npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion', description: 'Modular and accessible component library', category: 'ui' },
            { name: 'React Bootstrap', command: 'npm install react-bootstrap bootstrap', description: 'Bootstrap components built for React', category: 'ui' },
            
            // State Management
            { name: 'Redux Toolkit', command: 'npm install @reduxjs/toolkit react-redux', description: 'The official, opinionated, batteries-included toolset for Redux', category: 'state' },
            { name: 'Zustand', command: 'npm install zustand', description: 'Small, fast and scalable bearbones state-management solution', category: 'state' },
            { name: 'Recoil', command: 'npm install recoil', description: 'Experimental state management library by Facebook', category: 'state' },
            
            // Styling
            { name: 'Styled Components', command: 'npm install styled-components', description: 'CSS-in-JS library for styling React components', category: 'styling' },
            { name: 'Emotion', command: 'npm install @emotion/react @emotion/styled', description: 'CSS-in-JS library with great performance', category: 'styling' },
            { name: 'Tailwind CSS', command: 'npm install tailwindcss postcss autoprefixer', description: 'Utility-first CSS framework', category: 'styling' },
            { name: 'Sass', command: 'npm install sass', description: 'CSS preprocessor with variables and mixins', category: 'styling' },
            
            // Testing
            { name: 'Jest', command: 'npm install --save-dev jest', description: 'JavaScript testing framework', category: 'testing' },
            { name: 'React Testing Library', command: 'npm install --save-dev @testing-library/react', description: 'Testing utilities for React components', category: 'testing' },
            { name: 'Cypress', command: 'npm install --save-dev cypress', description: 'End-to-end testing framework', category: 'testing' },
            
            // Build Tools
            { name: 'Webpack', command: 'npm install --save-dev webpack webpack-cli', description: 'Module bundler for JavaScript applications', category: 'build' },
            { name: 'Vite', command: 'npm install --save-dev vite', description: 'Fast build tool and dev server', category: 'build' },
            { name: 'Parcel', command: 'npm install --save-dev parcel', description: 'Zero configuration build tool', category: 'build' },
            
            // Utilities
            { name: 'Axios', command: 'npm install axios', description: 'Promise-based HTTP client for JavaScript', category: 'utilities' },
            { name: 'Lodash', command: 'npm install lodash', description: 'JavaScript utility library', category: 'utilities' },
            { name: 'Date-fns', command: 'npm install date-fns', description: 'Modern JavaScript date utility library', category: 'utilities' },
            { name: 'React Hook Form', command: 'npm install react-hook-form', description: 'Performant, flexible forms with easy validation', category: 'utilities' },
            { name: 'Formik', command: 'npm install formik', description: 'Build forms in React without tears', category: 'utilities' }
        ];
    }

    async loadSystemInfo() {
        try {
            // Get system info from main process via IPC
            this.systemInfo = await window.electronAPI.getSystemInfo();
        } catch (error) {
            console.warn('Could not load system info:', error);
            this.systemInfo = {
                platform: 'unknown',
                nodeVersion: 'unknown',
                electronVersion: 'unknown',
                chromeVersion: 'unknown'
            };
        }
    }

    initializeTabs() {
        console.log('Initializing tabs...');
        
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                console.log('Switching to tab:', tabName);
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabName}-tab`) {
                        content.classList.add('active');
                        
                        // If switching to packages tab, render packages
                        if (tabName === 'packages') {
                            setTimeout(() => {
                                this.renderPackages();
                            }, 100);
                        }
                    }
                });
            });
        });
    }

    initializePackages() {
        console.log('Initializing packages...');
        
        // Category buttons
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Category clicked:', btn.dataset.category);
                
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentCategory = btn.dataset.category;
                this.renderPackages();
            });
        });

        // Search input
        const searchInput = document.getElementById('packageSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearchTerm = e.target.value.toLowerCase();
                console.log('Search term:', this.currentSearchTerm);
                this.renderPackages();
            });
        }
    }

    renderPackages() {
        console.log('Rendering packages...');
        
        const packagesGrid = document.getElementById('packagesGrid');
        if (!packagesGrid) {
            console.error('Packages grid not found');
            return;
        }

        // Filter packages
        let filteredPackages = this.packagesData;

        // Filter by category
        if (this.currentCategory !== 'all') {
            filteredPackages = filteredPackages.filter(pkg => pkg.category === this.currentCategory);
        }

        // Filter by search term
        if (this.currentSearchTerm) {
            filteredPackages = filteredPackages.filter(pkg => 
                pkg.name.toLowerCase().includes(this.currentSearchTerm) ||
                pkg.description.toLowerCase().includes(this.currentSearchTerm) ||
                pkg.category.toLowerCase().includes(this.currentSearchTerm)
            );
        }

        console.log('Filtered packages:', filteredPackages.length);

        // Render packages
        if (filteredPackages.length === 0) {
            packagesGrid.innerHTML = `
                <div class="no-packages">
                    <p>No packages found matching your criteria.</p>
                </div>
            `;
            return;
        }

        packagesGrid.innerHTML = filteredPackages.map(pkg => `
            <div class="package-card" data-category="${pkg.category}">
                <div class="package-header">
                    <h3 class="package-name">${pkg.name}</h3>
                    <span class="package-category">${pkg.category}</span>
                </div>
                <p class="package-description">${pkg.description}</p>
                <div class="package-command">
                    <code class="command-text">${pkg.command}</code>
                    <button class="copy-btn" data-command="${pkg.command}">
                        📋 Copy
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to copy buttons
        this.addCopyListeners();
    }

    addCopyListeners() {
        console.log('Adding copy listeners...');
        
        const copyBtns = document.querySelectorAll('.copy-btn');
        console.log('Found copy buttons:', copyBtns.length);
        
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const command = btn.dataset.command;
                console.log('Copy button clicked, command:', command);
                this.copyToClipboard(command);
            });
        });
    }

    async copyToClipboard(command) {
        console.log('Attempting to copy:', command);
        
        try {
            // Try using the Electron API first
            if (window.electronAPI && window.electronAPI.copyToClipboard) {
                console.log('Using Electron API...');
                const result = await window.electronAPI.copyToClipboard(command);
                if (result && result.success) {
                    console.log('Electron API copy successful');
                    this.showCopyNotification();
                    return;
                }
            }
            
            // Fallback to browser clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                console.log('Using browser clipboard API...');
                await navigator.clipboard.writeText(command);
                console.log('Browser clipboard copy successful');
                this.showCopyNotification();
                return;
            }
            
            // Final fallback - manual selection
            console.log('Using manual fallback...');
            const textArea = document.createElement('textarea');
            textArea.value = command;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                console.log('Manual copy successful');
                this.showCopyNotification();
            } else {
                console.error('Manual copy failed');
                this.showStatus('Copy failed. Command: ' + command, 'error');
            }
            
        } catch (error) {
            console.error('Copy error:', error);
            this.showStatus('Copy failed. Command: ' + command, 'error');
        }
    }

    showCopyNotification() {
        console.log('Showing copy notification...');
        const notification = document.getElementById('copyNotification');
        if (notification) {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        } else {
            console.error('Copy notification element not found');
            // Fallback - show status message
            this.showStatus('Command copied to clipboard!', 'success');
            setTimeout(() => this.hideStatus(), 2000);
        }
    }

    initializeEventListeners() {
        // Project type selection
        document.querySelectorAll('.project-type-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectProjectType(card.dataset.type);
            });
        });

        // Folder selection
        const browseFolderBtn = document.getElementById('browseFolderBtn');
        if (browseFolderBtn) {
            browseFolderBtn.addEventListener('click', () => {
                this.selectFolder();
            });
        }

        // Install button
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.installProject();
            });
        }

        // Terminal toggle
        const terminalToggle = document.getElementById('terminalToggle');
        if (terminalToggle) {
            terminalToggle.addEventListener('click', () => {
                this.toggleTerminal();
            });
        }

        // Project name input validation
        const projectNameInput = document.getElementById('projectName');
        if (projectNameInput) {
            projectNameInput.addEventListener('input', (e) => {
                this.validateProjectName(e.target);
            });

            // Enter key support
            projectNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isInstalling) {
                    this.installProject();
                }
            });
        }

        // Listen to installation progress
        // if (window.electronAPI && window.electronAPI.onInstallProgress) {
        //     window.electronAPI.onInstallProgress((data) => {
        //         this.handleInstallProgress(data);
        //     });
        // }


          if (window.electronAPI && window.electronAPI.onInstallProgress) {
        console.log('Setting up install progress listener...');
        window.electronAPI.onInstallProgress((data) => {
            console.log('Install progress received:', data);
            this.handleInstallProgress(data);
            });
        } else {
            console.error('electronAPI.onInstallProgress not available!');
        }
    }

    initializeWindowControls() {
        const closeBtn = document.getElementById('closeBtn');
        const minimizeBtn = document.getElementById('minimizeBtn');
        const maximizeBtn = document.getElementById('maximizeBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.electronAPI.closeApp();
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                window.electronAPI.minimizeApp();
            });
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                window.electronAPI.maximizeApp();
            });
        }
    }

    selectProjectType(type) {
        this.selectedProjectType = type;
        
        document.querySelectorAll('.project-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-type="${type}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    async selectFolder() {
        try {
            const folderPath = await window.electronAPI.selectFolder();
            if (folderPath) {
                document.getElementById('folderPath').value = folderPath;
            }
        } catch (error) {
            this.showStatus('Failed to select folder', 'error');
        }
    }

    validateProjectName(input) {
        const value = input.value;
        const isValid = /^[a-z0-9-]+$/.test(value) && value.length > 0;
        
        if (value && !isValid) {
            input.style.borderColor = '#ef4444';
            this.showStatus('Project name should contain only lowercase letters, numbers, and hyphens', 'error');
        } else {
            input.style.borderColor = '#e5e7eb';
            this.hideStatus();
        }
    }

    validateForm() {
        const projectNameInput = document.getElementById('projectName');
        const folderPathInput = document.getElementById('folderPath');
        
        if (!projectNameInput || !folderPathInput) {
            this.showStatus('Form elements not found', 'error');
            return false;
        }

        const projectName = projectNameInput.value.trim();
        const folderPath = folderPathInput.value.trim();
        
        if (!projectName) {
            this.showStatus('Please enter a project name', 'error');
            return false;
        }
        
        if (!/^[a-z0-9-]+$/.test(projectName)) {
            this.showStatus('Project name should contain only lowercase letters, numbers, and hyphens', 'error');
            return false;
        }
        
        if (!folderPath) {
            this.showStatus('Please select an installation directory', 'error');
            return false;
        }
        
        return true;
    }

    async installProject() {
        if (this.isInstalling || !this.validateForm()) return;
        
        const projectName = document.getElementById('projectName').value.trim();
        const folderPath = document.getElementById('folderPath').value.trim();
        
        this.startInstallation();
        
        try {
            const result = await window.electronAPI.installProject({
                projectName,
                folderPath,
                projectType: this.selectedProjectType
            });
            
            this.handleInstallationSuccess(result, projectName, folderPath);
        } catch (error) {
            this.handleInstallationError(error);
        }
    }

    // startInstallation() {
    //     this.isInstalling = true;
    //     const installBtn = document.getElementById('installBtn');
    //     const progressSection = document.getElementById('progressSection');
    //     const terminalOutput = document.getElementById('terminalOutput');
        
    //     if (installBtn) {
    //         installBtn.innerHTML = '<span class="spinner"></span>Creating Project...';
    //         installBtn.disabled = true;
    //     }
    //     if (progressSection) progressSection.style.display = 'block';
    //     if (terminalOutput) terminalOutput.style.display = 'block';
        
    //     this.hideStatus();
    //     this.updateProgress(10, 'Initializing installation...');
    // }
    startInstallation() {
    this.isInstalling = true;
    const installBtn = document.getElementById('installBtn');
    const progressSection = document.getElementById('progressSection');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalContent = document.getElementById('terminalContent');
    
    if (installBtn) {
        installBtn.innerHTML = '<span class="spinner"></span>Creating Project...';
        installBtn.disabled = true;
    }
    
    // Show progress and terminal sections
    if (progressSection) {
        progressSection.style.display = 'block';
    }
    if (terminalOutput) {
        terminalOutput.style.display = 'block';
    }
    
    // Clear previous terminal content
    if (terminalContent) {
        terminalContent.innerHTML = '';
        // Make sure it's visible
        terminalContent.style.display = 'block';
    }
    
    this.hideStatus();
    this.updateProgress(10, 'Initializing installation...');
    
    console.log('Installation started - terminal should be visible now');
}

    // handleInstallProgress(data) {
    //     const terminalContent = document.getElementById('terminalContent');
        
    //     if (terminalContent && (data.type === 'stdout' || data.type === 'stderr')) {
    //         const line = document.createElement('div');
    //         line.textContent = data.data;
    //         line.style.color = data.type === 'stderr' ? '#ef4444' : '#374151';
    //         terminalContent.appendChild(line);
    //         terminalContent.scrollTop = terminalContent.scrollHeight;
            
    //         // Update progress based on output
    //         this.updateProgressFromOutput(data.data);
    //     }
    // }
    handleInstallProgress(data) {
    console.log('Progress data received:', data);
    
    const terminalContent = document.getElementById('terminalContent');
    
    if (!terminalContent) {
        console.error('Terminal content element not found!');
        return;
    }
    
    if (data.type === 'stdout' || data.type === 'stderr') {
        console.log('Adding line to terminal:', data.data);
        
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = data.data;
        
        // Style based on type
        if (data.type === 'stderr') {
            line.style.color = '#ef4444';
        } else {
            line.style.color = '#22c55e'; // Green for stdout
        }
        
        terminalContent.appendChild(line);
        
        // Auto-scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
        
        // Update progress based on output
        this.updateProgressFromOutput(data.data);
    }
}


    updateProgressFromOutput(output) {
        const lowerOutput = output.toLowerCase();
        
        if (lowerOutput.includes('creating a new react app') || lowerOutput.includes('scaffolding project')) {
            this.updateProgress(20, 'Creating project structure...');
        } else if (lowerOutput.includes('installing packages') || lowerOutput.includes('installing dependencies')) {
            this.updateProgress(40, 'Installing dependencies...');
        } else if (lowerOutput.includes('installing react') || lowerOutput.includes('added') && lowerOutput.includes('packages')) {
            this.updateProgress(60, 'Installing React packages...');
        } else if (lowerOutput.includes('removing template package') || lowerOutput.includes('cleaning up')) {
            this.updateProgress(80, 'Cleaning up installation...');
        } else if (lowerOutput.includes('success') || lowerOutput.includes('created') || lowerOutput.includes('done')) {
            this.updateProgress(90, 'Finalizing setup...');
        } else if (lowerOutput.includes('happy hacking') || lowerOutput.includes('get started')) {
            this.updateProgress(100, 'Installation completed!');
        }
    }

    // handleInstallationSuccess(result, projectName, folderPath) {
    //     this.updateProgress(100, 'Installation completed successfully!');
        
    //     // Store the project path for the open button
    //     const path = require('path');
    //     this.lastCreatedProjectPath = path.join(folderPath, projectName);
        
    //     setTimeout(() => {
    //         this.showStatus(
    //             `✅ Successfully created "${projectName}" using ${this.getProjectTypeLabel(this.selectedProjectType)}!`,
    //             'success'
    //         );
            
    //         // Add success actions with Open Project button first
    //         const statusDiv = document.getElementById('statusMessage');
    //         if (statusDiv) {
    //             const actionsDiv = document.createElement('div');
    //             actionsDiv.className = 'success-actions';
    //             actionsDiv.innerHTML = `
    //                 <button class="action-btn primary" onclick="installer.openProjectInEditor()">
    //                     🚀 Open Project
    //                 </button>
    //                 <button class="action-btn secondary" onclick="installer.resetForm()">
    //                     🆕 Create Another
    //                 </button>
    //             `;
    //             statusDiv.appendChild(actionsDiv);
    //         }
            
    //         this.finishInstallation();
    //     }, 1000);
    // }
    handleInstallationSuccess(result, projectName, folderPath) {
    this.updateProgress(100, 'Installation completed successfully!');
    
    // Store the project path using simple string concatenation instead of path.join
    // Use the path separator based on the platform
    const isWindows = navigator.platform.indexOf('Win') > -1;
    const pathSeparator = isWindows ? '\\' : '/';
    this.lastCreatedProjectPath = folderPath + pathSeparator + projectName;
    
    setTimeout(() => {
        this.showStatus(
            `✅ Successfully created "${projectName}" using ${this.getProjectTypeLabel(this.selectedProjectType)}!`,
            'success'
        );
        
        // Add success actions with Open Project button first
        const statusDiv = document.getElementById('statusMessage');
        if (statusDiv) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'success-actions';
            actionsDiv.innerHTML = `
                <button class="action-btn primary" onclick="installer.openProjectInEditor()">
                    🚀 Open Project
                </button>
                <button class="action-btn secondary" onclick="installer.resetForm()">
                    🆕 Create Another
                </button>
            `;
            statusDiv.appendChild(actionsDiv);
        }
        
        this.finishInstallation();
    }, 1000);
    }

    async openProjectInEditor() {
        if (!this.lastCreatedProjectPath) {
            this.showStatus('❌ No project path available', 'error');
            return;
        }

        try {
            console.log('Opening project in editor:', this.lastCreatedProjectPath);
            
            // Try to open in editor using the main process
            if (window.electronAPI && window.electronAPI.openInEditor) {
                const result = await window.electronAPI.openInEditor(this.lastCreatedProjectPath);
                
                if (result.success) {
                    this.showStatus(`✅ Project opened in ${result.editor || 'editor'}!`, 'success');
                } else {
                    // Fallback to opening the folder
                    await this.openProjectFolder(this.lastCreatedProjectPath);
                }
            } else {
                // Fallback to opening the folder if editor opening is not available
                await this.openProjectFolder(this.lastCreatedProjectPath);
            }
        } catch (error) {
            console.error('Failed to open project in editor:', error);
            
            // Try fallback to opening folder
            try {
                await this.openProjectFolder(this.lastCreatedProjectPath);
                this.showStatus('✅ Project folder opened!', 'success');
            } catch (folderError) {
                console.error('Failed to open project folder:', folderError);
                this.showStatus('❌ Failed to open project. Path: ' + this.lastCreatedProjectPath, 'error');
            }
        }
    }

    // handleInstallationError(error) {
    //     console.error('Installation failed:', error);
    //     let errorMessage = error.message;
        
    //     // Handle specific error types
    //     if (errorMessage.includes('EEXIST')) {
    //         errorMessage = 'A project with this name already exists in the selected directory.';
    //     } else if (errorMessage.includes('EACCES') || errorMessage.includes('permission denied')) {
    //         errorMessage = 'Permission denied. Please check folder permissions or run as administrator.';
    //     } else if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('network')) {
    //         errorMessage = 'Network error. Please check your internet connection.';
    //     } else if (errorMessage.includes('npm ERR!') || errorMessage.includes('yarn error')) {
    //         errorMessage = 'Package manager error. Please ensure npm/yarn is installed correctly.';
    //     }
        
    //     this.showStatus(`❌ Installation failed: ${errorMessage}`, 'error');
    //     this.finishInstallation();
    // }
    handleInstallationError(error) {
    console.error('Installation failed:', error);
    
    // Hide progress and terminal sections immediately
    const progressSection = document.getElementById('progressSection');
    const terminalOutput = document.getElementById('terminalOutput');
    
    if (progressSection) progressSection.style.display = 'none';
    if (terminalOutput) terminalOutput.style.display = 'none';
    
    let errorMessage = error.message;
    let shouldFocusProjectName = false;
    
    // Handle specific error types
    if (errorMessage.includes('EEXIST') || errorMessage.includes('already exists')) {
        errorMessage = 'A project with this name already exists in the selected directory. Please choose a different project name.';
        shouldFocusProjectName = true;
    } else if (errorMessage.includes('EACCES') || errorMessage.includes('permission denied')) {
        errorMessage = 'Permission denied. Please check folder permissions or run as administrator.';
    } else if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
    } else if (errorMessage.includes('npm ERR!') || errorMessage.includes('yarn error')) {
        errorMessage = 'Package manager error. Please ensure npm/yarn is installed correctly.';
    }
    
    this.showStatus(`❌ Installation failed: ${errorMessage}`, 'error');
    this.finishInstallation();
    
    // If it's a directory exists error, focus on project name input for easy correction
    if (shouldFocusProjectName) {
        setTimeout(() => {
            const projectNameInput = document.getElementById('projectName');
            if (projectNameInput) {
                projectNameInput.focus();
                projectNameInput.select(); // Select all text for easy replacement
            }
        }, 100);
    }
}

    finishInstallation() {
        this.isInstalling = false;
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.disabled = false;
            installBtn.innerHTML = '🚀 Create Project';
        }
    }

    async openProjectFolder(path) {
        try {
            await window.electronAPI.openFolder(path);
        } catch (error) {
            console.error('Failed to open folder:', error);
            this.showStatus('Failed to open project folder', 'error');
        }
    }

    updateProgress(percentage, text) {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = text;
        }
    }

    toggleTerminal() {
        const terminalContent = document.getElementById('terminalContent');
        const toggleBtn = document.getElementById('terminalToggle');
        
        if (terminalContent && toggleBtn) {
            if (terminalContent.style.display === 'none') {
                terminalContent.style.display = 'block';
                toggleBtn.textContent = 'Hide';
            } else {
                terminalContent.style.display = 'none';
                toggleBtn.textContent = 'Show';
            }
        }
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.innerHTML = message;
            statusEl.className = `status-message status-${type}`;
            statusEl.style.display = 'block';
            
            // Auto-hide error messages after 5 seconds
            if (type === 'error') {
                setTimeout(() => {
                    this.hideStatus();
                }, 5000);
            }
        }
    }

    hideStatus() {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
    }

    getProjectTypeLabel(type) {
        const labels = {
            'create-react-app': 'Create React App',
            'vite': 'Vite + React',
            'next': 'Next.js',
            'remix': 'Remix'
        };
        return labels[type] || type;
    }

    resetForm() {
        // Reset form fields
        const projectNameInput = document.getElementById('projectName');
        const folderPathInput = document.getElementById('folderPath');
        const progressSection = document.getElementById('progressSection');
        const terminalOutput = document.getElementById('terminalOutput');
        const terminalContent = document.getElementById('terminalContent');

        if (projectNameInput) projectNameInput.value = '';
        if (folderPathInput) folderPathInput.value = '';
        if (progressSection) progressSection.style.display = 'none';
        if (terminalOutput) terminalOutput.style.display = 'none';
        if (terminalContent) terminalContent.innerHTML = '';
        
        // Reset progress
        this.updateProgress(0, 'Ready to install...');
        this.hideStatus();
        
        // Reset project type to default
        document.querySelectorAll('.project-type-card').forEach(card => {
            card.classList.remove('selected');
        });
        const defaultCard = document.querySelector('[data-type="create-react-app"]');
        if (defaultCard) defaultCard.classList.add('selected');
        this.selectedProjectType = 'create-react-app';
        
        // Reset installation state
        this.isInstalling = false;
        this.lastCreatedProjectPath = null; // Clear the stored project path
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.disabled = false;
            installBtn.innerHTML = '🚀 Create Project';
        }
        
        // Focus on project name input
        setTimeout(() => {
            if (projectNameInput) projectNameInput.focus();
        }, 100);
    }

    // Utility method to format file paths for different OS
    async formatPath(path) {
        try {
            // Get platform info from main process
            const platform = this.systemInfo?.platform || await window.electronAPI.getPlatform();
            if (platform === 'win32') {
                return path.replace(/\//g, '\\');
            }
            return path;
        } catch (error) {
            console.warn('Could not determine platform, using default path format');
            return path;
        }
    }

    // Method to get system info for debugging
    getSystemInfo() {
        return this.systemInfo || {
            platform: 'unknown',
            nodeVersion: 'unknown',
            electronVersion: 'unknown',
            chromeVersion: 'unknown'
        };
    }

    // Method to handle keyboard shortcuts
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + N for new project
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            this.resetForm();
        }
        
        // Ctrl/Cmd + O for open project (if available)
        if ((event.ctrlKey || event.metaKey) && event.key === 'o' && this.lastCreatedProjectPath) {
            event.preventDefault();
            this.openProjectInEditor();
        }
        
        // Escape to cancel/reset
        if (event.key === 'Escape' && !this.isInstalling) {
            this.resetForm();
        }
        
        // Ctrl/Cmd + , for settings (future feature)
        if ((event.ctrlKey || event.metaKey) && event.key === ',') {
            event.preventDefault();
            console.log('Settings shortcut pressed - feature coming soon!');
        }
    }
}

// Initialize the app
let installer;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing React Project Installer...');
    installer = new ReactInstaller();
    
    // Set default folder path (get from main process)
    try {
        if (window.electronAPI && window.electronAPI.getDefaultPath) {
            const defaultPath = await window.electronAPI.getDefaultPath();
            if (defaultPath) {
                const folderPathInput = document.getElementById('folderPath');
                if (folderPathInput) folderPathInput.value = defaultPath;
            }
        }
    } catch (error) {
        console.warn('Could not get default path:', error);
        const folderPathInput = document.getElementById('folderPath');
        if (folderPathInput) folderPathInput.value = '';
    }
    
    // Add keyboard shortcut listeners
    document.addEventListener('keydown', (event) => {
        installer.handleKeyboardShortcuts(event);
    });
    
    console.log('React Project Installer loaded successfully!');
    console.log('System Info:', installer.getSystemInfo());
});

// Handle app cleanup
window.addEventListener('beforeunload', () => {
    if (window.electronAPI && window.electronAPI.removeInstallProgressListener) {
        window.electronAPI.removeInstallProgressListener();
    }
});

// Handle window focus events
window.addEventListener('focus', () => {
    // Refresh UI state when window gets focus
    if (installer && !installer.isInstalling) {
        const projectNameInput = document.getElementById('projectName');
        if (projectNameInput) {
            projectNameInput.focus();
        }
    }
});

// Export for global access (if needed)
if (typeof window !== 'undefined') {
    window.ReactInstaller = ReactInstaller;
}