import { Link } from 'react-router-dom';

const RESTAURANT = {
  name:    'ADI ARI HALAL FOOD CORNER',
  address: '12 Halal Street, Food District, Dhaka 1212, Bangladesh',
  phone:   '+880 1700-000000',
  email:   'info@adiari-halal.com',
  halal:   '☪ 100% Halal Certified',
};

export default function Footer() {
  return (
    <footer id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">{RESTAURANT.name}</div>
            <div style={{ color:'var(--gold-dim)', fontSize:'0.72rem', fontFamily:'var(--font-label)', letterSpacing:'0.18em', marginBottom:'var(--sp-4)', textTransform:'uppercase' }}>
              {RESTAURANT.halal}
            </div>
            <p className="footer-desc">Authentic halal Japanese cuisine crafted with the finest certified ingredients and generations of culinary passion.</p>
            <div style={{ marginTop:'var(--sp-6)', display:'flex', flexDirection:'column', gap:'var(--sp-2)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)', fontSize:'0.8rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'1rem', color:'var(--primary)' }}>location_on</span>
                {RESTAURANT.address}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)', fontSize:'0.8rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'1rem', color:'var(--primary)' }}>phone</span>
                {RESTAURANT.phone}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,0.55)', fontSize:'0.8rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'1rem', color:'var(--primary)' }}>mail</span>
                {RESTAURANT.email}
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="footer-heading">Explore</div>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/menu">Full Menu</Link></li>
              <li><Link to="/reservation">Reservations</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="footer-heading">Services</div>
            <ul className="footer-links">
              <li><Link to="/order">Online Ordering</Link></li>
              <li><Link to="/contact">Delivery</Link></li>
              <li><Link to="/contact">Private Dining</Link></li>
              <li><Link to="/contact">Catering</Link></li>
              <li><Link to="/contact">Gift Cards</Link></li>
            </ul>
            <div className="footer-heading" style={{ marginTop:'var(--sp-8)' }}>Hours</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {[
                { day:'Mon – Fri', hrs:'11am – 10pm' },
                { day:'Sat – Sun', hrs:'10am – 11pm' },
              ].map((h,i)=>(
                <div key={i} style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.42)', display:'flex', justifyContent:'space-between', gap:16 }}>
                  <span>{h.day}</span><span style={{ color:'rgba(255,255,255,0.65)' }}>{h.hrs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="footer-heading">Follow Us</div>
            <ul className="footer-links">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
            <div style={{ marginTop:'var(--sp-8)', padding:'var(--sp-4)', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize:'0.65rem', fontFamily:'var(--font-label)', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold-dim)', marginBottom:'var(--sp-2)' }}>☪ Halal Certified</div>
              <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.42)', lineHeight:1.6 }}>
                All our ingredients are 100% halal certified. We do not serve alcohol.
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copy">
          <span>© {new Date().getFullYear()} {RESTAURANT.name}. All rights reserved.</span>
          <div className="footer-copy-links">
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Terms of Service</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
