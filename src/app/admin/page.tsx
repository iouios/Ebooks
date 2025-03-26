'use client';
import React, { useState } from "react";
import { auth } from "./firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import styled from "styled-components";
import { TextField, Button, Typography, Paper } from "@mui/material";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async () => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful! User:", userCredential.user);
      router.push("/admin/mainAdmin");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

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
