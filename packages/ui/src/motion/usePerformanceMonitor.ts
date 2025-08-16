'use client';

import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  animationFrameTime: number;
  jank: boolean;
  smoothness: number;
}

interface PerformanceMonitorOptions {
  enabled?: boolean;
  targetFPS?: number;
  jankThreshold?: number;
  onPerformanceIssue?: (metrics: PerformanceMetrics) => void;
}

/**
 * Hook for monitoring animation performance
 * Detects jank and provides FPS metrics
 */
export function usePerformanceMonitor(options: PerformanceMonitorOptions = {}) {
  const {
    enabled = false, // Default to disabled to prevent unnecessary performance overhead
    targetFPS = 60,
    jankThreshold = 33, // ~30 FPS
    onPerformanceIssue,
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    animationFrameTime: 16.67,
    jank: false,
    smoothness: 100,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | undefined>(undefined);
  const isMonitoringRef = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      // Stop monitoring if disabled
      isMonitoringRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = undefined;
      }
      return;
    }

    let frameCount = 0;
    const frameTimes: number[] = [];
    const maxSamples = 60;

    const measureFrame = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Skip first frame as it's often unreliable
      if (frameCount > 0) {
        frameTimes.push(deltaTime);

        // Keep only recent samples
        if (frameTimes.length > maxSamples) {
          frameTimes.shift();
        }

        // Calculate metrics every 10 frames
        if (frameCount % 10 === 0 && frameTimes.length > 0) {
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const fps = 1000 / avgFrameTime;
          const jank = avgFrameTime > jankThreshold;
          const smoothness = Math.min(100, (targetFPS / fps) * 100);

          const newMetrics: PerformanceMetrics = {
            fps: Math.round(fps),
            animationFrameTime: Math.round(avgFrameTime * 100) / 100,
            jank,
            smoothness: Math.round(smoothness),
          };

          setMetrics(newMetrics);

          // Notify about performance issues
          if (jank && onPerformanceIssue) {
            onPerformanceIssue(newMetrics);
          }
        }
      }

      frameCount++;
      rafIdRef.current = requestAnimationFrame(measureFrame);
    };

    rafIdRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, targetFPS, jankThreshold, onPerformanceIssue]);

  return metrics;
}

/**
 * Hook for adaptive quality based on performance
 * Automatically adjusts animation complexity
 */
export function useAdaptiveQuality(options: { enabled?: boolean } = {}) {
  const { enabled = false } = options; // Default to false to avoid unnecessary overhead
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const performanceRef = useRef({ lowFPSCount: 0, highFPSCount: 0 });

  const metrics = usePerformanceMonitor({
    enabled, // Only monitor when explicitly enabled
    onPerformanceIssue: (m) => {
      performanceRef.current.lowFPSCount++;
      performanceRef.current.highFPSCount = 0;

      // Downgrade quality after consistent poor performance
      if (performanceRef.current.lowFPSCount > 5 && quality !== 'low') {
        setQuality(quality === 'high' ? 'medium' : 'low');
        performanceRef.current.lowFPSCount = 0;
      }
    },
  });

  useEffect(() => {
    // Check for quality upgrade opportunity
    if (metrics.fps > 55) {
      performanceRef.current.highFPSCount++;
      performanceRef.current.lowFPSCount = 0;

      // Upgrade quality after consistent good performance
      if (performanceRef.current.highFPSCount > 10 && quality !== 'high') {
        setQuality(quality === 'low' ? 'medium' : 'high');
        performanceRef.current.highFPSCount = 0;
      }
    }
  }, [metrics.fps, quality]);

  return {
    quality,
    metrics,
    isLowPerformance: quality === 'low',
    shouldSimplify: quality !== 'high',
  };
}
