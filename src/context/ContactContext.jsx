import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const initialData = [
  { id: uuidv4(), firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phone: '555-0101', company: 'TechCorp', tags: ['Client'], notes: 'Key account.', dateAdded: Date.now() },
  { id: uuidv4(), firstName: 'Bob', lastName: 'Smith', email: 'bob@smith.net', phone: '555-0102', company: 'VendorInc', tags: ['Vendor'], notes: '', dateAdded: Date.now() - 10000 },
];

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('contacts');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact) => {
    setContacts(prev => [...prev, { ...contact, id: uuidv4(), dateAdded: Date.now() }]);
  };

  const updateContact = (id, updatedData) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updatedData } : c));
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <ContactContext.Provider value={{ contacts, addContact, updateContact, deleteContact }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => useContext(ContactContext);