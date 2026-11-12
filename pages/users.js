import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Users() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'KASIR',
    is_active: true,
    permissions: []
  });

  const availablePermissions = [
    { value: 'dashboard', label: '🏠 Dashboard', description: 'Akses halaman utama' },
    { value: 'transactions', label: '📜 Riwayat Transaksi', description: 'Lihat daftar transaksi' },
    { value: 'transaction_create', label: '🛒 Buat Transaksi', description: 'Membuat transaksi baru' },
    { value: 'shifts', label: '📂 Kelola Shift', description: 'Buka dan tutup shift' },
    { value: 'reports', label: '📊 Laporan', description: 'Lihat laporan harian/bulanan' },
    { value: 'customers', label: '👥 Kelola Customer', description: 'CRUD customer' },
    { value: 'kapsters', label: '💈 Kelola Kapster', description: 'CRUD kapster' },
    { value: 'services', label: '✂️ Kelola Layanan', description: 'CRUD layanan' },
    { value: 'products', label: '🧴 Kelola Produk', description: 'CRUD produk' },
    { value: 'discounts', label: '🏷️ Kelola Diskon', description: 'CRUD diskon' },
    { value: 'users', label: '👤 Kelola User', description: 'CRUD user (Owner only)' }
  ];

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
      
      // Check if owner (case-insensitive)
      if (parsedUser.role?.toUpperCase() !== 'OWNER') {
        alert('Akses ditolak! Hanya Owner yang dapat mengakses halaman ini.');
        router.push('/dashboard');
        return;
      }
    }

    fetchUsers(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async (token) => {
    try {
      const response = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 403) {
        alert('Akses ditolak!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const body = { ...formData };
      // Don't send password if editing and password is empty
      if (editingUser && !body.password) {
        delete body.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        alert(`User berhasil ${editingUser ? 'diupdate' : 'ditambahkan'}!`);
        setShowModal(false);
        resetForm();
        fetchUsers(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = async (userToEdit) => {
    setEditingUser(userToEdit);
    
    // Fetch user permissions
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userToEdit.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await response.json();
      
      setFormData({
        username: userToEdit.username,
        password: '',
        full_name: userToEdit.full_name,
        role: userToEdit.role,
        is_active: userToEdit.is_active,
        permissions: userData.permissions || []
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setFormData({
        username: userToEdit.username,
        password: '',
        full_name: userToEdit.full_name,
        role: userToEdit.role,
        is_active: userToEdit.is_active,
        permissions: []
      });
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('User berhasil dihapus!');
        fetchUsers(token);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      full_name: '',
      role: 'KASIR',
      is_active: true,
      permissions: ['dashboard', 'transactions', 'transaction_create', 'shifts'] // Default for kasir
    });
    setEditingUser(null);
  };

  const togglePermission = (permission) => {
    const current = formData.permissions || [];
    if (current.includes(permission)) {
      setFormData({
        ...formData,
        permissions: current.filter(p => p !== permission)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...current, permission]
      });
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Kelola User - Barbershop Ucok POS</title>
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
            <span className="user-info">👤 {user?.full_name || user?.username} (OWNER)</span>
          </div>
        </nav>

        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">👥 Kelola User / Kasir</h1>
            <button className="btn btn-primary" onClick={() => {
              resetForm();
              setShowModal(true);
            }}>
              + Tambah User
            </button>
          </div>

          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Nama Lengkap</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                        Tidak ada user
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.full_name}</td>
                        <td>
                          <span className={`badge ${u.role === 'OWNER' ? 'badge-danger' : 'badge-info'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.is_active ? 'badge-success' : 'badge-secondary'}`}>
                            {u.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEdit(u)}
                            >
                              Edit
                            </button>
                            {u.role !== 'OWNER' && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(u.id)}
                              >
                                Hapus
                              </button>
                            )}
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
              <h3>{editingUser ? '✏️ Edit User' : '➕ Tambah User Baru'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={editingUser !== null}
                  />
                </div>

                <div className="form-group">
                  <label>Password {editingUser ? '(Kosongkan jika tidak diubah)' : '*'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    placeholder={editingUser ? 'Kosongkan jika tidak diubah' : ''}
                  />
                </div>

                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <option value="KASIR">Kasir</option>
                    <option value="OWNER">Owner</option>
                  </select>
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

                <div className="form-group">
                  <label style={{ fontWeight: '600', fontSize: '1.05rem', marginBottom: '1rem', display: 'block' }}>
                    🔐 Hak Akses / Permissions
                  </label>
                  <div style={{ 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    background: '#F9FAFB'
                  }}>
                    {availablePermissions.map(perm => (
                      <div key={perm.value} style={{ marginBottom: '0.75rem' }}>
                        <label style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#EEF2FF'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <input
                            type="checkbox"
                            checked={(formData.permissions || []).includes(perm.value)}
                            onChange={() => togglePermission(perm.value)}
                            style={{ marginTop: '0.25rem', marginRight: '0.75rem' }}
                          />
                          <div>
                            <div style={{ fontWeight: '500', color: '#111827' }}>{perm.label}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>{perm.description}</div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <div style={{ 
                    marginTop: '0.75rem', 
                    padding: '0.75rem', 
                    background: '#FEF3C7', 
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#92400E'
                  }}>
                    💡 Tip: User dengan role OWNER sebaiknya diberi semua permission
                  </div>
                </div>

                <div className="button-group">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Update' : 'Tambah'}
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
