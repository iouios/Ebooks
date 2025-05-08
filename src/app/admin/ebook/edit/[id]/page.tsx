"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavbarHead from "../../../components/client/Navbarhead";
import NavbarAdmin from "../../../components/client/Navbaradmin";
import styled from "styled-components";
import { TextField, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadFiles } from "../../../supabase/upload"; // ✅ เพิ่ม
import Swal from "sweetalert2"; // ✅ เพิ่ม

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
  const ebookId = params?.id as string;
  const router = useRouter();

  useEffect(() => {
    if (!ebookId) return;

    const fetchEbook = async () => {
      try {
        const res = await fetch(`/api/editEbook/${ebookId}`);
        const data = await res.json();

        if (res.ok) {
          setEbook(data);
        } else {
          console.error("Failed to fetch ebook:", data.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
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

  const isValidEbookFile = (file: File) => {
    const allowed = ["application/pdf", "application/epub+zip"];
    return allowed.includes(file.type);
  };

  const isValidCoverFile = (file: File) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    return allowed.includes(file.type);
  };

  const handleUploadEbook = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidEbookFile(file)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Ebook File!",
        text: "Only .pdf and .epub files are allowed.",
      });
      return;
    }

    const { urlA } = await uploadFiles(file, new File([], "placeholder.png"));
    setEbook((prev) => (prev ? { ...prev, ebook_url: urlA } : null));
  };

  const handleUploadCover = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isValidCoverFile(file)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Cover Image!",
        text: "Only .jpeg, .jpg, and .png files are allowed.",
      });
      return;
    }

    const { urlB } = await uploadFiles(new File([], "placeholder.epub"), file);
    setEbook((prev) => (prev ? { ...prev, image_url: urlB } : null));
  };

  const handleSave = async () => {
    if (!ebook) return;

    try {
      const res = await fetch(`/api/editEbook/${ebook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ebook),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        router.push("/admin/ebook");
      } else {
        console.error(
          "Failed to update ebook:",
          data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (!ebook) return <div></div>;

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
          style={inputStyle}
        />
        <TextField
          label="Authors"
          value={ebook.authors}
          onChange={(e) => handleInputChange("authors", e.target.value)}
          fullWidth
          style={inputStyle}
        />
        <TextField
          label="Summaries"
          value={ebook.summaries}
          onChange={(e) => handleInputChange("summaries", e.target.value)}
          fullWidth
          multiline
          rows={4}
          style={inputStyle}
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
          style={inputStyle}
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
          style={inputStyle}
        />
        <div>Ebook(PDF/EPUB):</div>
        <div >
          <input type="file" accept=".pdf,.epub" onChange={handleUploadEbook} />
        </div>

        {ebook.ebook_url && (
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h3>PDF Preview</h3>
            <iframe
              src={ebook.ebook_url}
              width="700"
              height="500"
              style={{ border: "1px solid #ccc", borderRadius: "8px" }}
            />
          </div>
        )}
        <div>Cover Image:</div>
        <div >
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleUploadCover}
          />
        </div>
        {ebook.image_url && (
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h3>Cover Preview</h3>
            <Image
              src={ebook.image_url}
              alt="Ebook Cover"
              width={700}
              height={500}
              layout="intrinsic"
            />
          </div>
        )}
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          style={buttonStyle}
        >
          Save Changes
        </Button>
      </Center>
    </Main>
  );
};

export default EbookDetail;

const inputStyle = {
  marginBottom: "16px",
  width: "700px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
};

const buttonStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  display: "block",
  margin: "0 auto",
  marginBottom: "32px",
};

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
