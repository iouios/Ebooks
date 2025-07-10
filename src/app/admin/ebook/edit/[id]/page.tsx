"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavbarHead from "../../../components/client/Navbarhead";
import NavbarAdmin from "../../../components/client/Navbaradmin";
import styled from "styled-components";
import { TextField, Button } from "@mui/material";
import Image from "next/image";
import { uploadFiles } from "../../../supabase/upload";
import Swal from "sweetalert2";
import EpubReader from "../../../components/client/epub";
import Autocomplete from "@mui/material/Autocomplete";

interface EbookData {
  id: string;
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  price: number;
  ebook_url: string;
  image_url: string;
}

const EbookDetail: React.FC = () => {
  const [ebook, setEbook] = useState<EbookData | null>(null);
  const [uploadingEbook, setUploadingEbook] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showCover, setShowCover] = useState(true);
  const [showEbook, setShowEbook] = useState(true);
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
          setShowCover(true);
          setShowEbook(true);
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

    setUploadingEbook(true);
    setShowEbook(false);
    setEbook((prev) => (prev ? { ...prev, ebook_url: "" } : null));

    try {
      const { urlA } = await uploadFiles(file, new File([], "placeholder.png"));
      setEbook((prev) => (prev ? { ...prev, ebook_url: urlA } : null));
    } catch (err) {
      console.error("Upload ebook failed:", err);
    } finally {
      setUploadingEbook(false);
    }
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

    setUploadingCover(true);
    setShowCover(false); // Hide cover image while uploading
    setEbook((prev) => (prev ? { ...prev, image_url: "" } : null));

    try {
      const { urlB } = await uploadFiles(
        new File([], "placeholder.epub"),
        file
      );
      setEbook((prev) => (prev ? { ...prev, image_url: urlB } : null));
    } catch (err) {
      console.error("Upload cover failed:", err);
    } finally {
      setUploadingCover(false);
    }
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

  if (!ebook) return <div>Loading...</div>;

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
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={ebook.bookshelves}
          onChange={(_, newValue) => handleInputChange("bookshelves", newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Bookshelves"
              style={inputStyle}
            />
          )}
        />
        <TextField
          label="Price"
          type="number"
          value={ebook.price || ""}
          onChange={(e) => handleInputChange("price", Number(e.target.value))}
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

        <div>Ebook (PDF/EPUB):</div>

        <input type="file" accept=".pdf,.epub" onChange={handleUploadEbook} />

        {uploadingEbook ? (
          <div style={{ textAlign: "center", margin: "32px" }}>
            Uploading Ebook...
          </div>
        ) : showEbook && ebook.ebook_url ? (
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h3>
              {ebook.ebook_url.toLowerCase().endsWith(".epub")
                ? "EPUB Preview"
                : "PDF Preview"}
            </h3>
            {ebook.ebook_url.toLowerCase().endsWith(".epub") ? (
              <EpubReader url={ebook.ebook_url} />
            ) : (
              <iframe
                src={ebook.ebook_url}
                width="700"
                height="500"
                style={{ border: "1px solid #ccc", borderRadius: "8px" }}
              />
            )}
          </div>
        ) : null}

        <div>Cover Image:</div>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleUploadCover}
        />

        {uploadingCover ? (
          <div style={{ textAlign: "center", margin: "32px" }}>
            Uploading Cover...
          </div>
        ) : showCover && ebook.image_url ? (
          <div
            style={{ textAlign: "center", marginBottom: "32px" }}
            key={ebook.image_url}
          >
            <h3>Cover Preview</h3>
            <Image
              src={ebook.image_url}
              alt="Ebook Cover"
              width={700}
              height={500}
              layout="intrinsic"
            />
          </div>
        ) : null}

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
