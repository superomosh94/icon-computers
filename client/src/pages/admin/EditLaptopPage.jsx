import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { store } from '../../lib/adminStore';
import LaptopForm from '../../components/admin/LaptopForm';

export default function EditLaptopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    store.getProducts().then(products => {
      const found = products.find(p => p.id === Number(id));
      setLaptop(found);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="empty-state"><h3>Loading...</h3></div>;

  if (!laptop) {
    return (
      <div className="empty-state">
        <h3>Laptop not found</h3>
      </div>
    );
  }

  const handleSave = async (form) => {
    await store.saveLaptop({ ...form, id: Number(id) });
    setSubmitted(true);
    setTimeout(() => navigate('/admin'), 1500);
  };

  if (submitted) {
    return (
      <div className="admin-success-state">
        <h2>Laptop updated successfully!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Edit Laptop</h1>
      <LaptopForm
        initialData={laptop}
        onSave={handleSave}
        onCancel={() => navigate('/admin')}
      />
    </div>
  );
}
