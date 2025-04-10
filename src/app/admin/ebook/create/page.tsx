"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseConfig"; // ใช้ auth จาก Firebase
import { saveEbook } from "../../api/ebookApi";
import Navbaradmin from "../../components/client/Navbaradmin";
import Navbarhead from "../../components/client/Navbarhead";
import CreateComponent, {
  CreateComponentRef,
} from "../../components/client/create";
import { Button, CircularProgress } from "@mui/material";

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<CreateComponentRef>(null);

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

  const handleSubmit = async () => {
    if (!formRef.current) return;
    const formData = formRef.current.getFormData();

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not authenticated!");
      return;
    }

    const formDataWithUserId = { ...formData, userId };

    setUploading(true);
    try {
      const response = await saveEbook(formDataWithUserId);
      if (response.success && response.id) {

        router.push(`/admin/ebook/create/${response.id}`);
      } else {
        alert("Upload Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <div>
        <CreateComponent ref={formRef} />
        <Buttonsubmit onClick={handleSubmit} disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : "SUBMIT"}
        </Buttonsubmit>
      </div>
    </Main>
  );
};

export default Create;

const Main = styled.div`
  display: flex;
  justify-content: center;
`;

const Buttonsubmit = styled(Button)`
  color: white;
  padding: 10px;
  margin-top: 20px;
  background-color: #318ce7;
  display: flex;
  justify-content: center;
  cursor: pointer;
  border: none;
`;
