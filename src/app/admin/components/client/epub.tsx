import { useEffect, useRef, CSSProperties } from "react";
import ePub, { Rendition } from "epubjs";

interface EpubReaderProps {
  url: string;
  style?: CSSProperties; 
}

const EpubReader: React.FC<EpubReaderProps> = ({ url, style }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<Rendition | null>(null);

  useEffect(() => {
    if (!url || !viewerRef.current) return;

    let isMounted = true;

    const loadBook = async () => {
      try {
        viewerRef.current!.innerHTML = "";

        const book = ePub(url);
        await book.ready;

        if (!isMounted) return;

        if (renditionRef.current) {
          renditionRef.current.destroy();
        }

        const rendition = book.renderTo(viewerRef.current!, {
          width: "100%",
          height: "100%",
        });

        await rendition.display();

        renditionRef.current = rendition;
      } catch (error) {
        console.error("Failed to load EPUB:", error);
      }
    };

    loadBook();

    return () => {
      isMounted = false;
      if (renditionRef.current) {
        renditionRef.current.destroy();
        renditionRef.current = null;
      }
    };
  }, [url]);

  return (
    <div
      ref={viewerRef}
      id="epub-viewer"
      style={{
        width: "700px",
        height: "500px",
        ...style,
      }}
    />
  );
};

export default EpubReader;
