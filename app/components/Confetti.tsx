'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  onComplete: () => void;
}

export default function Confetti({ onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    animationDuration: number;
    delay: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Create particles in batches
    const createBatch = (startIndex: number, batchSize: number) => {
      const newParticles = Array.from({ length: batchSize }, (_, i) => ({
        id: startIndex + i,
        left: Math.random() * 100, // Random position across the width
        animationDuration: 3 + Math.random() * 2, // Random duration between 3-5 seconds
        delay: Math.random() * 0.3, // Random delay up to 0.3 seconds
        color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
      }));
      return newParticles;
    };

    // Create particles in batches of 10, with a delay between each batch
    const batchSize = 10;
    const totalBatches = 10;
    const batchDelay = 200; // in ms

    const timeouts: NodeJS.Timeout[] = [];
    
    Array.from({ length: totalBatches }, (_, batchIndex) => {
      const timeout = setTimeout(() => {
        setParticles(prev => [...prev, ...createBatch(batchIndex * batchSize, batchSize)]);
      }, batchIndex * batchDelay);
      timeouts.push(timeout);
    });

    // Call onComplete after all particles have fallen
    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // 5 seconds total

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full origin-center"
            style={{
              left: `${particle.left}%`,
              backgroundColor: particle.color,
              transform: 'scale(0)',
              animation: `appear 0.3s ease-out ${particle.delay}s forwards, fall ${particle.animationDuration}s linear ${particle.delay}s forwards, fadeOut 0.5s ease-out ${particle.animationDuration - 0.5}s forwards`,
            }}
          />
        ))}
      </div>
      <style jsx global>{`
        @keyframes appear {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
} 