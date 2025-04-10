"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import NavbarHead from "../../../components/client/Navbarhead"; 
import NavbarAdmin from "../../../components/client/Navbaradmin"; 
import styled from "styled-components";

interface EbookData {
  id: string;
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
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

  if (!ebook) return <div>No ebook found</div>;

  return (
    <Main>
      <div>
      <NavbarAdmin /> 
      <NavbarHead /> 
      </div>
      <div>
      <h1>{ebook.title}</h1>
      <p><strong>Authors:</strong> {ebook.authors}</p>
      <p><strong>Summary:</strong> {ebook.summaries}</p>
      <p><strong>Bookshelves:</strong> {ebook.bookshelves.join(", ")}</p>
      <p><strong>Languages:</strong> {ebook.languages.join(", ")}</p>
      </div>
    </Main>
  );
};

export default EbookDetail;

const Main = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
`;


