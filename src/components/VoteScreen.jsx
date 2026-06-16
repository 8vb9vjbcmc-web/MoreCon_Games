/**
 * VoteScreen
 * Private, handoff-gated screen where one player secretly casts their vote
 * for who they believe the Saboteur is.
 *
 * @param {object} props
 * @param {{id: number, name: string}} props.voter - The player currently voting.
 * @param {{id: number, name: string}[]} props.candidates - Votable players
 *   (the voter themselves is already excluded by the caller).
 * @param {(targetId: number) => void} props.onCast - Called with the chosen
 *   candidate's id when a card is tapped.
 */
export default function VoteScreen({ voter, candidates, onCast }) {
  return (
    <div style={styles.container}>
      <p style={styles.heading}>{voter.name}'s Vote</p>
      <h1 style={styles.title}>Who is the Saboteur?</h1>

      <div style={styles.cardList}>
        {candidates.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCast(c.id)}
            style={styles.card}
          >
            <span style={styles.cardIcon} aria-hidden="true">⛑️</span>
            <span style={styles.cardName}>{c.name}</span>
          </button>
        ))}
      </div>
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
    fontSize: 14,
    color: '#F5C800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    margin: '0 0 4px 0',
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    margin: '0 0 28px 0',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    maxWidth: 320,
  },
  card: {
    minHeight: 64,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 20px',
    borderRadius: 14,
    border: '3px solid #F5C800',
    backgroundColor: '#1C3A9E',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, transform 0.15s ease',
  },
  cardIcon: {
    fontSize: 28,
  },
  cardName: {
    flex: 1,
    textAlign: 'left',
  },
};
