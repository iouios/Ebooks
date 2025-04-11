"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import NavbarHead from "../../../components/client/Navbarhead";
import NavbarAdmin from "../../../components/client/Navbaradmin";
import styled from "styled-components";
import { TextField } from "@mui/material";

interface EbookData {
  id: string;
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  ebook_url: string;
  image_url: string;
}

const EbookDetail: React.FC = () => {
  const [ebook, setEbook] = useState<EbookData | null>(null);
  const params = useParams();
  const ebookId = params?.Id as string;

  useEffect(() => {
    if (!ebookId) return;

    const fetchEbook = async () => {
      try {
        const docRef = doc(db, "ebooks", ebookId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setEbook({
            id: docSnap.id,
            title: data.title,
            authors: data.authors,
            summaries: data.summaries,
            bookshelves: data.bookshelves,
            languages: data.languages,
            ebook_url: data.ebook_url,
            image_url: data.image_url,
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching ebook:", error);
      }
    };

    fetchEbook();
  }, [ebookId]);

  const handleInputChange = <K extends keyof EbookData>(
    field: K,
    value: EbookData[K]
  ) => {
    if (ebook) {
      setEbook({ ...ebook, [field]: value });
    }
  };

  if (!ebook) return <div>No ebook found</div>;

  return (
    <Main>
      <div>
        <NavbarAdmin />
        <NavbarHead />
      </div>
      <Center>
        <Titlehead>Data Book</Titlehead>
        <TextField
          label="Title"
          value={ebook.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Authors"
          value={ebook.authors}
          onChange={(e) => handleInputChange("authors", e.target.value)}
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Summaries"
          value={ebook.summaries}
          onChange={(e) => handleInputChange("summaries", e.target.value)}
          fullWidth
          multiline
          rows={4}
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Bookshelves"
          value={ebook.bookshelves.join(", ")}
          onChange={(e) =>
            handleInputChange(
              "bookshelves",
              e.target.value.split(",").map((b) => b.trim())
            )
          }
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Languages"
          value={ebook.languages.join(", ")}
          onChange={(e) =>
            handleInputChange(
              "languages",
              e.target.value.split(",").map((l) => l.trim())
            )
          }
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Ebook URL"
          value={ebook.ebook_url}
          onChange={(e) => handleInputChange("ebook_url", e.target.value)}
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Image URL"
          value={ebook.image_url}
          onChange={(e) => handleInputChange("image_url", e.target.value)}
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </Center>
    </Main>
  );
};

export default EbookDetail;

const Main = styled.div`
  display: flex;
  margin-top: 80px;
  justify-content: center;
`;

const Center = styled.div`
  justify-content: center;
`;

const Titlehead = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 10px;
`;
