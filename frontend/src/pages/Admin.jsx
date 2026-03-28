import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { loadMenu, persistMenu, DEFAULT_MENU } from '../menuData';
import {
  apiGetMenu, apiCreateMenuItem, apiUpdateMenuItem,
  apiToggleMenuItem, apiDeleteMenuItem, apiGetOrders, apiGetReservations, apiAdminOverview
} from '../api';

const CATS = ['Starters', 'Sushi', 'Ramen', 'Mains', 'Desserts'];
const EMPTY_FORM = { name: '', jp: '', cat: 'Mains', price: '', img: '', desc: '', badge: '', halal: true, available: true };

export default function Admin() {
  const [active,       setActive]      = useState('overview');
  const [menuItems,    setMenuItems]   = useState([]);
  const [orders,       setOrders]      = useState([]);
  const [reservations, setReservations]= useState([]);
  const [overview,     setOverview]    = useState(null);
  const [showForm,     setShowForm]    = useState(false);
  const [editingId,    setEditingId]   = useState(null);
  const [form,         setForm]        = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget]= useState(null);
  const [menuFilter,   setMenuFilter]  = useState('all');
  const [toast,        setToast]       = useState(null);
  const [adminAuth,    setAdminAuth]   = useState(() => sessionStorage.getItem('admin_auth') === 'true');
  const [pass,         setPass]        = useState('');
  const [apiMode,      setApiMode]     = useState(false);
  const [loading,      setLoading]     = useState(false);

  /* ── Toast ── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* ── Load data ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Try backend first
      const apiMenu = await apiGetMenu();
      if (apiMenu && apiMenu.length > 0) {
        setMenuItems(apiMenu);
        persistMenu(apiMenu);
        setApiMode(true);
      } else {
        setMenuItems(loadMenu());
        setApiMode(false);
      }
      const [apiOrders, apiRes, apiOverview] = await Promise.all([
        apiGetOrders(), apiGetReservations(), apiAdminOverview()
      ]);
      if (apiOrders.length)  setOrders(apiOrders);
      if (apiRes.length)     setReservations(apiRes);
      if (apiOverview)       setOverview(apiOverview);
    } catch {
      setMenuItems(loadMenu());
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (adminAuth) loadData(); }, [adminAuth, loadData]);

  /* ── Auth ── */
  const handleLogin = () => {
    if (pass === 'admin123') {
      setAdminAuth(true);
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      showToast('Wrong password!', 'error');
    }
  };

  /* ── CRUD ── */
  const persist = (items) => { setMenuItems(items); persistMenu(items); };

  const openAdd  = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, jp: item.jp || '', cat: item.cat, price: item.price,
      img: item.img, desc: item.desc, badge: item.badge || '', halal: !!item.halal, available: !!item.available });
    setShowForm(true);
  };

  const saveItem = async () => {
    if (!form.name.trim() || !form.price) { showToast('Name & price required!', 'error'); return; }
    try {
      if (apiMode) {
        const payload = { ...form, price: Number(form.price) };
        if (editingId) {
          const updated = await apiUpdateMenuItem(editingId, payload);
          persist(menuItems.map(i => i.id === editingId ? updated : i));
        } else {
          const created = await apiCreateMenuItem(payload);
          persist([...menuItems, created]);
        }
      } else {
        if (editingId) {
          persist(menuItems.map(i => i.id === editingId ? { ...i, ...form, price: Number(form.price) } : i));
        } else {
          persist([...menuItems, { ...form, id: Date.now(), price: Number(form.price) }]);
        }
      }
      showToast(editingId ? 'Item updated!' : 'Item added!');
      setShowForm(false);
    } catch (e) { showToast(e.message || 'Save failed', 'error'); }
  };

  const toggleItem = async (id) => {
    try {
      if (apiMode) {
        const updated = await apiToggleMenuItem(id);
        persist(menuItems.map(i => i.id === id ? updated : i));
      } else {
        persist(menuItems.map(i => i.id === id ? { ...i, available: !i.available } : i));
      }
    } catch (e) { showToast(e.message, 'error'); }
  };

  const deleteItem = async (id) => {
    try {
      if (apiMode) await apiDeleteMenuItem(id);
      persist(menuItems.filter(i => i.id !== id));
      setDeleteTarget(null);
      showToast('Item deleted.', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const resetMenu = () => {
    if (window.confirm('Reset all items to defaults?')) {
      persist(DEFAULT_MENU);
      showToast('Menu reset to defaults.');
    }
  };

  const displayMenu = menuFilter === 'all' ? menuItems : menuItems.filter(i => i.cat === menuFilter);
  const STATUS_COLORS = { Completed: '#15803d', Preparing: '#b45309', Pending: '#1d4ed8', Delivered: '#9e0027', pending: '#1d4ed8', confirmed: '#15803d' };

  /* ── Login ── */
  if (!adminAuth) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--stone-900)', paddingTop:'var(--nav-h)' }}>
        <div style={{ background:'var(--surface)', padding:'var(--sp-12)', width:'100%', maxWidth:400, textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}>
          <span className="material-symbols-outlined" style={{ fontSize:'3rem', color:'var(--primary)', display:'block', marginBottom:'var(--sp-4)' }}>admin_panel_settings</span>
          <h1 className="headline-lg mb-2">Admin Access</h1>
          <p className="body-sm text-muted mb-8">ADI ARI HALAL FOOD CORNER</p>
          <div className="form-group mb-6">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password…" autoFocus />
            <p style={{ fontSize:'0.7rem', color:'var(--on-surface-variant)', marginTop:6 }}>
              Demo: <code style={{ background:'var(--surface-container)', padding:'2px 8px', borderRadius:3 }}>admin123</code>
            </p>
          </div>
          <button className="btn btn-primary w-full" style={{ justifyContent:'center' }} onClick={handleLogin}>
            Login to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ paddingTop:'var(--nav-h)' }}>

      {/* Toast */}
      {toast && (
        <div className="admin-toast" style={{ background: toast.type === 'error' ? '#dc2626' : '#15803d' }}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ top:'var(--nav-h)', height:'calc(100vh - var(--nav-h))' }}>
        <div className="admin-brand">
          <div className="admin-brand__tag">☪ Admin Panel</div>
          <div className="admin-brand__name">ADI ARI HALAL</div>
          <div className="admin-brand__sub">FOOD CORNER</div>
          <div style={{ marginTop:8, fontSize:'0.6rem', color: apiMode ? '#16a34a' : '#b45309', fontFamily:'var(--font-label)', letterSpacing:'0.1em' }}>
            ● {apiMode ? 'Connected to Database' : 'Offline Mode (localStorage)'}
          </div>
        </div>

        {[
          { id:'overview',     icon:'dashboard',       label:'Dashboard' },
          { id:'menu',         icon:'restaurant_menu', label:'Menu Manager' },
          { id:'orders',       icon:'receipt_long',    label:'Orders' },
          { id:'reservations', icon:'event_seat',      label:'Reservations' },
          { id:'analytics',    icon:'bar_chart',       label:'Analytics' },
          { id:'settings',     icon:'settings',        label:'Settings' },
        ].map(n => (
          <button key={n.id} onClick={() => setActive(n.id)} className={`admin-nav-item${active===n.id?' active':''}`}>
            <span className="material-symbols-outlined">{n.icon}</span>
            {n.label}
          </button>
        ))}

        <div style={{ marginTop:'auto', padding:'var(--sp-4)', borderTop:'1px solid var(--outline-variant)', display:'flex', flexDirection:'column', gap:6 }}>
          <button className="admin-nav-item" style={{ color:'var(--primary)', border:'none', cursor:'pointer', background:'none', width:'100%', padding:'var(--sp-3) var(--sp-4)' }}
            onClick={() => { setAdminAuth(false); sessionStorage.removeItem('admin_auth'); }}>
            <span className="material-symbols-outlined" style={{ fontSize:'1.1rem' }}>logout</span> Logout
          </button>
          <Link to="/" className="admin-nav-item" style={{ color:'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize:'1.1rem' }}>arrow_back</span> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ══ DASHBOARD ══ */}
        {active === 'overview' && (
          <div>
            <h1 className="headline-lg mb-2">Dashboard</h1>
            <p className="text-muted body-sm mb-8">
              {new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})} · 
              <span style={{ color: apiMode ? '#16a34a' : '#b45309', marginLeft:8 }}>
                {apiMode ? '● Live Database' : '● Offline Mode'}
              </span>
            </p>

            <div className="grid-4 mb-8" style={{ gap:'var(--sp-4)' }}>
              {[
                { label:"Active Menu Items", val: menuItems.filter(i=>i.available).length, trend:`of ${menuItems.length} total`, up:null, icon:'restaurant_menu' },
                { label:"Orders Today",      val: overview?.ordersToday || orders.length || 0, trend:'Live from DB', up:true, icon:'shopping_cart' },
                { label:"Revenue Total",     val: `$${(overview?.revenue||0).toFixed(2)}`, trend:'All time', up:true, icon:'payments' },
                { label:"Reservations",      val: overview?.reservations || reservations.length || 0, trend:'Upcoming', up:null, icon:'event_seat' },
              ].map((m,i)=>(
                <div key={i} className="metric-card">
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'var(--sp-2)' }}>
                    <div className="metric-eyebrow">{m.label}</div>
                    <span className="material-symbols-outlined" style={{ fontSize:'1.3rem', color:'var(--primary)', opacity:0.55 }}>{m.icon}</span>
                  </div>
                  <div className="metric-value">{m.val}</div>
                  <div className={`metric-trend ${m.up===true?'metric-trend--up':m.up===false?'metric-trend--down':'metric-trend--neutral'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize:'0.9rem' }}>{m.up===true?'trending_up':m.up===false?'trending_down':'remove'}</span>
                    {m.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ gap:'var(--sp-6)' }}>
              <div className="card" style={{ padding:'var(--sp-8)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'var(--sp-6)' }}>
                  <h2 className="headline-sm">Menu Snapshot</h2>
                  <button onClick={()=>setActive('menu')} className="btn btn-outline" style={{ fontSize:'0.6rem', padding:'0.4rem 1rem' }}>Manage</button>
                </div>
                {menuItems.slice(0,7).map(item=>(
                  <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'var(--sp-3)', padding:'7px 0', borderBottom:'1px solid var(--surface-container)' }}>
                    <img src={item.img} alt={item.name} style={{ width:36, height:36, objectFit:'cover', borderRadius:4, flexShrink:0 }}
                      onError={e=>e.target.style.opacity=0.2} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:'0.82rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize:'0.68rem', color:'var(--on-surface-variant)' }}>{item.cat}</div>
                    </div>
                    <div style={{ fontWeight:700, color:'var(--secondary)', fontSize:'0.875rem' }}>${item.price}</div>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:item.available?'#16a34a':'#dc2626', flexShrink:0 }}></div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding:'var(--sp-8)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'var(--sp-6)' }}>
                  <h2 className="headline-sm">Recent Orders</h2>
                  <button onClick={()=>setActive('orders')} className="btn btn-outline" style={{ fontSize:'0.6rem', padding:'0.4rem 1rem' }}>View All</button>
                </div>
                {orders.length === 0 && (
                  <div style={{ textAlign:'center', padding:'var(--sp-8) 0', color:'var(--on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'2rem', display:'block', marginBottom:8 }}>receipt_long</span>
                    <p style={{ fontSize:'0.85rem' }}>No orders yet — start the backend!</p>
                  </div>
                )}
                {orders.slice(0,5).map((o,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--surface-container)', fontSize:'0.82rem' }}>
                    <div>
                      <div style={{ fontWeight:600 }}>#{o.id}</div>
                      <div style={{ color:'var(--on-surface-variant)', fontSize:'0.72rem' }}>{o.customer||'Guest'}</div>
                    </div>
                    <div style={{ fontWeight:700 }}>${Number(o.total).toFixed(2)}</div>
                    <span style={{ color:STATUS_COLORS[o.status]||'#999', fontFamily:'var(--font-label)', fontSize:'0.58rem', fontWeight:700, padding:'2px 8px', background:(STATUS_COLORS[o.status]||'#999')+'18' }}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ MENU MANAGER ══ */}
        {active === 'menu' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'var(--sp-6)', flexWrap:'wrap', gap:'var(--sp-4)' }}>
              <div>
                <h1 className="headline-lg">Menu Manager</h1>
                <p className="body-sm text-muted mt-1">
                  {menuItems.length} items · {menuItems.filter(i=>i.available).length} visible · {apiMode?'Saved to Database':'Saved to localStorage'}
                </p>
              </div>
              <div style={{ display:'flex', gap:'var(--sp-3)', flexWrap:'wrap' }}>
                <button className="btn btn-outline" onClick={resetMenu} style={{ fontSize:'0.62rem', padding:'0.6rem 1.2rem', display:'flex', alignItems:'center', gap:4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'0.9rem' }}>restart_alt</span> Reset to Default
                </button>
                <button className="btn btn-outline" onClick={loadData} style={{ fontSize:'0.62rem', padding:'0.6rem 1.2rem', display:'flex', alignItems:'center', gap:4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'0.9rem' }}>refresh</span> Sync DB
                </button>
                <button className="btn btn-primary" onClick={openAdd} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'1.1rem' }}>add</span> Add Item
                </button>
              </div>
            </div>

            {/* Category filter tabs */}
            <div style={{ display:'flex', gap:'var(--sp-2)', marginBottom:'var(--sp-6)', flexWrap:'wrap' }}>
              {['all',...CATS].map(c=>(
                <button key={c} onClick={()=>setMenuFilter(c)} className="btn" style={{
                  padding:'0.4rem 1rem', fontSize:'0.62rem', textTransform:'capitalize',
                  background:menuFilter===c?'var(--stone-900)':'transparent',
                  color:menuFilter===c?'#fff':'var(--on-surface-variant)',
                  border:'1px solid', borderColor:menuFilter===c?'var(--stone-900)':'var(--outline-variant)',
                }}>
                  {c==='all'?`All (${menuItems.length})`:c+` (${menuItems.filter(i=>i.cat===c).length})`}
                </button>
              ))}
            </div>

            {loading && <div style={{ textAlign:'center', padding:'var(--sp-8)', color:'var(--on-surface-variant)' }}>Loading…</div>}

            <div className="card" style={{ overflowX:'auto' }}>
              <table className="data-table" style={{ minWidth:800 }}>
                <thead>
                  <tr>
                    <th style={{ width:56 }}>Photo</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Halal</th>
                    <th>Status</th>
                    <th style={{ minWidth:130 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayMenu.length === 0 && !loading && (
                    <tr><td colSpan={7} style={{ textAlign:'center', padding:'var(--sp-12)', color:'var(--on-surface-variant)' }}>No items here.</td></tr>
                  )}
                  {displayMenu.map(item=>(
                    <tr key={item.id}>
                      <td>
                        <img src={item.img} alt={item.name} style={{ width:48, height:48, objectFit:'cover', borderRadius:6 }}
                          onError={e=>e.target.style.opacity=0.2} />
                      </td>
                      <td style={{ maxWidth:260 }}>
                        <div style={{ fontWeight:600, marginBottom:2 }}>{item.name}</div>
                        {item.jp && <div style={{ fontSize:'0.72rem', color:'var(--on-surface-variant)', marginBottom:2 }}>{item.jp}</div>}
                        {item.badge && <span style={{ background:'var(--primary)', color:'#fff', fontSize:'0.52rem', padding:'1px 7px', fontFamily:'var(--font-label)', fontWeight:700 }}>{item.badge}</span>}
                      </td>
                      <td><span className="admin-cat-chip">{item.cat}</span></td>
                      <td style={{ fontWeight:700, color:'var(--secondary)', fontSize:'1rem' }}>${item.price}</td>
                      <td style={{ color:item.halal?'#15803d':'#999', fontWeight:700, fontSize:'0.82rem' }}>{item.halal?'☪ Yes':'—'}</td>
                      <td>
                        <button onClick={()=>toggleItem(item.id)} className="admin-status-btn"
                          style={{ background:item.available?'#f0fdf4':'#fff1f2', color:item.available?'#15803d':'#be123c', borderColor:item.available?'#bbf7d0':'#fecdd3' }}>
                          <span style={{ width:6, height:6, borderRadius:'50%', background:item.available?'#16a34a':'#dc2626', display:'inline-block', marginRight:5 }}></span>
                          {item.available?'Visible':'Hidden'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:5 }}>
                          <button className="btn btn-outline" onClick={()=>openEdit(item)}
                            style={{ fontSize:'0.56rem', padding:'5px 10px', display:'flex', alignItems:'center', gap:3 }}>
                            <span className="material-symbols-outlined" style={{ fontSize:'0.85rem' }}>edit</span> Edit
                          </button>
                          <button onClick={()=>setDeleteTarget(item)}
                            style={{ fontSize:'0.56rem', padding:'5px 10px', display:'flex', alignItems:'center', gap:3, fontFamily:'var(--font-label)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', background:'#fff1f2', color:'#be123c', border:'1px solid #fecdd3', cursor:'pointer' }}>
                            <span className="material-symbols-outlined" style={{ fontSize:'0.85rem' }}>delete</span> Del
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
              <div className="admin-modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setShowForm(false);}}>
                <div className="admin-modal">
                  <div className="admin-modal__header">
                    <h2 className="headline-sm">{editingId?'Edit Item':'Add New Item'}</h2>
                    <button onClick={()=>setShowForm(false)} className="admin-modal__close">✕</button>
                  </div>
                  <div className="admin-modal__body">
                    {form.img && <img src={form.img} alt="preview" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:6, marginBottom:'var(--sp-5)' }} onError={e=>e.target.style.display='none'} />}
                    <div className="form-group mb-4">
                      <label className="form-label">Item Name *</label>
                      <input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Chicken Teriyaki" />
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label">Japanese / Arabic Name</label>
                      <input className="form-input" value={form.jp} onChange={e=>setForm(f=>({...f,jp:e.target.value}))} placeholder="e.g. 鶏の照り焼き" />
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--sp-4)', marginBottom:'var(--sp-4)' }}>
                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select className="form-input form-select" value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}>
                          {CATS.map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price (USD) *</label>
                        <input className="form-input" type="number" min="1" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0.00" />
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label">Badge (optional)</label>
                      <input className="form-input" value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))} placeholder="e.g. Popular, New, Chef's Choice" />
                    </div>
                    <div className="form-group mb-4">
                      <label className="form-label">Image URL</label>
                      <input className="form-input" value={form.img} onChange={e=>setForm(f=>({...f,img:e.target.value}))} placeholder="https://images.unsplash.com/…" />
                    </div>
                    <div className="form-group mb-6">
                      <label className="form-label">Description</label>
                      <textarea className="form-input form-textarea" rows={3} value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Describe the dish…" />
                    </div>
                    <div style={{ display:'flex', gap:'var(--sp-8)', marginBottom:'var(--sp-8)' }}>
                      <label className="admin-checkbox-label">
                        <input type="checkbox" checked={form.halal} onChange={e=>setForm(f=>({...f,halal:e.target.checked}))} style={{ accentColor:'var(--primary)' }} />
                        ☪ Halal Certified
                      </label>
                      <label className="admin-checkbox-label">
                        <input type="checkbox" checked={form.available} onChange={e=>setForm(f=>({...f,available:e.target.checked}))} style={{ accentColor:'var(--primary)' }} />
                        Visible on Menu
                      </label>
                    </div>
                    <div style={{ display:'flex', gap:'var(--sp-4)', justifyContent:'flex-end' }}>
                      <button className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={saveItem}>{editingId?'Save Changes':'Add to Menu'}</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirm */}
            {deleteTarget && (
              <div className="admin-modal-backdrop">
                <div className="admin-modal" style={{ maxWidth:400, textAlign:'center' }}>
                  <div className="admin-modal__body">
                    <span className="material-symbols-outlined" style={{ fontSize:'3rem', color:'var(--primary)', display:'block', marginBottom:'var(--sp-4)' }}>warning</span>
                    <h3 className="headline-sm mb-4">Delete "{deleteTarget.name}"?</h3>
                    <p className="body-sm text-muted mb-8">This permanently removes it from the menu{apiMode?' and the database':' and local storage'}.</p>
                    <div style={{ display:'flex', gap:'var(--sp-4)', justifyContent:'center' }}>
                      <button className="btn btn-outline" onClick={()=>setDeleteTarget(null)}>Cancel</button>
                      <button className="btn btn-primary" onClick={()=>deleteItem(deleteTarget.id)}>Yes, Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ ORDERS ══ */}
        {active === 'orders' && (
          <div>
            <h1 className="headline-lg mb-8">Orders</h1>
            {orders.length === 0 ? (
              <div className="card" style={{ padding:'var(--sp-12)', textAlign:'center', color:'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'3rem', display:'block', marginBottom:'var(--sp-4)' }}>receipt_long</span>
                <p className="body-md">No orders yet. Start the backend server to track live orders.</p>
              </div>
            ) : (
              <div className="card" style={{ overflowX:'auto' }}>
                <table className="data-table" style={{ minWidth:700 }}>
                  <thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Total</th><th>Mode</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.map((o,i)=>(
                      <tr key={i}>
                        <td style={{ fontWeight:700 }}>#{o.id}</td>
                        <td>{o.customer||'Guest'}</td>
                        <td style={{ fontSize:'0.78rem', color:'var(--on-surface-variant)' }}>
                          {o.items? (Array.isArray(o.items)?o.items.map(x=>x.name).join(', '):o.items_json):'-'}
                        </td>
                        <td style={{ fontWeight:700 }}>${Number(o.total).toFixed(2)}</td>
                        <td style={{ fontSize:'0.75rem' }}>{o.mode}</td>
                        <td><span style={{ color:STATUS_COLORS[o.status]||'#999', fontFamily:'var(--font-label)', fontSize:'0.6rem', fontWeight:700, padding:'3px 10px', background:(STATUS_COLORS[o.status]||'#999')+'18' }}>{o.status}</span></td>
                        <td style={{ fontSize:'0.75rem', color:'var(--on-surface-variant)' }}>{o.created_at?.slice(0,10)||'-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ RESERVATIONS ══ */}
        {active === 'reservations' && (
          <div>
            <h1 className="headline-lg mb-8">Reservations</h1>
            {reservations.length === 0 ? (
              <div className="card" style={{ padding:'var(--sp-12)', textAlign:'center', color:'var(--on-surface-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'3rem', display:'block', marginBottom:'var(--sp-4)' }}>event_seat</span>
                <p className="body-md">No reservations yet.</p>
              </div>
            ) : (
              <div className="card" style={{ overflowX:'auto' }}>
                <table className="data-table" style={{ minWidth:600 }}>
                  <thead><tr><th>Name</th><th>Date</th><th>Time</th><th>Party</th><th>Email</th><th>Status</th></tr></thead>
                  <tbody>
                    {reservations.map((r,i)=>(
                      <tr key={i}>
                        <td style={{ fontWeight:600 }}>{r.first_name} {r.last_name}</td>
                        <td>{r.date}</td>
                        <td>{r.time}</td>
                        <td>{r.party_size} guests</td>
                        <td style={{ fontSize:'0.8rem' }}>{r.email}</td>
                        <td><span style={{ color:STATUS_COLORS[r.status]||'#999', fontFamily:'var(--font-label)', fontSize:'0.6rem', fontWeight:700, padding:'3px 10px', background:(STATUS_COLORS[r.status]||'#999')+'18' }}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ OTHER ══ */}
        {(active==='analytics'||active==='settings') && (
          <div>
            <h1 className="headline-lg mb-8">{active==='analytics'?'Analytics':'Settings'}</h1>
            <div className="card" style={{ padding:'var(--sp-12)', textAlign:'center', color:'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'3rem', display:'block', marginBottom:'var(--sp-4)' }}>construction</span>
              <p className="body-md">Coming in Phase 2 — backend integration.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
