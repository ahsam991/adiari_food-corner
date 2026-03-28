export default function About() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero" style={{ paddingTop: 'var(--nav-h)' }}>
        <img className="page-hero__bg" src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop" alt="About ADI ARI HALAL FOOD CORNER" />
        <div className="page-hero__overlay"></div>
        <div className="page-hero__content fade-up">
          <span className="section-eyebrow" style={{ color: 'var(--gold-dim)' }}>☪ Our Heritage</span>
          <h1 className="page-hero__title">Our Story <span style={{ fontSize: '0.55em', opacity: 0.7 }}>私たちの物語</span></h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className="grid-2 fade-up" style={{ gap: 'var(--sp-16)', alignItems: 'center' }}>
            <div>
              <div className="section-header mb-8">
                <span className="section-eyebrow">☪ The Beginning</span>
                <h2 className="headline-xl">A Halal Fusion Journey <span className="jp-sub">ハラール融合</span></h2>
                <div className="section-header__divider"></div>
              </div>
              <p className="body-lg text-muted mb-6">At ADI ARI HALAL FOOD CORNER, we honor the beautiful intersection of Japanese culinary artistry and Islamic halal principles. Our journey began with a simple vision: to bring authentic Japanese flavors to the Muslim community while maintaining the highest standards of halal excellence.</p>
              <p className="body-md text-muted mb-6">Every ingredient is meticulously sourced and 100% halal certified — from our hand-selected wagyu beef to our fresh seafood and premium rice. We believe that halal food can be both spiritually pure and gastronomically exceptional.</p>
              <p className="body-md text-muted">Our kitchen is a sanctuary where Japanese precision meets Islamic values, creating dishes that honor both traditions with equal respect and dedication.</p>
            </div>
            <div style={{ position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1583394838336-318e90641973?q=80&w=1974&auto=format&fit=crop" alt="Head Chef" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '50%', right: '-20px', transform: 'translateY(-50%)', width: 56, height: 56, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <span className="material-symbols-outlined">restaurant_menu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Cards */}
      <section className="section section--container">
        <div className="container">
          <div className="section-header section-header--center mb-16 fade-up">
            <span className="section-eyebrow">Our Values</span>
            <h2 className="headline-xl">Halal Japanese Philosophy <span className="jp-sub">ハラール哲学</span></h2>
            <div className="section-header__divider"></div>
          </div>
          <div className="grid-3 fade-up" data-delay="1" style={{ gap: 'var(--sp-6)' }}>
            {[
              { k: '☪ Halal (حلال)', d: 'Pure & Permissible', text: '100% halal certified ingredients with no alcohol, pork, or haram substances. Our kitchen follows strict Islamic guidelines while celebrating Japanese culinary traditions.' },
              { k: 'Tayyib (طيب)', d: 'Wholesome & Good', text: 'Beyond halal certification, we ensure every ingredient is fresh, healthy, and ethically sourced. Quality and purity in every bite.' },
              { k: 'Omotenashi (おもてなし)', d: 'Hospitality', text: 'Japanese hospitality infused with Islamic values of generosity and kindness. Every guest is treated with warmth and respect.' },
              { k: 'Shizen (自然)', d: 'Nature', text: "We follow the rhythms of nature, serving seasonal ingredients at their peak — a principle shared by both Japanese and Islamic food traditions." },
              { k: 'Itqan (إتقان)', d: 'Excellence', text: 'Islamic concept of perfecting one\'s craft combined with Japanese precision. We pursue mastery in every dish we create.' },
              { k: 'Barakah (بركة)', d: 'Blessing', text: 'Food prepared with gratitude and intention. We begin with Bismillah and serve with the belief that our work carries spiritual significance.' },
            ].map((p, i) => (
              <div key={i} className="card fade-up" data-delay={i % 3} style={{ padding: 'var(--sp-8)' }}>
                <h3 className="headline-sm mb-1">{p.k}</h3>
                <p style={{ color: 'var(--secondary)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font-label)', marginBottom: 'var(--sp-4)' }}>{p.d}</p>
                <p className="body-sm text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="grid-2 fade-up" style={{ gap: 'var(--sp-16)', alignItems: 'start' }}>
            <div>
              <div className="section-header mb-8">
                <span className="section-eyebrow">Our Journey</span>
                <h2 className="headline-xl">Building a Legacy <span className="jp-sub">遺産を築く</span></h2>
                <div className="section-header__divider"></div>
              </div>
              <div className="timeline">
                {[
                  { year: '2020', title: 'Vision Born', desc: 'ADI ARI HALAL FOOD CORNER concept developed to bring halal Japanese fusion cuisine to Dhaka.' },
                  { year: '2022', title: 'First Location Opens', desc: 'Our flagship restaurant opens in Dhaka, introducing the community to authentic halal Japanese dining.' },
                  { year: '2023', title: 'Halal Certification', desc: 'Received full halal certification from recognized Islamic authorities, cementing our commitment to halal excellence.' },
                  { year: '2024', title: 'Menu Expansion', desc: 'Expanded menu to include premium sushi, artisan ramen, and fusion dishes combining Japanese and Middle Eastern flavors.' },
                  { year: '2026', title: 'Digital Innovation', desc: 'Launched comprehensive online ordering and reservation system to better serve our growing community.' },
                ].map((t, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-year">{t.year}</div>
                    <div className="timeline-title">{t.title}</div>
                    <div className="timeline-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Certifications & Recognition */}
            <div>
              <div className="section-header mb-8">
                <span className="section-eyebrow">Trust & Quality</span>
                <h2 className="headline-xl">Certifications <span className="jp-sub">認証</span></h2>
                <div className="section-header__divider"></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                {[
                  { award: '☪ 100% Halal Certified', year: '2023–Present', desc: 'Islamic Foundation Bangladesh' },
                  { award: '✓ Food Safety Excellence', year: '2024', desc: 'Bangladesh Food Safety Authority' },
                  { award: '🌟 Customer Choice Award', year: '2025', desc: 'Best Halal Restaurant - Dhaka' },
                  { award: '🍱 Authentic Japanese Cuisine', year: '2024', desc: 'Bangladesh Japan Friendship Association' },
                ].map((a, i) => (
                  <div key={i} className="card fade-up" data-delay={i} style={{ padding: 'var(--sp-5) var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, marginBottom: 4 }}>{a.award}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{a.desc}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '0.65rem', color: 'var(--secondary)', letterSpacing: '0.15em' }}>{a.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-header section-header--center mb-16 fade-up">
            <span className="section-eyebrow" style={{ color: 'var(--gold-dim)' }}>The Artisans</span>
            <h2 className="headline-xl" style={{ color: '#fff' }}>Meet Our Chefs</h2>
          </div>
          <div className="grid-3 fade-up" style={{ gap: 'var(--sp-8)' }}>
            {[
              { name: 'Chef Ahmad Hasan', role: 'Executive Chef & Founder', img: 'https://images.unsplash.com/photo-1583394838336-318e90641973?q=80&w=400&auto=format&fit=crop', bio: 'Trained in Tokyo with halal Japanese cuisine pioneers. Combines 15 years of culinary expertise with deep Islamic knowledge.' },
              { name: 'Chef Fatima Rahman', role: 'Head Pastry Chef', img: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=400&auto=format&fit=crop', bio: 'Creates halal Japanese-inspired desserts. Specializes in matcha confections and traditional wagashi with halal ingredients.' },
              { name: 'Chef Karim Abdullah', role: 'Sushi & Ramen Master', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400&auto=format&fit=crop', bio: 'Expert in halal sushi preparation and authentic ramen. His tonkotsu-style broth uses only halal-certified ingredients.' },
            ].map((chef, i) => (
              <div key={i} className="fade-up" data-delay={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 160, height: 160, borderRadius: '50%', overflow: 'hidden', margin: '0 auto var(--sp-6)', border: '2px solid var(--primary)' }}>
                  <img src={chef.img} alt={chef.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.25rem', color: '#fff', marginBottom: 4 }}>{chef.name}</div>
                <div style={{ color: 'var(--gold-dim)', fontFamily: 'var(--font-label)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 'var(--sp-4)' }}>{chef.role}</div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.7 }}>{chef.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
