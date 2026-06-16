import { useState, useRef } from 'react';

const GLYPHS = [
  { id: 'crane', emoji: '🏗️', label: 'Crane' },
  { id: 'rebar', emoji: '🔩', label: 'Rebar' },
  { id: 'blueprint', emoji: '📐', label: 'Blueprint' },
  { id: 'hardhat', emoji: '⛑️', label: 'Hard Hat' },
];

/** Pick a random glyph as the round's target. */
function pickTarget() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/** Shuffle the 4 glyphs into option order (all 4 always shown, one matches). */
function shuffle(arr) {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/**
 * BlueprintTask
 * "Check the blueprint" mini-game — shows a target glyph and 4 option tiles;
 * the player taps the option matching the target. No role awareness.
 *
 * @param {object} props
 * @param {(didFinish: boolean) => void} props.onComplete - Called once with
 *   true if the matching tile was tapped, false if a wrong tile was tapped.
 */
export default function BlueprintTask({ onComplete }) {
  const targetRef = useRef(pickTarget());
  const optionsRef = useRef(shuffle(GLYPHS));
  const target = targetRef.current;
  const options = optionsRef.current;

  const [selectedId, setSelectedId] = useState(null);
  const locked = selectedId !== null;

  const handleSelect = glyph => {
    if (locked) return;
    setSelectedId(glyph.id);
    const correct = glyph.id === target.id;
    setTimeout(() => onComplete(correct), 500);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Check the Blueprint</h2>
      <p style={styles.instructions}>Tap the option that matches the symbol</p>

      <div style={styles.targetBox}>
        <div style={styles.targetGlyph} aria-hidden="true">{target.emoji}</div>
        <p style={styles.targetLabel}>?</p>
      </div>

      <div style={styles.optionsGrid}>
        {options.map(glyph => {
          const isSelected = selectedId === glyph.id;
          const isCorrectTarget = glyph.id === target.id;
          let tileStyle = styles.tile;
          if (isSelected) {
            tileStyle = isCorrectTarget
              ? { ...styles.tile, ...styles.tileCorrect }
              : { ...styles.tile, ...styles.tileWrong };
          } else if (locked && isCorrectTarget) {
            tileStyle = { ...styles.tile, ...styles.tileCorrect };
          }

          return (
            <button
              key={glyph.id}
              type="button"
              onClick={() => handleSelect(glyph)}
              disabled={locked}
              style={tileStyle}
              aria-label={glyph.label}
            >
              <span style={styles.tileGlyph} aria-hidden="true">{glyph.emoji}</span>
            </button>
          );
        })}
      </div>
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
  targetBox: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    border: '3px solid #F5C800',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  targetGlyph: {
    fontSize: 40,
  },
  targetLabel: {
    margin: 0,
    fontSize: 12,
    color: '#6B7280',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    width: '100%',
    maxWidth: 280,
  },
  tile: {
    minWidth: 48,
    minHeight: 64,
    borderRadius: 14,
    border: '3px solid #FFFFFF',
    backgroundColor: '#0E2A7E',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
  },
  tileGlyph: {
    fontSize: 36,
  },
  tileCorrect: {
    backgroundColor: '#0E2A7E',
    borderColor: '#F5C800',
  },
  tileWrong: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
};
