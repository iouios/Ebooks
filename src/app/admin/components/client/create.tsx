import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseConfig";
import { saveEbook } from "../../api/ebookApi";

import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Button,
  SelectChangeEvent,
  CircularProgress, 
} from "@mui/material";

const CreateComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 
  const [title, setTitle] = useState("");
  const [summaries, setSummaries] = useState("");
  const [bookshelves, setBookshelves] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [ebookFile, setEbookFile] = useState<File | undefined>();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [selectedOption, setSelectedOption] = useState(""); 

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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguages((prevLanguages) =>
      prevLanguages.includes(lang)
        ? prevLanguages.filter((language) => language !== lang)
        : [...prevLanguages, lang]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploading(true); 

    try {
      const ebookData = {
        title,
        authors: selectedOption, 
        summaries,
        bookshelves: bookshelves.split(","),
        languages,
        ebookFile,
        imageFile,
      };

      const response = await saveEbook(ebookData);

      if (response.success) {
        console.log("✅ Ebook uploaded successfully!");
        alert("Upload Success!");
        router.push("/dashboard"); 
      } else {
        console.log("Error uploading ebook:", response.error);
        alert("Error uploading ebook.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred.");
    } finally {
      setUploading(false); // ✅ ซ่อนสถานะอัปโหลด
    }
  };

  return (
    <Main>
      <div>
        <Titlehead>Upload Ebook</Titlehead>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            style={{ marginBottom: "20px" }}
          />

          <Form fullWidth style={{ marginBottom: "20px" }}>
            <InputLabel id="select-label">Authors</InputLabel>
            <Select
              labelId="select-label"
              value={selectedOption}
              onChange={handleSelectChange}
              label="Authors"
            >
              <MenuItem value="Author 1">Author 1</MenuItem>
              <MenuItem value="Author 2">Author 2</MenuItem>
              <MenuItem value="Author 3">Author 3</MenuItem>
            </Select>
          </Form>

          <TextField
            fullWidth
            style={{ marginBottom: "20px" }}
            label="Summaries"
            multiline
            rows={4}
            value={summaries}
            onChange={(e) => setSummaries(e.target.value)}
          />

          <TextField
            label="Bookshelves"
            variant="outlined"
            value={bookshelves}
            onChange={(e) => setBookshelves(e.target.value)}
            fullWidth
            required
            style={{ marginBottom: "20px" }}
          />
          <Languagesflex>
            <Languages>Languages</Languages>
            <>
              <FormControlLabel
                control={<Checkbox onChange={() => handleLanguageChange("English")} />}
                label="English"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleLanguageChange("French")} />}
                label="French"
              />
              <FormControlLabel
                control={<Checkbox onChange={() => handleLanguageChange("Chinese")} />}
                label="Chinese"
              />
            </>
          </Languagesflex>

          <div>
            <div>Ebook (PDF/EPUB):</div>
            <input type="file" onChange={(e) => setEbookFile(e.target.files?.[0])} accept=".pdf, .epub" />
            <div>Cover Image:</div>
            <input type="file" onChange={(e) => setImageFile(e.target.files?.[0])} accept="image/*" />
          </div>

          <Buttonsubmit type="submit" disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : "SUBMIT"}
          </Buttonsubmit>
        </form>
      </div>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  margin-top: 80px;
  justify-content: center;
`;

const Form = styled(FormControl)`
  margin-bottom: 20px;
`;

const Languagesflex = styled.div`
  display: flex;
`;

const Languages = styled.h1`
  margin-top: 8px;
  margin-right: 10px;
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

const Titlehead = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
`;

export default CreateComponent;
