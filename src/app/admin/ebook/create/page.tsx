"use client";
import React, { useEffect, useState } from "react";
import Navbaradmin from "../../components/client/Navbaradmin";
import Navbarhead from "../../components/client/Navbarhead";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseConfig";
import CreateComponent from "../../components/client/create";

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  if (loading) return <h1>Loading...</h1>;

  return (
    <Main>
      <Navbaradmin />
      <Navbarhead />
      <CreateComponent />
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  justify-content: center;
`;


export default Create;
