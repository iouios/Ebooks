'use client';
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig'; 
import { signOut } from 'firebase/auth'; 
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link";

const drawerWidth = 240;

const Ebook = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/admin");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      console.log('Logout successful');
      router.push('/admin'); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Ebook
      </Typography>
      <List>
        <Link href="/admin/ebook" passHref>
          <ListItemButton>
            <ListItemText primary="Ebook" />
          </ListItemButton>
        </Link>
        <Link href="/admin/ebook/create" passHref>
          <ListItemButton>
            <ListItemText primary="Create" />
          </ListItemButton>
        </Link>
        <Link href="/admin/ebook/edit" passHref>
          <ListItemButton>
            <ListItemText primary="Edit" />
          </ListItemButton>
        </Link>
      </List>
    </Box>
  );

  if (loading) return <Typography variant="h6">Loading...</Typography>;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Navbar
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />

        <Container>
          <Paper sx={{ p: 2 }}>
            <Card>
              <CardHeader title="Ebook" />
              <CardContent>
                <p>Hi there</p>
              </CardContent>
            </Card>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default  Ebook; 
