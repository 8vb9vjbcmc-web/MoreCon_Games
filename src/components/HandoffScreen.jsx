/**
 * HandoffScreen
 * Sacred pass-and-play gate. Shown between every private reveal so the device
 * can be physically handed to the next player without spoiling secrets.
 *
 * @param {object} props
 * @param {string} props.playerName - Name of the player who should receive the device.
 * @param {string} props.actionLabel - Short description of what happens next,
 *   e.g. "see your role" or "do your task".
 * @param {() => void} props.onReady - Called when that player taps the ready button.
 */
export default function HandoffScreen({ playerName, actionLabel, onReady }) {
  return (
    <div style={styles.container}>
      <div style={styles.icon} aria-hidden="true">🏗️</div>
      <p style={styles.passLabel}>Pass the device to</p>
      <h1 style={styles.name}>{playerName}</h1>
      <p style={styles.lookAway}>Everyone else, look away!</p>
      {actionLabel ? <p style={styles.actionLabel}>{actionLabel}</p> : null}

      <button type="button" onClick={onReady} style={styles.button}>
        I'm {playerName} — Ready
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
    textAlign: 'center',
  },
  icon: {
    fontSize: 56,
    marginBottom: 16,
  },
  passLabel: {
    fontSize: 18,
    color: '#F5C800',
    margin: '0 0 4px 0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 36,
    fontWeight: 800,
    margin: '0 0 24px 0',
  },
  lookAway: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  actionLabel: {
    fontSize: 15,
    color: '#D1D5DB',
    margin: '0 0 32px 0',
  },
  button: {
    marginTop: 32,
    minHeight: 56,
    minWidth: 240,
    fontSize: 18,
    fontWeight: 700,
    border: 'none',
    borderRadius: 12,
    backgroundColor: '#F5C800',
    color: '#0E2A7E',
    padding: '0 24px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
};
