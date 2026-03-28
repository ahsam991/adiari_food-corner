import { useState } from 'react';
import { apiCreateReservation } from '../api';

export default function Reservation() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    party_size: 2,
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await apiCreateReservation(formData);
      setMessage({ type: 'success', text: '✓ Reservation confirmed! We will send you a confirmation email shortly.' });
      setFormData({
        date: '',
        time: '',
        party_size: 2,
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to submit reservation: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="section" style={{paddingTop: 'var(--sp-24)', backgroundColor: 'var(--surface)'}}>
        <div className="container" style={{maxWidth: '800px'}}>
          <div className="section-header section-header--center mb-12 fade-up">
            <span className="section-eyebrow">Secure Your Table</span>
            <h1 className="headline-xl">Reservations</h1>
            <p className="body-md text-muted mt-4">We accept reservations up to 30 days in advance. For parties larger than 6, please call us directly.</p>
          </div>

          {message && (
            <div className={`card mb-6 fade-up ${message.type === 'success' ? 'bg-green-900' : 'bg-red-900'}`} style={{padding: 'var(--sp-4)', textAlign: 'center'}}>
              <p className="body-md">{message.text}</p>
            </div>
          )}

          <div className="card fade-up" data-delay="1" style={{padding: 'var(--sp-12)'}}>
            <form onSubmit={handleSubmit}>
              <div className="grid-2 mb-6">
                <div>
                  <label className="label-sm font-bold mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full"
                    style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                  />
                </div>
                <div>
                  <label className="label-sm font-bold mb-2">Time</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full"
                    style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                  >
                    <option value="">Select Time</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="label-sm font-bold mb-2">Party Size</label>
                <input
                  type="number"
                  name="party_size"
                  value={formData.party_size}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  required
                  className="w-full"
                  style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                />
              </div>

              <div className="border-t pt-6 mb-6">
                <h3 className="headline-sm mb-4">Contact Details</h3>
                <div className="grid-2 mb-4">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="w-full"
                    style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                  />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className="w-full"
                    style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full mb-4"
                  style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                  className="w-full"
                  style={{padding: 'var(--sp-3)', border: '1px solid var(--border)', backgroundColor: 'transparent'}}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                style={{justifyContent: 'center'}}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
