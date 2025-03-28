"use client";
import React, { useEffect, useState } from "react";
import Navbaradmin from "../../components/client/์Navbaradmin";
import Navbarhead from "../../components/client/์Navbarhead";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseConfig";

import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState("");
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

  const handleSelectChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Main>
      <Navbaradmin />
      <Navbarhead />
      <div>
        <Titlehead>Upload Ebook</Titlehead>
        <TextField
          label="Title"
          type="authors"
          variant="outlined"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: "20px" }}
        />

        <Form fullWidth style={{ marginBottom: "20px" }}>
          <InputLabel id="select-label">Authors</InputLabel>
          <Select
            labelId="Authors"
            value={selectedOption}
            label="Authors"
            onChange={handleSelectChange}
          >
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
            <MenuItem value="option3">Option 3</MenuItem>
          </Select>
        </Form>
        <TextField
          fullWidth
          style={{ marginBottom: "20px" }}
          id="outlined-multiline-static"
          label="Summaries"
          multiline
          rows={4}
        />
        <TextField
          label="Bookshelves"
          type="authors"
          variant="outlined"
          value={authors}
          onChange={(e) => setAuthors(e.target.value)}
          fullWidth
          required
          style={{ marginBottom: "20px" }}
        />
        <Languagesflex>
          <Languages>Languages</Languages>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="English" />
          </FormGroup>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="French" />
          </FormGroup>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Chinese" />
          </FormGroup>
        </Languagesflex>
        <div>Ebook (PDF/EPUB):</div>
        <div>test</div>
        <div>Cover Image:</div>
        <div>test</div>
          <Buttonsubmit>SUBMIT</Buttonsubmit>
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

const Buttonsubmit = styled.div`
  color: var(--FONT_WHITE);
  padding: 10px;
  margin-top: 20px;
  display: flex;
  background-color: #318CE7;
  justify-content: center;
`;

const Titlehead = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
`;

export default Create;
