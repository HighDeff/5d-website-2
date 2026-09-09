/**
 * Master AI Tab Integration
 * Integrates Master AI Controller with the main application as a dedicated tab
 */

console.log('🎯 Loading Master AI Tab Integration...');

class MasterAITabIntegration {
  constructor() {
    this.isIntegrated = false;
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing Master AI Tab...');
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.createMasterAITab();
      });
    } else {
      this.createMasterAITab();
    }
  }

  createMasterAITab() {
    // Add to existing canvas tabs if available
    if (window.canvasTabs) {
      this.integrateWithCanvasTabs();
    } else {
      // Create standalone tab button
      this.createStandaloneTab();
    }
    
    // Add to navigation menu
    this.addToMainNavigation();
  }

  integrateWithCanvasTabs() {
    // Add Master AI as a tab in the canvas tabbed system
    if (window.canvasTabs && window.canvasTabs.canvases) {
      window.canvasTabs.canvases.set('master-ai-controller', {
        id: 'master-ai-controller',
        type: 'master-ai',
        title: '🧠 Master AI Controller',
        container: null, // Will be created when activated
        settings: {
          refreshRate: 5000,
          autoRefresh: true,
          showMetrics: true,
          dataPackets: false,
          timestamps: true
        }
      });
      
      console.log('✅ Master AI integrated with canvas tabs');
      this.isIntegrated = true;
    }
  }

  createStandaloneTab() {
    // Create floating tab button
    const tabButton = document.createElement('button');
    tabButton.id = 'master-ai-tab-button';
    tabButton.innerHTML = '🧠 Master AI';
    tabButton.style.cssText = `
      position: fixed;
      top: 120px;
      left: 20px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
      transition: all 0.2s;
      z-index: 1006;
    `;

    tabButton.addEventListener('mouseenter', () => {
      tabButton.style.transform = 'translateY(-2px)';
      tabButton.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.6)';
    });

    tabButton.addEventListener('mouseleave', () => {
      tabButton.style.transform = 'translateY(0)';
      tabButton.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
    });

    tabButton.addEventListener('click', () => {
      if (window.masterAI) {
        window.masterAI.openController();
      }
    });

    document.body.appendChild(tabButton);
    console.log('✅ Created standalone Master AI tab button');
  }

  addToMainNavigation() {
    // Add to main navigation if it exists
    const mainNav = document.querySelector('nav .container');
    if (mainNav) {
      const navItems = mainNav.querySelector('.hidden.lg\\:flex');
      if (navItems) {
        const masterAILink = document.createElement('a');
        masterAILink.className = 'text-gray-700 hover:text-purple-600 font-medium transition-colors text-sm lg:text-base cursor-pointer';
        masterAILink.textContent = '🧠 Master AI';
        masterAILink.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.masterAI) {
            window.masterAI.openController();
          }
        });
        
        navItems.appendChild(masterAILink);
        console.log('✅ Added Master AI to main navigation');
      }
    }
  }

  // Override canvas tab activation for Master AI
  activateMasterAITab() {
    if (window.masterAI) {
      window.masterAI.openController();
    }
  }
}

// Initialize Master AI Tab Integration
const masterAITab = new MasterAITabIntegration();

// Make globally accessible
window.masterAITab = masterAITab;

console.log('🎯 Master AI Tab Integration loaded!');
