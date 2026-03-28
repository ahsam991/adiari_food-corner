import { useState, useEffect } from 'react';
import { loadMenu } from '../menuData';
import { apiPlaceOrder } from '../api';

const CART_KEY = 'adi_ari_cart';
const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; } };
const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

export default function Order() {
  const [mode,    setMode]    = useState('delivery');
  const [cart,    setCart]    = useState(loadCart);
  const [addedId, setAddedId] = useState(null);
  const [menu,    setMenu]    = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    // Load only available items from shared store
    setMenu(loadMenu().filter(i => i.available));
  }, []);
  useEffect(() => { saveCart(cart); }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1400);
  };
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setPlacing(true);
    try {
      const orderData = {
        items: cart.map(c => ({ id: c.id, name: c.name, qty: c.qty, price: c.price })),
        mode,
        subtotal,
        delivery,
        tax,
        total,
        timestamp: new Date().toISOString()
      };

      await apiPlaceOrder(orderData);
      setOrderPlaced(true);
      setCart([]);
      saveCart([]);
    } catch (error) {
      alert(`Order placement failed: ${error.message || 'Please try again'}`);
    } finally {
      setPlacing(false);
    }
  };

  const subtotal  = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery  = mode === 'delivery' ? 4.99 : 0;
  const tax       = subtotal * 0.08;
  const total     = subtotal + delivery + tax;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const CATS = ['Starters', 'Sushi', 'Ramen', 'Mains', 'Desserts'];

  return (
    <>
      <div style={{ height: 'var(--nav-h)', background: 'var(--stone-900)' }}></div>

      <section className="section" style={{ paddingTop: 'var(--sp-12)', paddingBottom: 'var(--sp-24)' }}>
        <div className="container">
          <div className="section-header mb-8 fade-up">
            <span className="section-eyebrow">☪ Halal Certified · Online Ordering</span>
            <h1 className="headline-xl">Order Online <span className="jp-sub">オンライン注文</span></h1>
          </div>

          {/* Mode toggle */}
          <div className="fade-up" style={{ display: 'flex', gap: 0, marginBottom: 'var(--sp-10)', border: '1px solid var(--outline-variant)', width: 'fit-content' }}>
            {['delivery', 'pickup'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ padding: '0.75rem 2rem', fontFamily: 'var(--font-label)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', background: mode === m ? 'var(--stone-900)' : 'transparent', color: mode === m ? '#fff' : 'var(--on-surface-variant)', border: 'none', transition: 'all 0.2s' }}>
                {m === 'delivery' ? '🚀 Delivery' : '🏪 Pickup'}
              </button>
            ))}
          </div>

          <div className="order-layout">
            {/* ── Menu columns ── */}
            <div>
              {CATS.map(cat => {
                const items = menu.filter(i => i.cat === cat);
                if (!items.length) return null;
                return (
                  <div key={cat} className="mb-12">
                    <h2 className="headline-sm mb-6 fade-up"
                      style={{ borderBottom: '2px solid var(--outline-variant)', paddingBottom: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {cat}
                      <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-label)', fontWeight: 400, letterSpacing: '0.1em' }}>
                        {items.length} items
                      </span>
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                      {items.map(item => (
                        <div key={item.id} className="card fade-up order-item-card">
                          <img src={item.img} alt={item.name}
                            style={{ width: 88, height: 88, objectFit: 'cover', flexShrink: 0 }}
                            loading="lazy"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop'; }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700 }}>{item.name}</div>
                              {item.badge && <span style={{ background: 'var(--primary)', color: '#fff', fontFamily: 'var(--font-label)', fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px' }}>{item.badge}</span>}
                              {item.halal && <span style={{ color: '#15803d', fontSize: '0.65rem', fontWeight: 700 }}>☪</span>}
                            </div>
                            {item.jp && <div style={{ fontSize: '0.73rem', opacity: 0.5, marginBottom: 4 }}>{item.jp}</div>}
                            <div style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)', marginBottom: 6, lineHeight: 1.5 }}>{item.desc}</div>
                            <div style={{ color: 'var(--secondary)', fontWeight: 700, fontFamily: 'var(--font-label)', fontSize: '1rem' }}>${item.price}</div>
                          </div>
                          <button onClick={() => addToCart(item)}
                            style={{
                              padding: '0.55rem 1.2rem', fontFamily: 'var(--font-label)', fontSize: '0.65rem',
                              letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
                              border: '1px solid', transition: 'all 0.22s', flexShrink: 0, alignSelf: 'center',
                              background: addedId === item.id ? 'var(--primary)' : 'transparent',
                              color: addedId === item.id ? '#fff' : 'var(--primary)',
                              borderColor: 'var(--primary)',
                              transform: addedId === item.id ? 'scale(0.96)' : 'scale(1)',
                            }}>
                            {addedId === item.id ? '✓ Added' : '+ Add'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Cart ── */}
            <div className="order-cart-panel">
              <div className="order-cart-header">
                <h3 className="headline-sm">Your Cart</h3>
                {cartCount > 0 && (
                  <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700 }}>{cartCount}</span>
                )}
              </div>

              <div style={{ padding: 'var(--sp-4) var(--sp-6)', flex: 1, overflowY: 'auto' }}>
                {orderPlaced ? (
                  <div style={{ textAlign: 'center', padding: 'var(--sp-12) 0' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3.5rem', display: 'block', marginBottom: 12, color: '#15803d' }}>check_circle</span>
                    <h3 className="headline-md mb-2">Order Placed! ☪</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: 16 }}>Thank you for ordering from ADI ARI HALAL FOOD CORNER!</p>
                    <button className="btn btn-primary" onClick={() => setOrderPlaced(false)}>Place Another Order</button>
                  </div>
                ) : cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--sp-12) 0', color: 'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: 8 }}>shopping_cart</span>
                    <p style={{ fontSize: '0.875rem' }}>Your cart is empty</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', maxHeight: 380, overflowY: 'auto' }}>
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.img} alt={item.name} className="cart-item__img"
                          onError={e => e.target.style.opacity = 0.3} />
                        <div className="cart-item__info">
                          <div className="cart-item__name">{item.name}</div>
                          <div className="cart-item__price">${(item.price * item.qty).toFixed(2)}</div>
                          <div className="qty-control">
                            <button onClick={() => updateQty(item.id, -1)}>−</button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ borderTop: '1px solid var(--outline-variant)', padding: 'var(--sp-5) var(--sp-6)' }}>
                  <div className="totals-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  {mode === 'delivery' && <div className="totals-row"><span>Delivery</span><span>${delivery.toFixed(2)}</span></div>}
                  <div className="totals-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                  <div className="totals-row totals-row--total"><span>Total</span><span className="price">${total.toFixed(2)}</span></div>
                  <button className="btn btn-primary w-full mt-4" style={{ justifyContent: 'center' }}
                    onClick={handleCheckout}
                    disabled={placing || cart.length === 0}>
                    {placing ? 'Processing...' : 'Checkout →'}
                  </button>
                  <button className="btn w-full mt-2" style={{ justifyContent: 'center', fontSize: '0.65rem', color: 'var(--on-surface-variant)' }}
                    onClick={() => setCart([])}>
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .order-layout { display: grid; grid-template-columns: 1fr 360px; gap: var(--sp-8); align-items: start; }
        .order-item-card { display: flex; gap: var(--sp-4); align-items: flex-start; padding: var(--sp-4); }
        .order-cart-panel { position: sticky; top: calc(var(--nav-h) + var(--sp-4)); background: var(--surface-container-lowest); border: 1px solid var(--outline-variant); display: flex; flex-direction: column; max-height: calc(100vh - var(--nav-h) - 2rem); }
        .order-cart-header { background: var(--stone-900); color: #fff; padding: var(--sp-5) var(--sp-6); display: flex; justify-content: space-between; align-items: center; }
        @media(max-width: 900px){ .order-layout { grid-template-columns: 1fr; } .order-cart-panel { position: static; max-height: none; } }
      `}</style>
    </>
  );
}
