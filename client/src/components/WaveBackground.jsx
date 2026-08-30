import React, { useEffect, useRef } from 'react';

const WaveBackground = ({ backdropBlurAmount = 'md', className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let step = 0;

    const waves = [
      { amplitude: 50, wavelength: 0.006, speed: 0.015, colorStops: ['rgba(37, 99, 235, 0.35)', 'rgba(79, 70, 229, 0.15)'], yOffset: 0.35 },
      { amplitude: 70, wavelength: 0.004, speed: 0.01, colorStops: ['rgba(14, 165, 233, 0.30)', 'rgba(37, 99, 235, 0.10)'], yOffset: 0.45 },
      { amplitude: 45, wavelength: 0.009, speed: 0.02, colorStops: ['rgba(99, 102, 241, 0.25)', 'rgba(168, 85, 247, 0.10)'], yOffset: 0.55 },
      { amplitude: 60, wavelength: 0.005, speed: 0.012, colorStops: ['rgba(59, 130, 246, 0.28)', 'rgba(14, 165, 233, 0.12)'], yOffset: 0.65 },
      { amplitude: 35, wavelength: 0.011, speed: 0.022, colorStops: ['rgba(96, 165, 250, 0.20)', 'rgba(30, 58, 138, 0.25)'], yOffset: 0.75 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      step += 1;

      waves.forEach((wave) => {
        ctx.beginPath();

        const baseHeight = canvas.height * wave.yOffset;
        const grad = ctx.createLinearGradient(0, baseHeight - wave.amplitude, canvas.width, canvas.height);
        grad.addColorStop(0, wave.colorStops[0]);
        grad.addColorStop(1, wave.colorStops[1]);

        ctx.fillStyle = grad;

        ctx.moveTo(0, canvas.height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= canvas.width; x += 4) {
          const y = baseHeight + Math.sin(x * wave.wavelength + step * wave.speed) * wave.amplitude + Math.cos(x * 0.002 + step * 0.005) * 15;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const blurClasses = {
    none: 'backdrop-blur-none',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
    '3xl': 'backdrop-blur-3xl',
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className={`absolute inset-0 bg-dark-900/60 ${blurClasses[backdropBlurAmount] || 'backdrop-blur-md'}`} />
    </div>
  );
};

export default WaveBackground;
