"use client";
import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const drawerWidth = 240;

const Navbaradmin: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
      </List>
      <List>
        <Link href="/admin/author" passHref>
          <ListItemButton>
            <ListItemText primary="Author" />
          </ListItemButton>
        </Link>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbaradmin;
