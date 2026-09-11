import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../context/ContactContext';
import { Card, CardContent, Typography, Button, Avatar, Chip, Divider } from '@mui/material';

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, deleteContact } = useContacts();
  
  const contact = contacts.find(c => c.id === id);

  if (!contact) return <Typography>Contact not found.</Typography>;

  const initials = `${contact.firstName[0]}${contact.lastName ? contact.lastName[0] : ''}`.toUpperCase();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(id);
      navigate('/');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardContent sx={{ p: 4 }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem', bgcolor: 'primary.main' }}>
            {initials}
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <Typography variant="h4" gutterBottom>{contact.firstName} {contact.lastName}</Typography>
            <Typography variant="h6" color="textSecondary">{contact.company || 'No Company'}</Typography>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              {contact.tags?.map(tag => (
                <Chip key={tag} label={tag} color="secondary" size="small" />
              ))}
            </div>
          </div>
        </div>

        <Divider sx={{ my: 4 }} />

        <div className="space-y-4">
          <div>
            <Typography variant="overline" color="textSecondary">Email</Typography>
            <Typography variant="body1">{contact.email}</Typography>
          </div>
          <div>
            <Typography variant="overline" color="textSecondary">Phone</Typography>
            <Typography variant="body1">{contact.phone || 'N/A'}</Typography>
          </div>
          <div>
            <Typography variant="overline" color="textSecondary">Notes</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {contact.notes || 'No notes available.'}
            </Typography>
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200">
          <Button variant="contained" onClick={() => navigate(`/edit/${contact.id}`)}>Edit</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>Delete</Button>
          <Button sx={{ ml: 'auto' }} onClick={() => navigate('/')}>Back to List</Button>
        </div>
      </CardContent>
    </Card>
  );
}