import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Contacts Book
          </Typography>
          <Button color="inherit" component={Link} to="/add">Add Contact</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="flex-1 pb-8">
        <Outlet />
      </Container>
    </div>
  );
}