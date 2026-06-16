import { useState, useRef, useCallback } from 'react';

/** Waypoints the player must swipe through, in order. Generous radius for kid-friendly play. */
const WAYPOINTS = [
  { x: 30, y: 80 },
  { x: 90, y: 30 },
  { x: 150, y: 100 },
  { x: 210, y: 30 },
  { x: 270, y: 80 },
];
const HIT_RADIUS = 32;

/**
 * PermitTask
 * "Sign the permit" mini-game — drag a finger/pointer across a dotted
 * signature path. Completion is lenient; just hit most waypoints in order.
 *
 * @param {object} props
 * @param {(didFinish: boolean) => void} props.onComplete - Called once when
 *   the player lifts their pointer after reaching enough waypoints, or
 *   reports false if they give up / lift too early without progress.
 */
export default function PermitTask({ onComplete }) {
  const [visited, setVisited] = useState(() => new Array(WAYPOINTS.length).fill(false));
  const [isDrawing, setIsDrawing] = useState(false);
  const finishedRef = useRef(false);
  const svgRef = useRef(null);

  const finish = useCallback(
    didFinish => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onComplete(didFinish);
    },
    [onComplete]
  );

  const checkPoint = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = 300 / rect.width;
      const scaleY = 120 / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;

      setVisited(prev => {
        let changed = false;
        const next = prev.map((v, i) => {
          if (v) return v;
          const wp = WAYPOINTS[i];
          const dist = Math.hypot(wp.x - x, wp.y - y);
          if (dist <= HIT_RADIUS) {
            changed = true;
            return true;
          }
          return v;
        });
        if (!changed) return prev;
        const visitedCount = next.filter(Boolean).length;
        // Lenient: hitting 4 of 5 waypoints completes the signature.
        if (visitedCount >= WAYPOINTS.length - 1) {
          finish(true);
        }
        return next;
      });
    },
    [finish]
  );

  const handlePointerDown = e => {
    setIsDrawing(true);
    checkPoint(e.clientX, e.clientY);
  };
  const handlePointerMove = e => {
    if (!isDrawing) return;
    checkPoint(e.clientX, e.clientY);
  };
  const handlePointerUp = () => {
    setIsDrawing(false);
    const visitedCount = visited.filter(Boolean).length;
    if (visitedCount < WAYPOINTS.length - 1) {
      // Give the kid another chance instead of insta-failing on a light tap.
      return;
    }
    finish(true);
  };

  const handleGiveUp = () => finish(false);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign the Permit</h2>
      <p style={styles.instructions}>Drag your finger along the dotted line</p>

      <svg
        ref={svgRef}
        viewBox="0 0 300 120"
        style={styles.signatureBox}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <rect x="0" y="0" width="300" height="120" rx="12" fill="#FFFFFF" />
        <polyline
          points={WAYPOINTS.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#6B7280"
          strokeWidth="3"
          strokeDasharray="8 8"
        />
        {WAYPOINTS.map((wp, i) => (
          <circle
            key={i}
            cx={wp.x}
            cy={wp.y}
            r={visited[i] ? 12 : 9}
            fill={visited[i] ? '#F5C800' : '#0E2A7E'}
            stroke="#0E2A7E"
            strokeWidth="2"
          />
        ))}
      </svg>

      <p style={styles.progress}>
        {visited.filter(Boolean).length} / {WAYPOINTS.length} waypoints
      </p>

      <button type="button" onClick={handleGiveUp} style={styles.skipButton}>
        I can't sign it
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    padding: '8px 16px',
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#FFFFFF',
    margin: '0 0 4px 0',
  },
  instructions: {
    fontSize: 14,
    color: '#D1D5DB',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  signatureBox: {
    width: '100%',
    maxWidth: 300,
    height: 'auto',
    aspectRatio: '300 / 120',
    borderRadius: 12,
    touchAction: 'none',
    userSelect: 'none',
  },
  progress: {
    fontSize: 14,
    color: '#F5C800',
    fontWeight: 700,
    margin: '12px 0',
  },
  skipButton: {
    minHeight: 48,
    padding: '0 20px',
    fontSize: 14,
    fontWeight: 600,
    border: '2px solid #6B7280',
    borderRadius: 10,
    backgroundColor: 'transparent',
    color: '#D1D5DB',
    cursor: 'pointer',
  },
};
