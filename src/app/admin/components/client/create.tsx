import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import styled from "styled-components";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  SelectChangeEvent,
} from "@mui/material";
import { uploadFiles } from "../../supabase/upload";  

interface FormDataType {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  ebook_url: string;
  image_url: string;
}

interface AuthorData {
  id: string;
  birth_year: string;
  death_year: string;
  name: string;
}

export interface CreateComponentRef {
  getFormData: () => FormDataType;
  uploadEbookFile: (file: File) => Promise<string>;
  uploadImageFile: (file: File) => Promise<string>;
}

const CreateComponent = forwardRef<CreateComponentRef>((_, ref) => {
  const [title, setTitle] = useState("");
  const [summaries, setSummaries] = useState("");
  const [bookshelves, setBookshelves] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileUrls, setFileUrls] = useState<string[]>(["", ""]); // ebook_url, image_url

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "authors"));
        const authorsData: AuthorData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          authorsData.push({
            id: doc.id,
            birth_year: data.birth_year,
            death_year: data.death_year,
            name: data.name,
          });
        });
        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching authors: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      title,
      authors: selectedOption,
      summaries,
      bookshelves: bookshelves.split(",").map((b) => b.trim()),
      languages,
      ebook_url: fileUrls[0],
      image_url: fileUrls[1],
    }),

    uploadEbookFile: async (file: File) => {
      const { urlA } = await uploadFiles(file, new File([], "placeholder.png")); // Placeholder สำหรับไฟล์ image
      setFileUrls((prev) => [urlA, prev[1]]);
      return urlA;
    },

    uploadImageFile: async (file: File) => {
      const { urlB } = await uploadFiles(new File([], "placeholder.epub"), file); // Placeholder สำหรับไฟล์ ebook
      setFileUrls((prev) => [prev[0], urlB]);
      return urlB;
    },
  }));

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  if (loading) return <div>Loading authors...</div>;

  return (
    <Main>
      <div>
        <Titlehead>Upload Ebook</Titlehead>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <Form >
          <InputLabel id="select-label">Authors</InputLabel>
          <Select
            labelId="select-label"
            value={selectedOption}
            onChange={handleSelectChange}
            label="Authors"
            disabled={authors.length === 0}
            style={{
              marginBottom: "16px",
              width: "700px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {authors.length > 0 ? (
              authors.map((author) => (
                <MenuItem key={author.id} value={author.name}>
                  {author.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No authors available</MenuItem>
            )}
          </Select>
        </Form>
        <TextFieldStyled
          fullWidth
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          label="Summaries"
          multiline
          rows={4}
          value={summaries}
          onChange={(e) => setSummaries(e.target.value)}
        />
        <TextFieldStyled
          label="Bookshelves"
          variant="outlined"
          value={bookshelves}
          onChange={(e) => setBookshelves(e.target.value)}
          fullWidth
          required
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <Languagesflex>
          <Languages>Languages</Languages>
          {["English", "French", "Chinese"].map((lang) => (
            <FormControlLabel
              key={lang}
              control={<Checkbox onChange={() => handleLanguageChange(lang)} />}
              label={lang}
            />
          ))}
        </Languagesflex>
      </div>
    </Main>
  );
});

CreateComponent.displayName = "CreateComponent";

export default CreateComponent;

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

const Titlehead = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 10px;
`;

const TextFieldStyled = styled(TextField)`
  margin-bottom: 20px;
`;
