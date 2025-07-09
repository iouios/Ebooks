"use client";
import Navbaradmin from "../../components/client/Navbaradmin";
import Navbarhead from "../../components/client/Navbarhead";
import styled from "styled-components";
import React, { useState } from "react";
import { TextField } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Author = () => {
  const [name, setName] = useState<string>("");
  const [birth_year, setBirth_year] = useState<Date | null>(null);

  const handleSubmit = async () => {
    try {
      const birthYearStr = birth_year
        ? birth_year.getFullYear().toString()
        : "";

      const response = await fetch("/api/authorCreate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, birth_year: birthYearStr }),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการบันทึก");
      }

      setName("");
      setBirth_year(null);
      window.location.href = "/admin/author";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setBirth_year(date);
  };

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <Top>
        <Main>
          <Titlehead>Author</Titlehead>
        </Main>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Birth Year"
            views={["year"]}
            value={birth_year}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                style: {
                  marginBottom: "16px",
                  width: "700px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                },
              },
            }}
          />
        </LocalizationProvider>

        <Button color="primary" onClick={handleSubmit}>
          บันทึก
        </Button>
      </Top>
    </Main>
  );
};
export default Author;

const Main = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
`;

const Top = styled.div`
  margin-top: 80px;
  width: 70%;
`;

const Titlehead = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  display: block;
  margin: 20px auto 0 auto;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1565c0;
  }
`;
