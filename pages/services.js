import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Services() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: 30,
    is_active: true
  });

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

    fetchServices(token);
  }, [router]);

  const fetchServices = async (token) => {
    try {
      const response = await fetch('/api/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
    const method = editingService ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        alert(`Layanan berhasil ${editingService ? 'diupdate' : 'ditambahkan'}!`);
        setShowModal(false);
        resetForm();
        fetchServices(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration || 30,
      is_active: service.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Layanan berhasil dihapus!');
        fetchServices(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: 30,
      is_active: true
    });
    setEditingService(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Kelola Layanan - Barbershop Ucok POS</title>
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
          <div className="page-header">
            <h1 className="page-title">✂️ Kelola Layanan</h1>
            <button className="btn btn-primary" onClick={() => {
              resetForm();
              setShowModal(true);
            }}>
              + Tambah Layanan
            </button>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Durasi</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        Tidak ada layanan
                      </td>
                    </tr>
                  ) : (
                    services.map(s => (
                      <tr key={s.id}>
                        <td>#{s.id}</td>
                        <td>{s.name}</td>
                        <td>{s.description || '-'}</td>
                        <td className="text-right">Rp {s.price.toLocaleString()}</td>
                        <td>{s.duration || 30} menit</td>
                        <td>
                          <span className={`badge ${s.is_active ? 'badge-success' : 'badge-secondary'}`}>
                            {s.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEdit(s)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(s.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{editingService ? '✏️ Edit Layanan' : '➕ Tambah Layanan Baru'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Layanan *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Harga *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Durasi (menit)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    placeholder="30"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    {' '}Aktif
                  </label>
                </div>

                <div className="button-group">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Update' : 'Tambah'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
