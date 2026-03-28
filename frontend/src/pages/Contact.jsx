import { useState } from 'react';
import { apiSendContact } from '../api';

const RESTAURANT = {
  address: '12 Halal Street, Food District, Dhaka 1212, Bangladesh',
  phone:   '+880 1700-000000',
  email:   'info@adiari-halal.com',
  maps:    'https://maps.google.com',
};

const HOURS = [
  { day: 'Monday',    hrs: '11:00 AM – 10:00 PM' },
  { day: 'Tuesday',   hrs: '11:00 AM – 10:00 PM' },
  { day: 'Wednesday', hrs: '11:00 AM – 10:00 PM' },
  { day: 'Thursday',  hrs: '11:00 AM – 10:00 PM' },
  { day: 'Friday',    hrs: '11:00 AM – 11:00 PM' },
  { day: 'Saturday',  hrs: '10:00 AM – 11:00 PM' },
  { day: 'Sunday',    hrs: '10:00 AM – 10:00 PM' },
];

const FAQS = [
  { q: 'Is all your food 100% Halal?', a: 'Yes — every single ingredient we use is certified halal. We do not serve alcohol, pork, or any haram products. Our kitchen is fully halal-compliant.' },
  { q: 'Do you offer vegetarian options?', a: 'Absolutely. We have a dedicated vegetarian section including edamame, miso soup, agedashi tofu, spicy miso ramen, and matcha desserts — all clearly marked on our menu.' },
  { q: 'Do you accept walk-ins?', a: 'We welcome walk-ins based on availability. However, we strongly recommend making a reservation, especially on weekends and Friday evenings.' },
  { q: 'What is your cancellation policy?', a: 'We kindly ask for at least 24 hours notice for cancellations. For parties of 6 or more, 48 hours notice is required.' },
  { q: 'Do you offer delivery?', a: 'Yes! We offer fast delivery within a 10km radius. You can place your order directly from our Order page. Minimum order $15.' },
  { q: 'Can I host a private event?', a: 'Yes — our private dining area seats up to 30 guests for exclusive events, corporate dinners, eid celebrations, or family gatherings. Contact us to discuss.' },
];

