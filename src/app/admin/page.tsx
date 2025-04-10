"use client";
import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "./firebase/firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  const handleAuthUser = useCallback(async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists() && userDoc.data()?.role === "admin") {
      router.push("/admin/ebook");
    } else {
      await auth.signOut();
      setError("Access denied: You are not an admin.");
      setLoading(false);
    }
  }, [router]); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await handleAuthUser(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [handleAuthUser]);

  const login = async () => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await handleAuthUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  if (loading) return null;

  return (
    <StyledContainer>
      <StyledPaper elevation={3}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Login</Typography>

        <StyledForm>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          {error && (
            <Typography color="error" variant="body2">{error}</Typography>
          )}
          <Button variant="contained" color="primary" onClick={login} fullWidth>
            Login
          </Button>
        </StyledForm>
      </StyledPaper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  width: 100%;
  max-width: 400px; 
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default Login;
