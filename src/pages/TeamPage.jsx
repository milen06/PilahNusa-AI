import React from 'react';
import { Users, Github, Linkedin, ClipboardList, Palette, Monitor, Bot, FlaskConical, Rocket } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    name: 'Irdan Guntara',
    role: 'Project Manager & AI Engineer',
    desc: 'Memimpin koordinasi tim serta mengintegrasikan model machine learning untuk klasifikasi sampah.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Ema Maleni',
    role: 'Frontend Developer',
    desc: 'Mengembangkan interface aplikasi dengan React untuk tampilan yang responsif dan user-friendly.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Nayarah Atmawardani',
    role: 'Backend Developer',
    desc: 'Membangun API dan sistem backend yang robust untuk manajemen data dan fitur aplikasi.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Galih Rizaldy',
    role: 'AI Engineer',
    desc: 'Mengembangkan dan mengoptimalkan model kecerdasan buatan untuk akurasi klasifikasi terbaik.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Gisca Oktavia Ramadhani',
    role: 'Data Scientist',
    desc: 'Menganalisis data sampah dan melakukan pemrosesan data untuk melatih model AI.',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Ryan Dwi Antoni',
    role: 'Data Scientist',
    desc: 'Mengolah dataset dan melakukan validasi data untuk memastikan kualitas performa model.',
    github: '#',
    linkedin: '#',
  },
];

const JOURNEY_STEPS = [
  { title: 'Planning', desc: 'Riset kebutuhan dan perencanaan fitur', icon: ClipboardList },
  { title: 'Design', desc: 'Perancangan UI/UX yang user-friendly', icon: Palette },
  { title: 'Development', desc: 'Implementasi frontend & backend', icon: Monitor },
  { title: 'AI Integration', desc: 'Integrasi model machine learning', icon: Bot },
  { title: 'Testing', desc: 'Quality assurance dan debugging', icon: FlaskConical },
  { title: 'Deployment', desc: 'Peluncuran dan maintenance', icon: Rocket },
];

const TeamPage = () => {
  return (
    <div className="team-page animate-slide-up">
      {/* Header Section */}
      <section className="team-header">
        <div className="team-header__icon-wrapper">
          <Users size={32} color="var(--color-primary)" />
        </div>
        <h1 className="team-header__title">Meet Our Team</h1>
        <p className="team-header__subtitle">
          Tim yang berkomitmen untuk menciptakan solusi AI yang ramah lingkungan dan bermanfaat bagi masyarakat. Bersama-sama kami membangun PilahNusa AI dengan dedikasi dan inovasi.
        </p>
      </section>

      {/* Team Grid */}
      <section className="team-grid">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.name} className="team-card">
            <div className="team-card__image-container">
              {/* Empty Photo Slot as requested */}
              <div className="team-card__image-placeholder">
                <Users size={48} color="var(--color-border)" />
              </div>
              <div className="team-card__role-badge">
                {member.role}
              </div>
            </div>
            <div className="team-card__info">
              <h3 className="team-card__name">{member.name}</h3>
              <p className="team-card__desc">{member.desc}</p>
              <div className="team-card__socials">
                <a href={member.github} className="team-card__social-link" aria-label="Github Profile">
                  <Github size={18} />
                </a>
                <a href={member.linkedin} className="team-card__social-link" aria-label="Linkedin Profile">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Journey Section */}
      <section className="journey">
        <h2 className="journey__title">Our Collaboration Journey</h2>
        <div className="journey__timeline">
          <div className="journey__line" aria-hidden="true" />
          <div className="journey__steps">
            {JOURNEY_STEPS.map((step) => (
              <div key={step.title} className="journey-step">
                <div className="journey-step__icon-wrapper">
                  <step.icon size={24} color="white" />
                </div>
                <div className="journey-step__content">
                  <h4 className="journey-step__title">{step.title}</h4>
                  <p className="journey-step__desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .team-page {
          padding: 40px 24px 60px;
          display: flex;
          flex-direction: column;
          gap: 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* --- Header --- */
        .team-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .team-header__icon-wrapper {
          width: 64px;
          height: 64px;
          background: var(--color-primary-bg);
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .team-header__title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .team-header__subtitle {
          font-size: 1.0625rem;
          color: var(--color-text-secondary);
          max-width: 720px;
          line-height: 1.6;
        }

        /* --- Team Grid --- */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .team-card {
          background: var(--color-white);
          border-radius: var(--radius-2xl);
          padding: 32px 24px;
          border: 1px solid var(--color-border-light);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .team-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary-light);
        }

        .team-card__image-container {
          position: relative;
          width: 140px;
          height: 140px;
          margin-bottom: 24px;
        }

        .team-card__image-placeholder {
          width: 100%;
          height: 100%;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-2xl);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--color-border);
        }

        .team-card__role-badge {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-primary);
          color: white;
          padding: 4px 14px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
        }

        .team-card__info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .team-card__name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-top: 8px;
        }

        .team-card__desc {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .team-card__socials {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 8px;
        }

        .team-card__social-link {
          width: 36px;
          height: 36px;
          background: var(--color-bg);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .team-card__social-link:hover {
          background: var(--color-primary-bg);
          color: var(--color-primary);
          transform: scale(1.1);
        }

        /* --- Journey --- */
        .journey {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-2xl);
          padding: 48px 32px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .journey__title {
          font-size: 1.75rem;
          font-weight: 800;
          text-align: center;
        }

        .journey__timeline {
          position: relative;
          padding: 20px 0;
        }

        .journey__line {
          position: absolute;
          top: 52px;
          left: 32px;
          right: 32px;
          height: 4px;
          background: var(--color-primary-light);
          opacity: 0.3;
        }

        .journey__steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .journey-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          flex: 1;
        }

        .journey-step__icon-wrapper {
          width: 64px;
          height: 64px;
          background: var(--color-primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(34, 197, 94, 0.2);
          transition: transform var(--transition-normal);
        }

        .journey-step:hover .journey-step__icon-wrapper {
          transform: translateY(-5px) rotate(8deg);
        }

        .journey-step__title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .journey-step__desc {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          max-width: 140px;
          line-height: 1.4;
        }

        /* --- Responsive --- */
        @media (max-width: 1023px) {
          .journey__line {
            display: none;
          }
          .journey__steps {
            flex-direction: column;
            gap: 32px;
          }
          .journey-step {
            flex-direction: row;
            text-align: left;
            gap: 20px;
          }
          .journey-step__icon-wrapper {
            flex-shrink: 0;
          }
          .journey-step__desc {
            max-width: none;
          }
        }

        @media (max-width: 767px) {
          .team-page {
            padding: 20px 16px 80px;
            gap: 40px;
          }
          .team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TeamPage;
