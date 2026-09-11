import { useState, useMemo } from 'react';
import { useContacts } from '../context/ContactContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Card, CardContent, Typography, Chip, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';

export default function ContactList() {
  const { contacts } = useContacts();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [sortBy, setSortBy] = useState('nameAsc');

  const allTags = useMemo(() => {
    const tags = new Set();
    contacts.forEach(c => c.tags?.forEach(t => tags.add(t)));
    return ['All', ...Array.from(tags)];
  }, [contacts]);

  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => 
        c.firstName.toLowerCase().includes(lowerSearch) || 
        c.lastName.toLowerCase().includes(lowerSearch) ||
        c.email.toLowerCase().includes(lowerSearch) ||
        c.company.toLowerCase().includes(lowerSearch)
      );
    }

    if (filterTag !== 'All') {
      result = result.filter(c => c.tags?.includes(filterTag));
    }

    result.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (sortBy === 'nameAsc') return nameA.localeCompare(nameB);
      if (sortBy === 'nameDesc') return nameB.localeCompare(nameA);
      if (sortBy === 'dateAdded') return b.dateAdded - a.dateAdded;
      return 0;
    });

    return result;
  }, [contacts, search, filterTag, sortBy]);

  if (contacts.length === 0) {
    return (
      <div className="text-center mt-20">
        <Typography variant="h5" color="textSecondary" gutterBottom>No contacts found.</Typography>
        <Button variant="contained" onClick={() => navigate('/add')}>Add Your First Contact</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card sx={{ p: 2 }}>
        <div className="flex flex-col md:flex-row gap-4">
          <TextField 
            label="Search name, email, company" 
            variant="outlined" 
            fullWidth 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Tag</InputLabel>
            <Select value={filterTag} label="Filter by Tag" onChange={(e) => setFilterTag(e.target.value)}>
              {allTags.map(tag => <MenuItem key={tag} value={tag}>{tag}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
              <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
              <MenuItem value="dateAdded">Date Added</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedContacts.map(contact => (
          <Card 
            key={contact.id} 
            sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}
            onClick={() => navigate(`/contact/${contact.id}`)}
          >
            <CardContent>
              <Typography variant="h6">{contact.firstName} {contact.lastName}</Typography>
              <Typography color="textSecondary" variant="body2">{contact.email}</Typography>
              <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>{contact.company}</Typography>
              <div className="flex gap-1 flex-wrap">
                {contact.tags?.map(tag => (
                  <Chip key={tag} label={tag} size="small" color="primary" variant="outlined" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}