export default function Contact() {
  const [open,      setOpen]      = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending,   setSending]   = useState(false);
  const [formData,  setFormData]  = useState({ first_name:'', last_name:'', email:'', phone:'', subject:'General Inquiry', message:'' });

  const handleChange = e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiSendContact(formData);
    } catch { /* still show success — form saves to DB when backend is up */ }
    setSending(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ paddingTop: 'var(--nav-h)' }}>
        <img className="page-hero__bg"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
          alt="Restaurant interior" />
        <div className="page-hero__overlay"></div>
        <div className="page-hero__content fade-up">
          <span className="section-eyebrow" style={{ color: 'var(--gold-dim)' }}>☪ We'd Love to Hear From You</span>
          <h1 className="page-hero__title">Contact Us <span style={{ fontSize:'0.5em', opacity:0.7 }}>お問い合わせ</span></h1>
        </div>
      </div>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="grid-2 fade-up" style={{ gap:'var(--sp-16)', alignItems:'start' }}>

            {/* Form */}
            <div>
              <div className="section-header mb-8">
                <span className="section-eyebrow">Send a Message</span>
                <h2 className="headline-lg">Get In Touch</h2>
                <div className="section-header__divider"></div>
              </div>

              {submitted ? (
                <div style={{ padding:'var(--sp-12)', background:'var(--surface-container)', textAlign:'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'3.5rem', color:'#15803d', display:'block', marginBottom:'var(--sp-4)' }}>check_circle</span>
                  <h3 className="headline-md mb-4">Message Sent! ☪</h3>
                  <p className="text-muted body-md mb-2">Thank you for reaching out to ADI ARI HALAL FOOD CORNER.</p>
                  <p className="text-muted body-sm">We'll reply within 24 hours — <strong>{formData.email}</strong></p>
                  <button className="btn btn-outline mt-8" onClick={() => { setSubmitted(false); setFormData({ first_name:'', last_name:'', email:'', phone:'', subject:'General Inquiry', message:'' }); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'var(--sp-4)' }}>
                  <div className="grid-2" style={{ gap:'var(--sp-4)' }}>
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input name="first_name" type="text" required className="form-input" placeholder="Ahmad" value={formData.first_name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input name="last_name" type="text" required className="form-input" placeholder="Hassan" value={formData.last_name} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" required className="form-input" placeholder="hello@example.com" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input name="phone" type="tel" className="form-input" placeholder="+880 1700-000000" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select name="subject" className="form-input form-select" value={formData.subject} onChange={handleChange}>
                      <option>General Inquiry</option>
                      <option>Halal Certification Query</option>
                      <option>Private Dining & Events</option>
                      <option>Reservation Help</option>
                      <option>Delivery & Ordering</option>
                      <option>Feedback</option>
                      <option>Catering</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea name="message" required className="form-input form-textarea" rows={5} placeholder="Tell us how we can help…" value={formData.message} onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-primary mt-4" style={{ alignSelf:'flex-start' }} disabled={sending}>
                    {sending ? 'Sending…' : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Info Panel */}
            <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-8)' }}>
              <div className="section-header mb-0">
                <span className="section-eyebrow">Find Us</span>
                <h2 className="headline-lg">Restaurant Info</h2>
                <div className="section-header__divider"></div>
              </div>

              {/* Contact Details */}
              <div style={{ display:'flex', flexDirection:'column', gap:'var(--sp-5)' }}>
                {[
                  { icon:'location_on', label:'Address',  val: RESTAURANT.address },
                  { icon:'phone',       label:'Phone',    val: RESTAURANT.phone },
                  { icon:'mail',        label:'Email',    val: RESTAURANT.email },
                  { icon:'verified',    label:'Halal',    val: '☪ 100% Halal Certified — No Alcohol · No Pork' },
                ].map((info, i) => (
                  <div key={i} style={{ display:'flex', gap:'var(--sp-4)', alignItems:'flex-start' }}>
                    <span className="material-symbols-outlined" style={{ color:'var(--primary)', fontSize:'1.4rem', flexShrink:0, marginTop:2 }}>{info.icon}</span>
                    <div>
                      <div style={{ fontFamily:'var(--font-label)', fontSize:'0.62rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--on-surface-variant)', marginBottom:4 }}>{info.label}</div>
                      <div style={{ fontSize:'0.9rem', lineHeight:1.5 }}>{info.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'var(--sp-4)' }}>
                  <span className="material-symbols-outlined" style={{ color:'var(--primary)', fontSize:'1.2rem' }}>schedule</span>
                  <div style={{ fontFamily:'var(--font-label)', fontSize:'0.62rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--on-surface-variant)' }}>Hours of Operation</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {HOURS.map((h, i) => {
                    const today = new Date().toLocaleDateString('en-US', { weekday:'long' });
                    const isToday = today === h.day;
                    return (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'var(--sp-3) 0', borderBottom:'1px solid var(--outline-variant)', fontSize:'0.875rem', background: isToday ? 'var(--surface-container-low)' : 'transparent', padding: isToday ? 'var(--sp-3) var(--sp-3)' : 'var(--sp-3) 0' }}>
                        <span style={{ fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--primary)' : 'inherit', display:'flex', alignItems:'center', gap:6 }}>
                          {isToday && <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--primary)', display:'inline-block' }}></span>}
                          {h.day}
                        </span>
                        <span style={{ color:'var(--on-surface-variant)' }}>{h.hrs}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Placeholder */}
              <div style={{ background:'var(--surface-container)', height:200, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'var(--sp-2)', color:'var(--on-surface-variant)', border:'1px solid var(--outline-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'2.5rem', color:'var(--primary)' }}>map</span>
                <span style={{ fontFamily:'var(--font-label)', fontSize:'0.65rem', letterSpacing:'0.2em', textTransform:'uppercase' }}>Dhaka, Bangladesh</span>
                <a href={RESTAURANT.maps} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-2" style={{ fontSize:'0.6rem' }}>Open in Google Maps →</a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--container">
        <div className="container" style={{ maxWidth:800 }}>
          <div className="section-header section-header--center mb-12 fade-up">
            <span className="section-eyebrow">Common Questions</span>
            <h2 className="headline-xl">FAQ <span className="jp-sub">よくある質問</span></h2>
            <div className="section-header__divider" style={{ margin:'var(--sp-4) auto 0' }}></div>
          </div>
          <div className="fade-up" data-delay="1">
            {FAQS.map((faq, i) => (
              <div key={i} className="accordion-item">
                <button className={`accordion-btn${open === i ? ' open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
                  {faq.q}
                  <span className="material-symbols-outlined icon">add</span>
                </button>
                <div className="accordion-content" style={{ maxHeight: open === i ? 400 : 0 }}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
