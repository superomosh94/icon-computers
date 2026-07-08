import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../../lib/adminStore';
import LaptopForm from '../../components/admin/LaptopForm';

export default function AddLaptopPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async (form) => {
    await store.saveLaptop(form);
    setSubmitted(true);
    setTimeout(() => {
      navigate('/admin');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="admin-success-state">
        <h2>Laptop added successfully!</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Add New Laptop</h1>
      <LaptopForm
        initialData={null}
        onSave={handleSave}
        onCancel={() => navigate('/admin')}
      />
    </div>
  );
}
