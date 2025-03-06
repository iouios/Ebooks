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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
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
            searchBooks={handleSearch} // onSearch function
          />
        </Search>
        <StyledImage src="/images/Book.png" alt="Profile" fill priority />
        <StyledImages src="/images/bookimage.jpg" alt="Profile" fill priority />
        <Swipermagins>
          {loading ? (
            <LoadingText>กำลังโหลดหนังสือ...</LoadingText>
          ) : (
            <Swiper
              spaceBetween={30}
              pagination={{
                clickable: true,
                el: ".swiper-pagination-books-recommented",
              }}
              modules={[Pagination]}
              className="mySwiper"
              breakpoints={{
                768: {
                  slidesPerView: 4,
                },

                300: {
                  slidesPerView: 2,
                },
              }}
            >
              {books.slice(0, 12).map((book) => (
                <SwiperSlide key={book.id}>
                  <BookCard>
                    <BookImage
                      src={book.formats["image/jpeg"]}
                      alt={book.title}
                    />
                    <BookTitle>{truncateText(book.title, 10)}</BookTitle>
                    <BookAuthor>
                      {truncateText(
                        book.authors.map((author) => author.name).join(", "),
                        10
                      )}
                    </BookAuthor>
                  </BookCard>
                </SwiperSlide>
              ))}

              <Paginationmagin>
                <CustomPagination className="swiper-slide-custom-pagination swiper-pagination-books-recommented" />
              </Paginationmagin>
            </Swiper>
          )}
        </Swipermagins>
      </ImageContainer>

      <ContentContainer>
        <TextOur>Our Best Picks</TextOur>
      </ContentContainer>

      <Swipermagin>
        {loading ? (
          <LoadingText>กำลังโหลดหนังสือ...</LoadingText>
        ) : (
          <Swiper
            spaceBetween={30}
            pagination={{
              clickable: true,
              el: ".swiper-pagination-books-recommented",
            }}
            modules={[Pagination]}
            className="mySwiper"
            breakpoints={{
              600: {
                slidesPerView: 4,
              },

              100: {
                slidesPerView: 2,
              },
            }}
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
  @media (max-width: 500px) {
    display: none;
  }
`;

const StyledImages = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  @media (max-width: 500px) {
    font-size: 18px;
    font-weight: bold;
  }
  @media (min-width: 500px) {
    display: none;
  }
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
  @media (max-width: 500px) {
    font-size: 19px;
    font-weight: bold;
  }
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
  @media (max-width: 500px) {
    display: none;
  }
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
  @media (max-width: 500px) {
    display: none;
  }
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
  @media (max-width: 500px) {
    top: 20%;
    left: 50%;
  }
`;

const ContentContainer = styled.div`
  padding: 20px;
  background-color: var(--FONT_WHITE);
  color: #333;
  @media (max-width: 500px) {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--background);
  }
`;

const TextOur = styled.div`
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin-top: 80px;
  @media (max-width: 500px) {
    font-size: 20px;
    color: var(--FONT_YELLOW);
  }
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
  @media (max-width: 500px) {
    display: none;
  }
`;

const Swipermagins = styled.div`
  @media (min-width: 500px) {
    margin: 20px;
    display: none;
  }
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
  @media (max-width: 500px) {
    padding: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    margin-top: 350px;
    margin-right: 10px;
    margin-left: 10px;
  }
`;

const BookImage = styled.img`
  width: 400px;
  height: 500px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  @media (max-width: 500px) {
    width: 200px;
    height: 200px;
  }
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
