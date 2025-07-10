"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
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
import Swal from "sweetalert2"; // นำเข้า sweetalert2
import Autocomplete from "@mui/material/Autocomplete";

interface FormDataType {
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  ebook_url: string;
  price: number;
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
  const [price, setprice] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [authors, setAuthors] = useState<AuthorData[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>(["", ""]);
  const [bookshelves, setBookshelves] = useState<string[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch("/api/authors");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAuthors(data);
      } catch (error) {
        console.error("Error fetching authors: ", error);
      }
    };

    fetchAuthors();
  }, []);

  const isValidEbookFile = (file: File) => {
    const allowedEbookTypes = ["application/pdf", "application/epub+zip"];
    return allowedEbookTypes.includes(file.type);
  };

  const isValidCoverFile = (file: File) => {
    const allowedCoverTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedCoverTypes.includes(file.type);
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      title,
      authors: selectedOption,
      summaries,
      bookshelves,
      languages,
      price: Number(parseFloat(price).toFixed(2)) || 0,
      ebook_url: fileUrls[0],
      image_url: fileUrls[1],
    }),

    uploadEbookFile: async (file: File) => {
      if (!isValidEbookFile(file)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Ebook File!",
          text: "Only .pdf and .epub files are allowed.",
        });
        throw new Error("Invalid ebook file.");
      }

      const { urlA } = await uploadFiles(file, new File([], "placeholder.png"));
      setFileUrls((prev) => [urlA, prev[1]]);
      return urlA;
    },

    uploadImageFile: async (file: File) => {
      if (!isValidCoverFile(file)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Cover Image!",
          text: "Only .jpeg, .jpg, and .png files are allowed.",
        });
        throw new Error("Invalid cover image.");
      }

      const { urlB } = await uploadFiles(
        new File([], "placeholder.epub"),
        file
      );
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

  console.log("Selected price:", price);

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
        <Form>
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
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={bookshelves}
          onChange={(_, newValue: string[]) => {
            setBookshelves(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Bookshelves"
              placeholder="พิมพ์แล้วกด space เพื่อเพิ่มคำ กด Enter เพื่อยืนยัน"
            />
          )}
          style={{
            marginBottom: "16px",
            width: "700px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <TextField
          label="Price"
          variant="outlined"
          type="number"
          value={price}
          onChange={(e) => {
            setprice(e.target.value);
          }}
          onBlur={() => {
            if (price === "" || isNaN(Number(price))) {
              setprice("0.00");
            } else {
              setprice(parseFloat(price).toFixed(2));
            }
          }}
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
