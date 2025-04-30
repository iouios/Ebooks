"use client";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseConfig";
import { saveEbook } from "../../../api/ebook/route";
import Navbaradmin from "../../components/client/Navbaradmin";
import Navbarhead from "../../components/client/Navbarhead";
import CreateComponent, {
  CreateComponentRef,
} from "../../components/client/create";
import { CircularProgress } from "@mui/material";

interface FormDataType {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  ebook_url: string;
  image_url: string;
}

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<CreateComponentRef>(null);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);

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

  const handleFileAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileA(e.target.files[0]);
    } else {
      setFileA(null);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/admin");
      } else {
        // ✅ ดึง Token และแสดงใน console
        try {
          const idTokenResult = await user.getIdTokenResult(true); // true = force refresh
          console.log("🔥 ID Token:", idTokenResult.token);
          console.log("🔐 Custom Claims:", idTokenResult.claims);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
  
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [router]);
  

  const handleFileBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileB(e.target.files[0]);
    } else {
      setFileB(null);
    }
  };

  const handleSubmit = async () => {
    if (!formRef.current) return;

    const formData = formRef.current.getFormData();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("User not authenticated!");
      return;
    }

    const formDataWithUserId: FormDataType = { ...formData };

    setUploading(true);
    try {
      if (fileA && fileB) {
        const ebookUrl = await formRef.current.uploadEbookFile(fileA);
        const imageUrl = await formRef.current.uploadImageFile(fileB);

        formDataWithUserId.ebook_url = ebookUrl;
        formDataWithUserId.image_url = imageUrl;

        const response = await saveEbook(formDataWithUserId);
        if (response.success && response.id) {
          router.push(`/admin/ebook/edit/${response.id}`);
        } else {
          console.log("Upload Failed");
        }
      } else {
        console.log("Please upload both ebook and image files!");
      }
    } catch (error) {
      console.error(error);
      console.log("Unexpected error occurred.");
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
        <div style={{ marginBottom: "20px" }}>
          <div>Ebook(PDF/EPUB):</div>
          <input type="file" accept=".pdf,.epub" onChange={handleFileAChange} />
        </div>
        <div>
          <div>Cover Image:</div>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileBChange} />
        </div>
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

const Buttonsubmit = styled.button`
  color: #fff;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #318ce7;
  justify-content: center;
  display: block; 
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`;
