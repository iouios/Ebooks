"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TextField } from "@mui/material";
import styled from "styled-components";
import Navbaradmin from "../../../components/client/Navbaradmin";
import Navbarhead from "../../../components/client/Navbarhead";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState<Date | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchAuthor = async () => {
      try {
        const res = await fetch(`/api/author/${id}`);
        if (!res.ok) {
          throw new Error("Author not found");
        }
        const data = await res.json();
        setName(data.name || "");
        if (data.birth_year) {
          const yearNum = Number(data.birth_year);
          if (!isNaN(yearNum)) {
            setBirthYear(new Date(yearNum, 0, 1)); 
          } else {
            setBirthYear(null);
          }
        } else {
          setBirthYear(null);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
        alert("ไม่พบข้อมูลผู้แต่ง");
      }
    };

    fetchAuthor();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const birthYearStr = birthYear ? birthYear.getFullYear().toString() : "";

      const res = await fetch(`/api/authorEdit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, birth_year: birthYearStr }),
      });

      if (!res.ok) {
        throw new Error("Failed to update author");
      }
      router.push("/admin/author");
    } catch (error) {
      console.error("Error updating author:", error);
    }
  };

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <Top>
        <MainInner>
          <Titlehead>แก้ไขผู้แต่ง</Titlehead>
        </MainInner>

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
            views={['year']}
            value={birthYear}
            onChange={(newValue) => setBirthYear(newValue)}
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

        <Button onClick={handleUpdate}>บันทึกการแก้ไข</Button>
      </Top>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
`;

const MainInner = styled.div`
  display: flex;
  justify-content: center;
`;

const Top = styled.div`
  margin-top: 80px;
  width: 70%;
`;

const Titlehead = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
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
