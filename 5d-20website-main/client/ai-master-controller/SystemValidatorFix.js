/**
 * System Validator Fix
 * Fixes the validation system to work properly with real functionality
 */

console.log('🔧 Loading System Validator Fix...');

class SystemValidatorFix {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing System Validator Fix...');
    
    // Fix existing validator or create new one
    this.fixOrCreateValidator();
    
    // Fix validate buttons
    this.fixValidateButtons();
    
    // Setup proper validation methods
    this.setupValidationMethods();
    
    console.log('✅ System Validator Fix completed');
  }

  fixOrCreateValidator() {
    if (!window.systemValidator || typeof window.systemValidator.runFullSystemValidation !== 'function') {
      // Create working system validator
      window.systemValidator = {
        validationInProgress: false,
        errorLog: [],
        warningLog: [],
        testResults: new Map(),
        taskAssignments: [],
        
        async runFullSystemValidation() {
          if (this.validationInProgress) {
            console.log('⚠️ Validation already in progress');
            return;
          }

          this.validationInProgress = true;
          console.log('🧪 Starting comprehensive system validation...');
          
          this.updateValidationStatus('🔄 Running live validation tests...');
          
          try {
            const results = {
              timestamp: new Date(),
              testsRun: 0,
              testsPassed: 0,
              testsFailed: 0,
              warnings: 0,
              errors: [],
              fixes: [],
              strategies: []
            };

            // Run actual tests
            const testSuites = [
              this.testCanvasSystems(),
              this.testAISystems(),
              this.testDatabaseSystems(),
              this.testUIComponents(),
              this.testNetworkSystems(),
              this.testRealTimeFeatures()
            ];

            const testResults = await Promise.all(testSuites);

            // Process results
            testResults.forEach(suite => {
              if (suite && suite.tests) {
                results.testsRun += suite.tests.length;
                suite.tests.forEach(test => {
                  if (test.status === 'passed') {
                    results.testsPassed++;
                  } else if (test.status === 'failed') {
                    results.testsFailed++;
                    results.errors.push(test);
                    results.fixes.push(this.generateFix(test));
                  } else if (test.status === 'warning') {
                    results.warnings++;
                  }
                });
              }
            });

            // Generate strategies
            results.strategies = this.generateStrategies(results);

            // Display results
            this.displayValidationResults(results);
            
            // Create live monitoring
            this.createLiveMonitoring(results);

          } catch (error) {
            console.error('Validation failed:', error);
            this.updateValidationStatus('❌ Validation failed: ' + error.message);
          } finally {
            this.validationInProgress = false;
          }
        },

        updateValidationStatus(status) {
          const statusElements = document.querySelectorAll('#validator-status, .validation-status');
          statusElements.forEach(element => {
            if (element) {
              element.textContent = status;
            }
          });
          
          // Update timestamp
          const timestampEl = document.getElementById('validator-timestamp');
          if (timestampEl) {
            timestampEl.textContent = new Date().toLocaleString();
          }
          
          console.log('📊 Validation Status:', status);
        },

        async testCanvasSystems() {
          const canvases = document.querySelectorAll('canvas');
          const tests = [];
          
          tests.push({
            name: 'Canvas Elements',
            status: canvases.length > 0 ? 'passed' : 'failed',
            details: `Found ${canvases.length} canvas elements`,
            category: 'Canvas'
          });

          let workingCanvases = 0;
          canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx && canvas.width > 0 && canvas.height > 0) {
              workingCanvases++;
            }
          });

          tests.push({
            name: 'Canvas Functionality',
            status: workingCanvases === canvases.length ? 'passed' : (workingCanvases > 0 ? 'warning' : 'failed'),
            details: `${workingCanvases}/${canvases.length} canvases functional`,
            category: 'Canvas'
          });

          tests.push({
            name: 'Canvas Entity Manager',
            status: window.canvasEntityManager ? 'passed' : 'failed',
            details: window.canvasEntityManager ? 'Entity manager available' : 'Entity manager missing',
            category: 'Canvas'
          });

          return { category: 'Canvas Systems', tests };
        },

        async testAISystems() {
          const tests = [];
          
          // Test AI Collaboration Network
          tests.push({
            name: 'AI Collaboration Network',
            status: window.aiCollaborationNetwork ? 'passed' : 'failed',
            details: window.aiCollaborationNetwork ? 'Network active' : 'Network not found',
            category: 'AI'
          });

          // Test AI Status Tracker
          tests.push({
            name: 'AI Status Tracker',
            status: window.aiStatusTracker ? 'passed' : 'failed',
            details: window.aiStatusTracker ? 'Tracker operational' : 'Tracker not found',
            category: 'AI'
          });

          // Test AI Assistant
          tests.push({
            name: 'AI Assistant',
            status: window.aiAssistant ? 'passed' : 'failed',
            details: window.aiAssistant ? 'Assistant available' : 'Assistant not found',
            category: 'AI'
          });

          // Test Master AI Controller
          tests.push({
            name: 'Master AI Controller',
            status: window.masterAI ? 'passed' : 'failed',
            details: window.masterAI ? 'Master AI operational' : 'Master AI not found',
            category: 'AI'
          });

          return { category: 'AI Systems', tests };
        },

        async testDatabaseSystems() {
          const tests = [];
          
          // Test localStorage
          try {
            localStorage.setItem('validation-test', 'test');
            const retrieved = localStorage.getItem('validation-test');
            localStorage.removeItem('validation-test');
            
            tests.push({
              name: 'LocalStorage',
              status: retrieved === 'test' ? 'passed' : 'failed',
              details: 'Local storage read/write test',
              category: 'Database'
            });
          } catch (error) {
            tests.push({
              name: 'LocalStorage',
              status: 'failed',
              details: 'LocalStorage error: ' + error.message,
              category: 'Database'
            });
          }

          // Test unlimited database
          tests.push({
            name: 'Unlimited Database',
            status: window.unlimitedDatabaseService ? 'passed' : 'warning',
            details: window.unlimitedDatabaseService ? 'Unlimited DB service active' : 'Service not found',
            category: 'Database'
          });

          return { category: 'Database Systems', tests };
        },

        async testUIComponents() {
          const tests = [];
          
          // Test buttons
          const buttons = document.querySelectorAll('button');
          tests.push({
            name: 'Button Elements',
            status: buttons.length > 0 ? 'passed' : 'failed',
            details: `Found ${buttons.length} buttons`,
            category: 'UI'
          });

          // Test forms
          const forms = document.querySelectorAll('form, input, textarea');
          tests.push({
            name: 'Form Elements',
            status: forms.length > 0 ? 'passed' : 'warning',
            details: `Found ${forms.length} form elements`,
            category: 'UI'
          });

          return { category: 'UI Components', tests };
        },

        async testNetworkSystems() {
          const tests = [];
          
          tests.push({
            name: 'Network Connectivity',
            status: navigator.onLine ? 'passed' : 'failed',
            details: navigator.onLine ? 'Online' : 'Offline',
            category: 'Network'
          });

          return { category: 'Network Systems', tests };
        },

        async testRealTimeFeatures() {
          const tests = [];
          
          // Test quick actions
          tests.push({
            name: 'Quick Actions System',
            status: window.quickActions ? 'passed' : 'failed',
            details: window.quickActions ? 'Quick actions available' : 'System not found',
            category: 'RealTime'
          });

          // Test canvas metrics
          tests.push({
            name: 'Canvas Metrics System',
            status: window.canvasMetrics ? 'passed' : 'failed',
            details: window.canvasMetrics ? 'Metrics system active' : 'System not found',
            category: 'RealTime'
          });

          return { category: 'Real-Time Features', tests };
        },

        generateFix(failedTest) {
          return {
            id: `fix-${Date.now()}`,
            test: failedTest.name,
            strategy: `Fix ${failedTest.category.toLowerCase()} issue: ${failedTest.name}`,
            action: `Repair ${failedTest.name}`,
            priority: failedTest.category === 'AI' ? 'high' : 'medium',
            status: 'pending'
          };
        },

        generateStrategies(results) {
          return [
            {
              id: `strategy-${Date.now()}`,
              type: 'optimization',
              title: `System Health: ${results.testsPassed}/${results.testsRun} tests passing`,
              assignedTo: 'Master AI Controller',
              status: 'active'
            },
            {
              id: `strategy-${Date.now() + 1}`,
              type: 'repair',
              title: `Auto-repair: ${results.testsFailed} issues detected`,
              assignedTo: 'AI Repair System',
              status: 'processing'
            }
          ];
        },

        displayValidationResults(results) {
          console.log('📊 Validation Results:', results);
          this.updateValidationStatus(`✅ Validation complete: ${results.testsPassed}/${results.testsRun} tests passed`);
        },

        createLiveMonitoring(results) {
          // Create live monitoring panel
          const existingPanel = document.getElementById('live-validation-panel');
          if (existingPanel) existingPanel.remove();
          
          const panel = document.createElement('div');
          panel.id = 'live-validation-panel';
          panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 12px;
            padding: 16px;
            z-index: 1007;
            backdrop-filter: blur(10px);
            border: 1px solid #10b981;
          `;
          
          panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 style="margin: 0; color: #10b981;">🔴 Live Validation</h3>
              <button onclick="this.parentElement.parentElement.remove()" 
                      style="background: none; border: none; color: #9ca3af; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: bold; color: #10b981;">System Status:</div>
              <div style="color: #ffffff;">${results.testsPassed}/${results.testsRun} tests passing</div>
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: bold; color: #f59e0b;">Active Fixes:</div>
              ${results.fixes.map(fix => `
                <div style="background: rgba(245, 158, 11, 0.2); padding: 4px 8px; border-radius: 4px; margin: 2px 0; font-size: 10px;">
                  🔧 ${fix.strategy}
                </div>
              `).join('')}
            </div>
            
            <div style="margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: bold; color: #3b82f6;">AI Strategies:</div>
              ${results.strategies.map(strategy => `
                <div style="background: rgba(59, 130, 246, 0.2); padding: 4px 8px; border-radius: 4px; margin: 2px 0; font-size: 10px;">
                  🤖 ${strategy.title}
                </div>
              `).join('')}
            </div>
          `;
          
          document.body.appendChild(panel);
        }
      };
      
      console.log('✅ Created working system validator');
    }
  }

  fixValidateButtons() {
    // Find and fix all validate buttons
    const validateButtons = document.querySelectorAll('button[onclick*="validate"], button[onclick*="runFullSystemValidation"], .validate-btn');
    
    validateButtons.forEach(button => {
      // Remove old onclick handlers
      button.onclick = null;
      
      // Add working click handler
      button.addEventListener('click', () => {
        if (window.systemValidator) {
          window.systemValidator.runFullSystemValidation();
        }
      });
      
      console.log('🔧 Fixed validate button');
    });

    // Fix any buttons with broken references
    const brokenButtons = document.querySelectorAll('button:not([onclick]):not([data-fixed])');
    brokenButtons.forEach(button => {
      if (button.textContent.toLowerCase().includes('validate') || 
          button.textContent.toLowerCase().includes('test') ||
          button.textContent.toLowerCase().includes('check')) {
        
        button.addEventListener('click', () => {
          if (window.systemValidator) {
            window.systemValidator.runFullSystemValidation();
          }
        });
        
        button.dataset.fixed = 'true';
        console.log('🔧 Fixed broken validate button');
      }
    });
  }

  setupValidationMethods() {
    // Ensure all validation methods exist and work
    if (window.systemValidator) {
      // Add missing methods if they don't exist
      if (!window.systemValidator.testSpecificFeature) {
        window.systemValidator.testSpecificFeature = function() {
          console.log('🎯 Testing specific feature...');
          this.runFullSystemValidation();
        };
      }

      if (!window.systemValidator.showDetailedReport) {
        window.systemValidator.showDetailedReport = function() {
          console.log('📊 Showing detailed report...');
          const results = this.testResults || new Map();
          console.table(Array.from(results.entries()));
        };
      }

      if (!window.systemValidator.fixAllIssues) {
        window.systemValidator.fixAllIssues = async function() {
          console.log('🔧 Fixing all detected issues...');
          
          // Apply quick fixes
          if (window.quickActions) {
            await window.quickActions.executeAction('emergency-fix');
          }
          
          // Run validation again
          setTimeout(() => {
            this.runFullSystemValidation();
          }, 2000);
        };
      }
    }
  }
}

// Initialize the fix
const systemValidatorFix = new SystemValidatorFix();

console.log('🔧 System Validator Fix loaded and applied!');
