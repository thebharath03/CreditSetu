import voiceOnboarding from '../assets/mockups/voice-onboarding.png'
import portableCredential from '../assets/mockups/portable-credential.png'
import lenderDashboard from '../assets/mockups/lender-dashboard.png'

const MOCKUPS = [
  { src: voiceOnboarding, caption: 'Voice onboarding' },
  { src: portableCredential, caption: 'Portable credential (QR-based)' },
  { src: lenderDashboard, caption: 'Live lender dashboard' },
]

function WhatsNextSection() {
  return (
    <section className="whats-next">
      <h2>Coming at the hackathon build — planned, not yet built</h2>
      <div className="whats-next-grid">
        {MOCKUPS.map((m) => (
          <figure key={m.caption}>
            <img src={m.src} alt={`Wireframe mockup: ${m.caption}`} />
            <figcaption>{m.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default WhatsNextSection
