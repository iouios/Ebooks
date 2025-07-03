"use client";
import { useEffect, useRef } from "react";
import ePub from "epubjs";

interface EpubReaderProps {
  url: string;
}

const EpubReader: React.FC<EpubReaderProps> = ({ url }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const fetchAndRender = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer(); 

      const book = ePub(arrayBuffer); 
      const rendition = book.renderTo(viewerRef.current!, {
        width: "100%",
        height: "100%",
      });

      rendition.display();
    } catch (err) {
      console.error("EPUB load error:", err);
    }
  };

  if (viewerRef.current && url) {
    fetchAndRender();
  }
}, [url]);



  return <div ref={viewerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default EpubReader;
