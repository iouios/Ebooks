"use client";
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const drawerWidth = 240;

const Navbaradmin: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{ width: drawerWidth }}>
      <Title>Ebook</Title>
      <List>
        <Link href="/admin/ebook" passHref>
          <ListItemButton selected={pathname === "/admin/ebook"}>
            <ListItemText
              primary="Ebook"
              sx={{
                color: pathname === "/admin/ebook" ? "blue" : "inherit",
              }}
            />
          </ListItemButton>
        </Link>
      </List>
      <List>
        <Link href="/admin/author" passHref>
          <ListItemButton selected={pathname === "/admin/author"}>
            <ListItemText
              primary="Author"
              sx={{
                color: pathname === "/admin/author" ? "blue" : "inherit",
              }}
            />
          </ListItemButton>
        </Link>
      </List>
    </div>
  );

  return (
    <Container>
      <Nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": DrawerPaper,
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": DrawerPaper,
          }}
          open
        >
          {drawer}
        </Drawer>
      </Nav>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
`;

const Nav = styled.nav`
  width: ${drawerWidth}px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: auto;
  }
`;

const DrawerPaper = {
  boxSizing: "border-box",
  width: drawerWidth,
};

const Title = styled.h6`
  padding: 16px;
  font-size: 1.25rem;
  font-weight: 500;
`;

export default Navbaradmin;
