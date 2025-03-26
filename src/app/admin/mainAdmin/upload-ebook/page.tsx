"use client";
import React, { useEffect} from 'react';
import Navbaradmin from "../../components/client/์Navbaradmin";
import styled from "styled-components";
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase/firebaseConfig'; 

const Uploadebook = () => {
    const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push('/admin');
    } else {
      console.error("error");

    }
  }, [router]);
  return (
    <Main>
      <Navbaradmin />
      <h1>Upload ebook</h1>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  margin-top: 80px;
  margin-left: 10px;
`;

export default Uploadebook;
