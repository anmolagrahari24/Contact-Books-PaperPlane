import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../context/ContactContext';
import { TextField, Button, Card, CardContent, Autocomplete } from '@mui/material';

const predefinedTags = ['Client', 'Vendor', 'Personal', 'Work'];

export default function ContactForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, addContact, updateContact } = useContacts();
  
  const existingContact = id ? contacts.find(c => c.id === id) : null;
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', notes: '', tags: []
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (existingContact) setFormData(existingContact);
  }, [existingContact]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (e) => {
    setIsDirty(true);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleTagsChange = (_, newValue) => {
    setIsDirty(true);
    setFormData({ ...formData, tags: newValue });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    } else {
      const duplicate = contacts.find(c => c.email.toLowerCase() === formData.email.toLowerCase() && c.id !== id);
      if (duplicate) newErrors.email = 'Email already exists';
    }

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (id) {
      updateContact(id, formData);
    } else {
      addContact(formData);
    }
    setIsDirty(false);
    navigate('/');
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) return;
    navigate(-1);
  };

  return (
    <Card maxWidth="md" className="mx-auto mt-8">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} fullWidth />
            <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth />
          </div>
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} fullWidth />
          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={!!errors.phone} helperText={errors.phone} fullWidth />
          <TextField label="Company" name="company" value={formData.company} onChange={handleChange} fullWidth />
          
          <Autocomplete
            multiple
            freeSolo
            options={predefinedTags}
            value={formData.tags || []}
            onChange={handleTagsChange}
            renderInput={(params) => <TextField {...params} label="Tags" placeholder="Add tags" />}
          />
          
          <TextField label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={4} fullWidth />

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleCancel} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {id ? 'Update Contact' : 'Save Contact'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}