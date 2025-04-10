"use client";
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

interface FormDataType {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
}

interface AuthorData {
  id: string;
  birth_year: string;
  death_year: string;
  name: string;
}

export interface CreateComponentRef {
  getFormData: () => FormDataType;
}

const CreateComponent = forwardRef<CreateComponentRef>((_, ref) => {
  const [title, setTitle] = useState("");
  const [summaries, setSummaries] = useState("");
  const [bookshelves, setBookshelves] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "authors"));
        const authorsData: AuthorData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          authorsData.push({
            id: doc.id,
            birth_year: data.birth_year ,
            death_year: data.death_year ,
            name: data.name 
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
    }),
  }));

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedOption(event.target.value);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  if (loading) return <div>Loading authors and ebooks...</div>;

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
            {authors.map((author) => (
              <MenuItem key={author.id} value={author.name}>
                {author.name}
              </MenuItem>
            ))}
          </Select>
        </Form>

        <TextFieldStyled
          fullWidth
          style={{ marginBottom: "20px" }}
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
          style={{ marginBottom: "20px" }}
        />

        <Languagesflex>
          <Languages>Languages</Languages>
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
        </Languagesflex>
      </div>
    </Main>
  );

  CreateComponent.displayName = "CreateComponent";
});

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
`;

const TextFieldStyled = styled(TextField)`
  margin-bottom: 20px;
`;
