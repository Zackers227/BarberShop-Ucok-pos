import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Kapsters() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [kapsters, setKapsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingKapster, setEditingKapster] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    commission_rate: 0,
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
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    fetchKapsters(token);
  }, [router]);

  const fetchKapsters = async (token) => {
    try {
      const response = await fetch('/api/kapsters', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setKapsters(data);
    } catch (error) {
      console.error('Error fetching kapsters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const url = editingKapster ? `/api/kapsters/${editingKapster.id}` : '/api/kapsters';
    const method = editingKapster ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(`Kapster berhasil ${editingKapster ? 'diupdate' : 'ditambahkan'}!`);
        setShowModal(false);
        resetForm();
        fetchKapsters(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error saving kapster:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (kapster) => {
    setEditingKapster(kapster);
    setFormData({
      name: kapster.name,
      phone: kapster.phone || '',
      commission_rate: kapster.commission_rate || 0,
      is_active: kapster.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus kapster ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/kapsters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Kapster berhasil dihapus!');
        fetchKapsters(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting kapster:', error);
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      commission_rate: 0,
      is_active: true
    });
    setEditingKapster(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Kelola Kapster - Barbershop Ucok POS</title>
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
            <h1 className="page-title">💈 Kelola Kapster</h1>
            <button className="btn btn-primary" onClick={() => {
              resetForm();
              setShowModal(true);
            }}>
              + Tambah Kapster
            </button>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Telepon</th>
                    <th>Komisi (%)</th>
                    <th>Status</th>
                    <th>Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {kapsters.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        Tidak ada kapster
                      </td>
                    </tr>
                  ) : (
                    kapsters.map(k => (
                      <tr key={k.id}>
                        <td>#{k.id}</td>
                        <td>{k.name}</td>
                        <td>{k.phone || '-'}</td>
                        <td>{k.commission_rate || 0}%</td>
                        <td>
                          <span className={`badge ${k.is_active ? 'badge-success' : 'badge-secondary'}`}>
                            {k.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td>{new Date(k.created_at).toLocaleDateString('id-ID')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEdit(k)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(k.id)}
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
              <h3>{editingKapster ? '✏️ Edit Kapster' : '➕ Tambah Kapster Baru'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telepon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div className="form-group">
                  <label>Komisi (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.commission_rate}
                    onChange={(e) => setFormData({ ...formData, commission_rate: parseFloat(e.target.value) })}
                    placeholder="0"
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
                    {editingKapster ? 'Update' : 'Tambah'}
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
