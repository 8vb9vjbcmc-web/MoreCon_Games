import { useState } from 'react';

/**
 * RoleRevealScreen
 * Private screen where a player taps a face-down card to reveal their secret
 * role (Crewmate or Saboteur), then confirms they've seen it.
 *
 * @param {object} props
 * @param {{id: number, name: string, role: 'crewmate'|'saboteur'}} props.player
 *   The player currently viewing their role.
 * @param {() => void} props.onDone - Called when the player taps "Got it, pass it on".
 */
export default function RoleRevealScreen({ player, onDone }) {
  const [flipped, setFlipped] = useState(false);
  const isSaboteur = player.role === 'saboteur';

  return (
    <div style={styles.container}>
      <p style={styles.heading}>{player.name}'s secret role</p>

      <div
        style={styles.cardWrapper}
        onClick={() => setFlipped(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') setFlipped(true);
        }}
        aria-label={flipped ? 'Role revealed' : 'Tap to reveal your role'}
      >
        <div
          style={{
            ...styles.card,
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Card back */}
          <div style={styles.cardFace}>
            <div style={styles.cardBackIcon} aria-hidden="true">❓</div>
            <p style={styles.tapHint}>Tap to reveal</p>
          </div>

          {/* Card front */}
          <div
            style={{
              ...styles.cardFace,
              ...styles.cardFront,
              backgroundColor: isSaboteur ? '#DC2626' : '#0E2A7E',
            }}
          >
            <div style={styles.roleIcon} aria-hidden="true">
              {isSaboteur ? '⚠️' : '⛑️'}
            </div>
            <h2 style={styles.roleName}>
              {isSaboteur ? 'SABOTEUR' : 'CREWMATE'}
            </h2>
            {isSaboteur ? (
              <p style={styles.secretLine}>Shhh... keep it secret!</p>
            ) : (
              <p style={styles.secretLine}>Complete tasks. Find the saboteur.</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onDone}
        disabled={!flipped}
        style={{
          ...styles.button,
          ...(flipped ? {} : styles.buttonDisabled),
        }}
      >
        Got it, pass it on
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
  heading: {
    fontSize: 16,
    color: '#F5C800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 24,
  },
  cardWrapper: {
    width: 260,
    height: 340,
    perspective: 1200,
    cursor: 'pointer',
  },
  card: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s ease',
    transformStyle: 'preserve-3d',
  },
  cardFace: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    backgroundColor: '#1C3A9E',
    border: '3px solid #F5C800',
    boxSizing: 'border-box',
    padding: 20,
  },
  cardFront: {
    transform: 'rotateY(180deg)',
  },
  cardBackIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  tapHint: {
    fontSize: 16,
    color: '#F5C800',
    fontWeight: 600,
  },
  roleIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  roleName: {
    fontSize: 26,
    fontWeight: 800,
    margin: '0 0 12px 0',
    letterSpacing: 1,
  },
  secretLine: {
    fontSize: 15,
    color: '#FFFFFF',
    margin: 0,
    maxWidth: 200,
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
    transition: 'opacity 0.15s ease',
  },
  buttonDisabled: {
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};
