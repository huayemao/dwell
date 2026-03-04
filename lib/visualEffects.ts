export type Particle = any;

export interface VisualEffect {
  init: (canvas: HTMLCanvasElement, particles: Particle[]) => void;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: Particle[], time: number) => void;
}

export const visualEffects: Record<string, VisualEffect> = {
  rain: {
    init: (canvas, particles) => {
      for (let i = 0; i < 200; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 10 + 15,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(10, 15, 20, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#a0b0c0';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length * 0.2, p.y + p.length);
        ctx.stroke();

        p.y += p.speed;
        p.x -= p.speed * 0.2;

        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width + 100;
        }
      });
      ctx.globalAlpha = 1;
    }
  },
  ocean: {
    init: () => {},
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(5, 15, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(20, 40, 60, 0.05)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = canvas.height * 0.7 + Math.sin(x * 0.005 + time) * 50 + Math.sin(x * 0.01 + time * 1.5) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      ctx.fillStyle = 'rgba(25, 50, 75, 0.05)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 20) {
        const y = canvas.height * 0.8 + Math.sin(x * 0.004 - time * 0.8) * 60 + Math.sin(x * 0.015 - time * 1.2) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();
    }
  },
  fireplace: {
    init: (canvas, particles) => {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() * 400 - 200),
          y: canvas.height + Math.random() * 200,
          size: Math.random() * 4 + 1,
          speedY: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          life: Math.random() * 100 + 50,
          maxLife: 150
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(15, 5, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height, 0, canvas.width/2, canvas.height, 400);
      gradient.addColorStop(0, 'rgba(200, 50, 0, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.life--;
        if (p.life <= 0) {
          p.x = canvas.width / 2 + (Math.random() * 400 - 200);
          p.y = canvas.height + 10;
          p.life = Math.random() * 100 + 50;
          p.maxLife = p.life;
        }

        p.y -= p.speedY;
        p.x += p.speedX;
        
        const ratio = p.life / p.maxLife;
        ctx.fillStyle = `rgba(255, ${150 * ratio}, 0, ${ratio})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  },
  forest: {
    init: (canvas, particles) => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.5 + 0.2,
          speedX: Math.random() * 0.5 - 0.25,
          angle: Math.random() * Math.PI * 2,
          spin: Math.random() * 0.05 - 0.025
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(10, 20, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(150, 200, 150, 0.02)';
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.2, 0);
      ctx.lineTo(canvas.width * 0.8, 0);
      ctx.lineTo(canvas.width * 0.6 + Math.sin(time)*100, canvas.height);
      ctx.lineTo(canvas.width * 0.4 + Math.sin(time)*100, canvas.height);
      ctx.fill();

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.05) * 0.5;
        p.angle += p.spin;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = 'rgba(50, 100, 50, 0.5)';
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }
  },
  thunderstorm: {
    init: (canvas, particles) => {
      for (let i = 0; i < 250; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 30 + 15,
          speed: Math.random() * 15 + 20,
          opacity: Math.random() * 0.6 + 0.2
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      const isLightning = Math.random() < 0.02;
      ctx.fillStyle = isLightning ? 'rgba(200, 220, 255, 0.8)' : 'rgba(5, 10, 15, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#b0c0d0';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length * 0.3, p.y + p.length);
        ctx.stroke();

        p.y += p.speed;
        p.x -= p.speed * 0.3;

        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width + 200;
        }
      });
      ctx.globalAlpha = 1;
    }
  },
  winter_cabin: {
    init: (canvas, particles) => {
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 1 + 0.5,
          speedX: Math.random() * 1 - 0.5,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(10, 15, 25, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * 2 + p.y * 0.01) * 0.5;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
      });
    }
  },
  night_crickets: {
    init: (canvas, particles) => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedY: Math.random() * 0.2 - 0.1,
          speedX: Math.random() * 0.2 - 0.1,
          opacity: Math.random(),
          blinkSpeed: Math.random() * 0.05 + 0.01
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.opacity += p.blinkSpeed;
        if (p.opacity > 1 || p.opacity < 0) p.blinkSpeed *= -1;

        ctx.fillStyle = `rgba(200, 255, 200, ${Math.max(0, p.opacity)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
      });
    }
  },
  custom: {
    init: (canvas, particles) => {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speedY: Math.random() * 0.5 - 0.25,
          speedX: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    },
    draw: (ctx, canvas, particles, time) => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = `rgba(200, 200, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
};
