// Enhanced Particles Background Animation with Refined Effects
class ParticlesBackground {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) {
            console.error('Particles canvas not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 150 };
        this.trails = [];
        this.maxTrails = 50;
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        // Increased particle count for richer background
        const particleCount = Math.min(400, Math.floor((window.innerWidth * window.innerHeight) / 2000));
        
        this.particles = [];
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1, // Slightly smaller particles
                speedX: Math.random() * 1 - 0.5, // Slower movement
                speedY: Math.random() * 1 - 0.5, // Slower movement
                color: this.getRandomColor(),
                type: Math.random() > 0.7 ? 'glow' : 'normal',
                opacity: Math.random() * 0.5 + 0.3,
                originalX: 0,
                originalY: 0,
                trail: []
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(139, 92, 246, 0.8)', // Purple
            'rgba(59, 130, 246, 0.8)', // Blue
            'rgba(236, 72, 153, 0.8)', // Pink
            'rgba(6, 182, 212, 0.8)',  // Cyan
            'rgba(16, 185, 129, 0.8)', // Green
            'rgba(245, 158, 11, 0.8)', // Yellow
            'rgba(249, 115, 22, 0.8)'  // Orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateParticles();
        this.drawParticles();
        this.drawConnections();
        requestAnimationFrame(() => this.animate());
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // Store original position for magnetic effect
            if (!particle.originalX || !particle.originalY) {
                particle.originalX = particle.x;
                particle.originalY = particle.y;
            }

            // Calculate distance to mouse
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Magnetic attraction effect - much slower response
            if (distance < this.mouse.radius * 2) {
                const force = (this.mouse.radius * 2 - distance) / (this.mouse.radius * 2);
                const angle = Math.atan2(dy, dx);
                
                // Move particles toward mouse with much slower easing
                particle.x -= Math.cos(angle) * force * 0.5; // Reduced from 2 to 0.5
                particle.y -= Math.sin(angle) * force * 0.5; // Reduced from 2 to 0.5
                
                // Add trail effect for particles near cursor
                if (distance < this.mouse.radius) {
                    particle.trail.push({x: particle.x, y: particle.y});
                    if (particle.trail.length > 5) {
                        particle.trail.shift();
                    }
                }
            } else {
                // Return to original position with smooth easing
                const returnSpeed = 0.02; // Slower return speed
                particle.x += (particle.originalX - particle.x) * returnSpeed;
                particle.y += (particle.originalY - particle.y) * returnSpeed;
                
                // Clear trail when moving away
                if (particle.trail.length > 0) {
                    particle.trail.shift();
                }
            }

            // Normal movement with boundaries - particles move freely
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off walls with natural movement
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
                particle.x = particle.x < 0 ? 0 : this.canvas.width;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
                particle.y = particle.y < 0 ? 0 : this.canvas.height;
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            // Draw particle trails
            if (particle.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
                
                for (let i = 1; i < particle.trail.length; i++) {
                    this.ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }
                
                this.ctx.strokeStyle = particle.color.replace('0.8', '0.1');
                this.ctx.lineWidth = 0.5; // Thinner trails
                this.ctx.stroke();
            }

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Enhanced glow effects based on proximity to cursor
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                // Rich glow when near cursor
                const glowIntensity = 1 - (distance / this.mouse.radius);
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 30 + glowIntensity * 50; // Increased glow
                this.ctx.globalAlpha = particle.opacity + glowIntensity * 0.7; // Enhanced alpha
                
                // Make particles slightly larger when glowing
                const glowSize = particle.size * (1 + glowIntensity * 0.3);
                this.ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            } else if (particle.type === 'glow') {
                // Normal glow for glow particles
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 15;
                this.ctx.globalAlpha = particle.opacity;
            } else {
                this.ctx.shadowBlur = 0;
                this.ctx.globalAlpha = particle.opacity * 0.7;
            }
            
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Reset effects
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
        });
    }

    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    
                    // Enhanced connection glow when near cursor
                    const mouseDx1 = this.particles[i].x - this.mouse.x;
                    const mouseDy1 = this.particles[i].y - this.mouse.y;
                    const mouseDistance1 = Math.sqrt(mouseDx1 * mouseDx1 + mouseDy1 * mouseDy1);
                    
                    const mouseDx2 = this.particles[j].x - this.mouse.x;
                    const mouseDy2 = this.particles[j].y - this.mouse.y;
                    const mouseDistance2 = Math.sqrt(mouseDx2 * mouseDx2 + mouseDy2 * mouseDy2);
                    
                    // Make connection lines more subtle and thinner
                    let connectionOpacity = opacity * 0.08; // Even more reduced opacity
                    let connectionWidth = 0.3; // Even thinner lines
                    
                    // Slightly brighter connections when cursor is near
                    if (mouseDistance1 < this.mouse.radius || mouseDistance2 < this.mouse.radius) {
                        const glowFactor = Math.max(
                            1 - (mouseDistance1 / this.mouse.radius),
                            1 - (mouseDistance2 / this.mouse.radius)
                        );
                        connectionOpacity += glowFactor * 0.15; // Reduced effect
                        connectionWidth += glowFactor * 0.5; // Reduced width increase
                    }
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${connectionOpacity})`;
                    this.ctx.lineWidth = connectionWidth;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            // Don't reset mouse position to 0,0 when mouse leaves
            // This prevents particles from moving to top-left corner
        });
    }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const particlesBackground = new ParticlesBackground();
});
