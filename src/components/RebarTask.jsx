import { useState, useEffect, useRef, useCallback } from 'react';

const SPOT_COUNT = 5;
const COUNTDOWN_SECONDS = 5;

/**
 * RebarTask
 * "Inspect the rebar" mini-game — tap all 5 glowing spots before the
 * countdown reaches zero. No role awareness; purely reports completion.
 *
 * @param {object} props
 * @param {(didFinish: boolean) => void} props.onComplete - Called once with
 *   true if all spots were tapped before time ran out, false on timeout.
 */
export default function RebarTask({ onComplete }) {
  const [tapped, setTapped] = useState(() => new Array(SPOT_COUNT).fill(false));
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const finishedRef = useRef(false);

  const finish = useCallback(
    didFinish => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onComplete(didFinish);
    },
    [onComplete]
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      finish(false);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, finish]);

  const handleTap = index => {
    if (finishedRef.current) return;
    setTapped(prev => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      if (next.every(Boolean)) {
        finish(true);
      }
      return next;
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Inspect the Rebar</h2>
      <p style={styles.instructions}>Tap all 5 glowing spots before time runs out!</p>
      <div style={styles.timer}>{secondsLeft}s</div>

      <div style={styles.grid}>
        {tapped.map((isTapped, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleTap(i)}
            disabled={isTapped}
            aria-label={`Rebar spot ${i + 1}`}
            style={{
              ...styles.spot,
              ...(isTapped ? styles.spotTapped : styles.spotGlowing),
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes rebarGlow {
          0%, 100% { box-shadow: 0 0 8px 4px rgba(245, 200, 0, 0.6); }
          50% { box-shadow: 0 0 18px 10px rgba(245, 200, 0, 0.95); }
        }
      `}</style>
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
    margin: '0 0 12px 0',
    textAlign: 'center',
  },
  timer: {
    fontSize: 32,
    fontWeight: 800,
    color: '#F5C800',
    marginBottom: 20,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    width: '100%',
    maxWidth: 280,
  },
  spot: {
    width: 64,
    height: 64,
    minWidth: 48,
    minHeight: 48,
    borderRadius: '50%',
    border: '3px solid #F5C800',
    cursor: 'pointer',
  },
  spotGlowing: {
    backgroundColor: '#6B7280',
    animation: 'rebarGlow 0.9s ease-in-out infinite',
  },
  spotTapped: {
    backgroundColor: '#0E2A7E',
    boxShadow: 'none',
    opacity: 0.6,
  },
};
