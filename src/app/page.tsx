"use client"; 
import styled from "styled-components";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../store/bookSlice";
import { RootState, AppDispatch } from "../store/store";
import { useRouter } from "next/navigation"; 
import SearchInput from "@/components/client/searchInput";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); 
  const { books, loading } = useSelector((state: RootState) => state.books);

  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    dispatch(fetchBooks(null));
  }, [dispatch]);

  const handleSearch = () => {
    if (searchQuery) {
      router.push(`/book?search=${searchQuery}`); 
    }
  };

  return (
    <Container>
      <ImageContainer>
        <OverlayText>The Book Lover&apos;s Dreamland Awaits!</OverlayText>
        <Text>
          Welcome to the ultimate book lover&apos;s paradise! Join our community
          ever- and contribute to the ever-
        </Text>
        <Text1>
          evolving library of stories, where every book has a chance to inspire
          someone new.
        </Text1>
        <Search>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchBooks={handleSearch}  // onSearch function
          />
        </Search>
        <StyledImage src="/images/Book.png" alt="Profile" fill priority />
      </ImageContainer>

      <ContentContainer>
        <TextOur>Our Best Picks</TextOur>
      </ContentContainer>

      <Swipermagin>
        {loading ? (
          <LoadingText>กำลังโหลดหนังสือ...</LoadingText>
        ) : (
          <Swiper
            slidesPerView={4}
            spaceBetween={30}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-books-recommented",
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {books.slice(0, 12).map((book) => (
              <SwiperSlide key={book.id}>
                <BookCard>
                  <BookImage
                    src={book.formats["image/jpeg"]}
                    alt={book.title}
                  />
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>
                    {book.authors.map((author) => author.name).join(", ")}
                  </BookAuthor>
                </BookCard>
              </SwiperSlide>
            ))}
            <Paginationmagin>
              <CustomPagination className="swiper-slide-custom-pagination swiper-pagination-books-recommented" />
            </Paginationmagin>
          </Swiper>
        )}
      </Swipermagin>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const StyledImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff7700;
  font-size: 45px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
  width: 80%;
`;

const Text = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
  width: 80%;
`;

const Text1 = styled.div`
  position: absolute;
  top: 23%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
  width: 80%;
`;

const Search = styled.div`
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
  width: auto;
`;

const ContentContainer = styled.div`
  padding: 20px;
  background-color: var(--FONT_WHITE);
  color: #333;
`;

const TextOur = styled.div`
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin-top: 80px;
`;

const LoadingText = styled.div`
  text-align: center;
  font-size: 20px;
  color: gray;
`;

const CustomPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: calc(var(--space6) * 1px);
  gap: calc(var(--space3) * 1px);
`;

const Swipermagin = styled.div`
  margin: 40px;
`;

const Paginationmagin = styled.div`
  margin-top: 60px;
  margin-bottom: 20px;
`;

const BookCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  text-align: start;
  padding: 10px;
`;

const BookImage = styled.img`
  width: 400px;
  height: 500px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
`;

const BookTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
`;

const BookAuthor = styled.p`
  font-size: 14px;
  color: gray;
`;

export default HomePage;
