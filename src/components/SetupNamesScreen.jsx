import { useState } from 'react';

/**
 * SetupNamesScreen
 * First screen of the game — collects 3 player names before the game starts.
 *
 * @param {object} props
 * @param {(names: string[]) => void} props.onStart - Called with an array of exactly
 *   3 trimmed player names (falls back to "Player N" for any left blank).
 */
export default function SetupNamesScreen({ onStart }) {
  const [names, setNames] = useState(['', '', '']);

  const handleChange = (index, value) => {
    setNames(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const canStart = names.some(n => n.trim().length > 0);

  const handleStart = () => {
    const finalNames = names.map((n, i) => (n.trim() ? n.trim() : `Player ${i + 1}`));
    onStart(finalNames);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hardHat} aria-hidden="true">🏗️</div>
      <h1 style={styles.title}>Site Crew Showdown</h1>
      <p style={styles.subtitle}>Enter the names of your 3-person crew</p>

      <div style={styles.form}>
        {names.map((name, i) => (
          <input
            key={i}
            type="text"
            value={name}
            onChange={e => handleChange(i, e.target.value)}
            placeholder={`Crew Member ${i + 1}`}
            maxLength={20}
            style={styles.input}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={!canStart}
        style={{
          ...styles.button,
          ...(canStart ? {} : styles.buttonDisabled),
        }}
      >
        Start Game
      </button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    minWidth: 375,
    boxSizing: 'border-box',
    backgroundColor: '#0E2A7E',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  hardHat: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    textAlign: 'center',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: 16,
    color: '#F5C800',
    textAlign: 'center',
    margin: '0 0 32px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    maxWidth: 320,
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 48,
    fontSize: 18,
    padding: '12px 16px',
    borderRadius: 10,
    border: '2px solid #F5C800',
    backgroundColor: '#FFFFFF',
    color: '#0E2A7E',
  },
  button: {
    marginTop: 32,
    width: '100%',
    maxWidth: 320,
    minHeight: 56,
    fontSize: 20,
    fontWeight: 700,
    border: 'none',
    borderRadius: 12,
    backgroundColor: '#F5C800',
    color: '#0E2A7E',
    cursor: 'pointer',
    transition: 'transform 0.15s ease, opacity 0.15s ease',
  },
  buttonDisabled: {
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
};
