"use client";
import React, { useEffect, useState } from 'react';
import Navbaradmin from "../../components/client/์Navbaradmin";
import styled from "styled-components";
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebaseConfig';

const Edit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/admin'); 
      } else {
        setLoading(false); 
      }
    });

    return () => unsubscribe(); 
  }, [router]);

  if (loading) return <h1>Loading...</h1>; 

  return (
    <Main>
      <Navbaradmin />
      <h1>Edit</h1>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  margin-top: 80px;
  margin-left: 10px;
`;

export default Edit;
