import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Shifts() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [formData, setFormData] = useState({
    starting_cash: '',
    ending_cash: '',
    notes: ''
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchShifts(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchShifts = async (token) => {
    try {
      const response = await fetch('/api/shifts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setShifts(data);
      
      // Find active shift (shift without closed_at is active)
      const active = data.find(s => !s.closed_at);
      setCurrentShift(active || null);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenShift = async () => {
    if (!formData.starting_cash) {
      alert('Masukkan modal awal!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          starting_cash: parseFloat(formData.starting_cash),
          notes: formData.notes
        })
      });

      if (response.ok) {
        alert('Shift berhasil dibuka!');
        setShowOpenModal(false);
        setFormData({ starting_cash: '', ending_cash: '', notes: '' });
        fetchShifts(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error opening shift:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleCloseShift = async () => {
    if (!formData.ending_cash) {
      alert('Masukkan saldo akhir!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/shifts/${currentShift.id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ending_cash: parseFloat(formData.ending_cash),
          notes: formData.notes
        })
      });

      if (response.ok) {
        alert('Shift berhasil ditutup!');
        setShowCloseModal(false);
        setFormData({ starting_cash: '', ending_cash: '', notes: '' });
        fetchShifts(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error closing shift:', error);
      alert('Terjadi kesalahan');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Manajemen Shift - Barbershop Ucok POS</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/table.css" />
      </Head>

      <div className="page-container">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>💈 Barbershop Ucok POS</h2>
          </div>
          <div className="navbar-menu">
            <button className="btn btn-secondary btn-sm" onClick={() => router.push('/dashboard')}>
              ← Kembali
            </button>
            <span className="user-info">👤 {user?.full_name || user?.username}</span>
          </div>
        </nav>

        <div className="main-content">
          <h1 className="page-title">⏰ Manajemen Shift</h1>

          {/* Current Shift Status */}
          <div className="card">
            <h3>📊 Status Shift Saat Ini</h3>
            {currentShift ? (
              <div className="shift-status active">
                <div className="shift-info">
                  <p><strong>Shift ID:</strong> #{currentShift.id}</p>
                  <p><strong>Dibuka oleh:</strong> {currentShift.cashier_name}</p>
                  <p><strong>Waktu Buka:</strong> {new Date(currentShift.opened_at).toLocaleString('id-ID')}</p>
                  <p><strong>Modal Awal:</strong> Rp {currentShift.opening_balance?.toLocaleString() || '0'}</p>
                  <p><strong>Total Transaksi:</strong> {currentShift.total_transactions || 0}</p>
                  <p><strong>Total Penjualan:</strong> Rp {currentShift.total_sales?.toLocaleString() || 0}</p>
                </div>
                <button className="btn btn-danger btn-lg" onClick={() => setShowCloseModal(true)}>
                  🔒 Tutup Shift
                </button>
              </div>
            ) : (
              <div className="shift-status inactive">
                <p>Tidak ada shift yang sedang aktif</p>
                <button className="btn btn-primary btn-lg" onClick={() => setShowOpenModal(true)}>
                  🔓 Buka Shift Baru
                </button>
              </div>
            )}
          </div>

          {/* Shift History */}
          <div className="card">
            <h3>📜 Riwayat Shift</h3>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kasir</th>
                    <th>Buka</th>
                    <th>Tutup</th>
                    <th>Modal</th>
                    <th>Penjualan</th>
                    <th>Saldo Akhir</th>
                    <th>Selisih</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                        Belum ada riwayat shift
                      </td>
                    </tr>
                  ) : (
                    shifts.map(shift => {
                      const expected = (parseFloat(shift.opening_balance) || 0) + (parseFloat(shift.total_sales) || 0);
                      const actual = parseFloat(shift.closing_balance) || 0;
                      const diff = actual - expected;
                      
                      return (
                        <tr key={shift.id}>
                          <td>#{shift.id}</td>
                          <td>{shift.cashier_name}</td>
                          <td>{new Date(shift.opened_at).toLocaleString('id-ID')}</td>
                          <td>{shift.closed_at ? new Date(shift.closed_at).toLocaleString('id-ID') : '-'}</td>
                          <td className="text-right">Rp {shift.opening_balance?.toLocaleString() || '0'}</td>
                          <td className="text-right">Rp {shift.total_sales?.toLocaleString() || 0}</td>
                          <td className="text-right">Rp {shift.closing_balance?.toLocaleString() || '-'}</td>
                          <td className={`text-right ${diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : ''}`}>
                            {shift.closed_at ? `Rp ${diff.toLocaleString()}` : '-'}
                          </td>
                          <td>
                            <span className={`badge ${!shift.closed_at ? 'badge-success' : 'badge-secondary'}`}>
                              {!shift.closed_at ? 'Aktif' : 'Tutup'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Buka Shift */}
        {showOpenModal && (
          <div className="modal-overlay" onClick={() => setShowOpenModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>🔓 Buka Shift Baru</h3>
              <div className="form-group">
                <label>Waktu Buka Shift</label>
                <input
                  type="text"
                  value={currentTime.toLocaleString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group">
                <label>Modal Awal *</label>
                <input
                  type="number"
                  value={formData.starting_cash}
                  onChange={(e) => setFormData({ ...formData, starting_cash: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Catatan</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Catatan tambahan (opsional)"
                ></textarea>
              </div>
              <div className="button-group">
                <button className="btn btn-secondary" onClick={() => setShowOpenModal(false)}>
                  Batal
                </button>
                <button className="btn btn-primary" onClick={handleOpenShift}>
                  Buka Shift
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Tutup Shift */}
        {showCloseModal && currentShift && (
          <div className="modal-overlay" onClick={() => setShowCloseModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>🔒 Tutup Shift</h3>
              <div className="form-group">
                <label>Waktu Tutup Shift</label>
                <input
                  type="text"
                  value={currentTime.toLocaleString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
              </div>
              <div className="shift-summary">
                <p><strong>Modal Awal:</strong> Rp {currentShift.opening_balance?.toLocaleString() || '0'}</p>
                <p><strong>Total Penjualan:</strong> Rp {currentShift.total_sales?.toLocaleString() || 0}</p>
                <p><strong>Total Transaksi:</strong> {currentShift.total_transactions || 0}</p>
                <p className="text-success"><strong>Saldo yang Diharapkan:</strong> Rp {((parseFloat(currentShift.opening_balance) || 0) + (parseFloat(currentShift.total_sales) || 0)).toLocaleString()}</p>
              </div>
              <div className="form-group">
                <label>Saldo Akhir (Hitung Kas) *</label>
                <input
                  type="number"
                  value={formData.ending_cash}
                  onChange={(e) => setFormData({ ...formData, ending_cash: e.target.value })}
                  placeholder="0"
                />
              </div>
              {formData.ending_cash && (
                <div className="difference-alert">
                  <p>Selisih: <strong className={
                    parseFloat(formData.ending_cash) - ((parseFloat(currentShift.opening_balance) || 0) + (parseFloat(currentShift.total_sales) || 0)) >= 0 
                      ? 'text-success' 
                      : 'text-danger'
                  }>
                    Rp {(parseFloat(formData.ending_cash) - ((parseFloat(currentShift.opening_balance) || 0) + (parseFloat(currentShift.total_sales) || 0))).toLocaleString()}
                  </strong></p>
                </div>
              )}
              <div className="form-group">
                <label>Catatan Penutupan</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Catatan tambahan (opsional)"
                ></textarea>
              </div>
              <div className="button-group">
                <button className="btn btn-secondary" onClick={() => setShowCloseModal(false)}>
                  Batal
                </button>
                <button className="btn btn-danger" onClick={handleCloseShift}>
                  Tutup Shift
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
