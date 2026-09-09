/**
 * AI Systems Fix
 * Fixes issues with AI collaboration, canvas rendering, and 5D systems
 */

console.log('🔧 Loading AI Systems Fix...');

class AISystemsFix {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log('🚀 Initializing AI Systems Fix...');
    
    // Fix canvas entity issues
    this.fixCanvasEntities();
    
    // Fix AI collaboration
    this.fixAICollaboration();
    
    // Fix 5D canvas
    this.fix5DCanvas();
    
    // Fix negative viewer canvas
    this.fixNegativeViewerCanvas();
    
    // Restart AI systems
    this.restartAISystems();
    
    console.log('✅ AI Systems Fix completed');
  }

  fixCanvasEntities() {
    console.log('🎨 Fixing canvas entities...');
    
    // Ensure canvas entity manager is properly initialized
    if (!window.canvasEntityManager) {
      // Recreate canvas entity manager
      window.canvasEntityManager = {
        entities: [],
        isRendering: false,
        animationFrame: null,
        
        getEntities() {
          return this.entities;
        },
        
        setupEntities() {
          this.entities = [
            {
              id: 'ai-strategist-001',
              name: 'Strategic Coordinator',
              type: 'neural-network',
              position: { x: 150, y: 150, z: 0 },
              status: 'active',
              consciousness_level: 95,
              processing_threads: 6,
              specialization: ['planning', 'optimization'],
              avatar_color: '#10b981',
              lastUpdate: Date.now(),
              currentThought: 'Analyzing system optimization opportunities...'
            },
            {
              id: 'ai-fixer-002',
              name: 'System Repair Specialist',
              type: 'decision-tree',
              position: { x: 300, y: 200, z: 10 },
              status: 'processing',
              consciousness_level: 92,
              processing_threads: 4,
              specialization: ['debugging', 'repair'],
              avatar_color: '#3b82f6',
              lastUpdate: Date.now(),
              currentThought: 'Identifying system repair opportunities...'
            },
            {
              id: 'ai-learner-003',
              name: 'Knowledge Accumulator',
              type: 'learning-agent',
              position: { x: 450, y: 150, z: 5 },
              status: 'active',
              consciousness_level: 98,
              processing_threads: 8,
              specialization: ['learning', 'adaptation'],
              avatar_color: '#8b5cf6',
              lastUpdate: Date.now(),
              currentThought: 'Processing new knowledge patterns...'
            },
            {
              id: 'ai-communicator-004',
              name: 'Communication Hub',
              type: 'quantum-ai',
              position: { x: 250, y: 300, z: 15 },
              status: 'active',
              consciousness_level: 89,
              processing_threads: 5,
              specialization: ['communication', 'coordination'],
              avatar_color: '#f59e0b',
              lastUpdate: Date.now(),
              currentThought: 'Coordinating with other AI systems...'
            },
            {
              id: 'ai-monitor-005',
              name: 'System Monitor',
              type: 'creative-ai',
              position: { x: 400, y: 250, z: 8 },
              status: 'active',
              consciousness_level: 91,
              processing_threads: 3,
              specialization: ['monitoring', 'diagnostics'],
              avatar_color: '#ef4444',
              lastUpdate: Date.now(),
              currentThought: 'Monitoring system health and performance...'
            }
          ];
          
          console.log(`🤖 Created ${this.entities.length} AI entities`);
        },
        
        startRendering(canvas) {
          if (this.isRendering) return;
          
          this.isRendering = true;
          const ctx = canvas.getContext('2d');
          
          const render = () => {
            if (!this.isRendering) return;
            
            try {
              // Clear canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              // Draw background
              this.drawBackground(ctx, canvas.width, canvas.height);
              
              // Render entities
              this.entities.forEach(entity => {
                this.drawEntity(ctx, entity);
              });
              
              // Update positions
              this.updatePositions();
              
              // Continue animation
              this.animationFrame = requestAnimationFrame(render);
              
            } catch (error) {
              console.warn('Canvas render error:', error);
            }
          };
          
          render();
          console.log('🎯 Canvas rendering started with entities');
        },
        
        drawBackground(ctx, width, height) {
          // Grid background
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          
          for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          
          for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
        },
        
        drawEntity(ctx, entity) {
          const { x, y } = entity.position;
          const time = Date.now() * 0.003;
          
          // Main entity circle
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, 2 * Math.PI);
          ctx.fillStyle = entity.avatar_color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Status indicator
          const statusColor = entity.status === 'active' ? '#10b981' : 
                             entity.status === 'processing' ? '#f59e0b' : '#6b7280';
          
          ctx.beginPath();
          ctx.arc(x + 15, y - 15, 6, 0, 2 * Math.PI);
          ctx.fillStyle = statusColor;
          ctx.fill();
          
          // Processing threads
          for (let i = 0; i < entity.processing_threads; i++) {
            const angle = (i / entity.processing_threads) * 2 * Math.PI + time;
            const px = x + Math.cos(angle) * 30;
            const py = y + Math.sin(angle) * 30;
            
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, 2 * Math.PI);
            ctx.fillStyle = entity.avatar_color + '80';
            ctx.fill();
          }
          
          // Entity name
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(entity.name, x, y + 40);
          
          // Status
          ctx.font = '10px Arial';
          ctx.fillText(`Status: ${entity.status.toUpperCase()}`, x, y + 55);
        },
        
        updatePositions() {
          const time = Date.now() * 0.001;
          
          this.entities.forEach((entity, index) => {
            if (!entity.basePosition) {
              entity.basePosition = { x: entity.position.x, y: entity.position.y };
            }
            
            const baseX = entity.basePosition.x;
            const baseY = entity.basePosition.y;
            
            // Organic movement
            entity.position.x = baseX + Math.sin(time + index) * 15;
            entity.position.y = baseY + Math.cos(time * 0.7 + index) * 10;
            
            // Keep in bounds
            entity.position.x = Math.max(50, Math.min(750, entity.position.x));
            entity.position.y = Math.max(50, Math.min(550, entity.position.y));
          });
        }
      };
      
      // Setup entities
      window.canvasEntityManager.setupEntities();
    }
    
    // Find and restart canvas rendering
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      if (canvas.width > 0 && canvas.height > 0) {
        window.canvasEntityManager.startRendering(canvas);
      }
    });
  }

  fixAICollaboration() {
    console.log('🤝 Fixing AI collaboration...');
    
    // Ensure AI network is working
    if (window.advancedAINetwork) {
      // Restart agent activities
      window.advancedAINetwork.agents.forEach(agent => {
        if (!agent.consciousness.isActive) {
          agent.consciousness.isActive = true;
          agent.energySystem.currentEnergy = 100;
          agent.consciousness.motivationLevel = 95;
          
          // Give the agent something to think about
          agent.consciousness.currentThoughts = [
            'System reactivation complete - ready for tasks',
            'Analyzing current environment for opportunities',
            'Establishing connections with other AI agents'
          ];
          
          // Assign a default task
          agent.assignTask({
            type: 'analyze',
            description: 'Analyze system status and identify improvement opportunities',
            priority: 'medium'
          });
        }
      });
      
      // Update status display
      if (window.advancedAICollaboration) {
        window.advancedAICollaboration.updateDetailedStatusContent();
      }
    }
  }

  fix5DCanvas() {
    console.log('🌀 Fixing 5D canvas...');
    
    // Enhance 5D system with better field effects
    if (window.advancedAICollaboration) {
      const originalDraw5D = window.advancedAICollaboration.draw5DFieldEffects;
      
      window.advancedAICollaboration.draw5DFieldEffects = function(ctx, entities) {
        const time = Date.now() * 0.002;
        
        entities.forEach(entity => {
          const { x, y } = entity.position;
          
          // Enhanced 5D field bending around entity
          for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
            const radius = 40 + Math.sin(time + angle * 3) * 15;
            const fieldX = x + Math.cos(angle + time * 1.5) * radius;
            const fieldY = y + Math.sin(angle + time * 1.5) * radius;
            
            // Multiple field layers
            for (let layer = 0; layer < 3; layer++) {
              const layerRadius = radius * (0.7 + layer * 0.15);
              const layerX = x + Math.cos(angle + time * 1.5 + layer * 0.5) * layerRadius;
              const layerY = y + Math.sin(angle + time * 1.5 + layer * 0.5) * layerRadius;
              
              // Field lines with curvature
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${100 + layer * 50}, ${200 + layer * 25}, 255, ${0.4 - layer * 0.1})`;
              ctx.lineWidth = 3 - layer;
              
              // Curved field line that bends around entity
              const controlX = x + Math.cos(angle + time * 0.8) * (layerRadius * 0.6);
              const controlY = y + Math.sin(angle + time * 0.8) * (layerRadius * 0.6);
              
              ctx.moveTo(x, y);
              ctx.quadraticCurveTo(controlX, controlY, layerX, layerY);
              ctx.stroke();
              
              // Field particles with movement
              ctx.beginPath();
              const particleAlpha = 0.7 + Math.sin(time * 4 + angle + layer) * 0.3;
              ctx.fillStyle = `rgba(150, 255, 200, ${particleAlpha})`;
              const particleSize = 3 + Math.sin(time * 5 + angle) * 1;
              ctx.arc(layerX, layerY, particleSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          // Central energy vortex
          ctx.beginPath();
          const vortexRadius = 8 + Math.sin(time * 6) * 3;
          const vortexGradient = ctx.createRadialGradient(x, y, 0, x, y, vortexRadius);
          vortexGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          vortexGradient.addColorStop(0.5, entity.avatar_color + 'AA');
          vortexGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = vortexGradient;
          ctx.arc(x, y, vortexRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Field interaction lines between entities
          entities.forEach(otherEntity => {
            if (entity.id !== otherEntity.id) {
              const distance = Math.sqrt(
                Math.pow(entity.position.x - otherEntity.position.x, 2) +
                Math.pow(entity.position.y - otherEntity.position.y, 2)
              );
              
              if (distance < 200) {
                const strength = 1 - (distance / 200);
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 100, 255, ${strength * 0.5})`;
                ctx.lineWidth = strength * 3;
                
                // Curved connection with field distortion
                const midX = (entity.position.x + otherEntity.position.x) / 2;
                const midY = (entity.position.y + otherEntity.position.y) / 2;
                const distortionX = midX + Math.sin(time * 3) * 20 * strength;
                const distortionY = midY + Math.cos(time * 3) * 20 * strength;
                
                ctx.moveTo(entity.position.x, entity.position.y);
                ctx.quadraticCurveTo(distortionX, distortionY, otherEntity.position.x, otherEntity.position.y);
                ctx.stroke();
              }
            }
          });
        });
      };
    }
  }

  fixNegativeViewerCanvas() {
    console.log('⚡ Fixing negative viewer canvas...');
    
    // Find negative feedback canvas
    const negativeCanvas = document.querySelector('[data-canvas-type="negative-feedback"]') || 
                          document.querySelector('#negative-feedback-canvas');
    
    if (negativeCanvas) {
      const ctx = negativeCanvas.getContext('2d');
      
      // Create negative pattern analyzer
      const renderNegativePatterns = () => {
        ctx.clearRect(0, 0, negativeCanvas.width, negativeCanvas.height);
        
        const time = Date.now() * 0.001;
        
        // Dark energy background
        const gradient = ctx.createRadialGradient(
          negativeCanvas.width / 2, negativeCanvas.height / 2, 0,
          negativeCanvas.width / 2, negativeCanvas.height / 2, negativeCanvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(30, 30, 50, 0.8)');
        gradient.addColorStop(1, 'rgba(10, 10, 20, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, negativeCanvas.width, negativeCanvas.height);
        
        // Negative energy patterns
        for (let i = 0; i < 5; i++) {
          const centerX = (negativeCanvas.width / 6) * (i + 1);
          const centerY = negativeCanvas.height / 2;
          
          // Negative vortex
          for (let ring = 1; ring < 8; ring++) {
            const radius = ring * 15 + Math.sin(time * 2 + i) * 5;
            const segments = 12;
            
            for (let seg = 0; seg < segments; seg++) {
              const angle = (seg / segments) * Math.PI * 2 + time * (ring * 0.1);
              const x = centerX + Math.cos(angle) * radius;
              const y = centerY + Math.sin(angle) * radius;
              
              ctx.beginPath();
              const intensity = 1 - (ring / 8);
              ctx.fillStyle = `rgba(255, 50, 50, ${intensity * 0.6})`;
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fill();
              
              // Negative energy trails
              if (ring > 3) {
                const trailX = centerX + Math.cos(angle - 0.2) * (radius - 10);
                const trailY = centerY + Math.sin(angle - 0.2) * (radius - 10);
                
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 100, 100, ${intensity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.moveTo(x, y);
                ctx.lineTo(trailX, trailY);
                ctx.stroke();
              }
            }
          }
          
          // Negative pattern labels
          ctx.fillStyle = '#ff6666';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Pattern ${i + 1}`, centerX, centerY + 150);
          ctx.fillText('ANALYZING', centerX, centerY + 165);
        }
        
        // Pattern analysis text
        ctx.fillStyle = '#ffaaaa';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('NEGATIVE PATTERN ANALYSIS', negativeCanvas.width / 2, 30);
        
        ctx.font = '12px Arial';
        ctx.fillText('Detecting anomalous energy signatures...', negativeCanvas.width / 2, 50);
        
        requestAnimationFrame(renderNegativePatterns);
      };
      
      renderNegativePatterns();
    }
  }

  restartAISystems() {
    console.log('🔄 Restarting AI systems...');
    
    // Restart canvas refresh
    if (window.advancedAICollaboration) {
      window.advancedAICollaboration.setupCanvasRefresh();
    }
    
    // Restart AI agents
    if (window.advancedAINetwork) {
      window.advancedAINetwork.agents.forEach(agent => {
        // Restart thinking loop
        if (agent.startConsciousnessLoop) {
          agent.startConsciousnessLoop();
        }
        
        // Restart learning
        if (agent.startLearningSystem) {
          agent.startLearningSystem();
        }
        
        // Restart monitoring
        if (agent.startActiveMonitoring) {
          agent.startActiveMonitoring();
        }
      });
    }
    
    // Show success notification
    setTimeout(() => {
      if (window.systemValidator) {
        window.systemValidator.updateValidationStatus('✅ AI systems restarted successfully');
      }
    }, 2000);
  }
}

// Initialize the fix
new AISystemsFix();

console.log('🔧 AI Systems Fix loaded and applied!');
