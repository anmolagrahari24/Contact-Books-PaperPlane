import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { ContactProvider } from './context/ContactContext';
import Layout from './components/Layout';
import ContactList from './screens/ContactList';
import ContactForm from './screens/ContactForm';
import ContactDetail from './screens/ContactDetail';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContactProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ContactList />} />
              <Route path="add" element={<ContactForm />} />
              <Route path="edit/:id" element={<ContactForm />} />
              <Route path="contact/:id" element={<ContactDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ContactProvider>
    </ThemeProvider>
  );
}