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
            searchBooks={handleSearch}
          />
        </Search>
        <StyledImage
          src="/images/book.png"
          alt="คำอธิบายรูป"
          width={400}
          height={300}
          priority
        />
      </ImageContainer>
      <ImageContainerres>
        <OverlayText>The Book Lover&apos;s Dreamland Awaits!</OverlayText>
        <Search>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchBooks={handleSearch}
          />
        </Search>

        <TextOur>Our Best Picks</TextOur>

        <BookMargin>
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
                      <BookTitle>{truncateText(book.title, 7)}</BookTitle>
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
        </BookMargin>
        <StyledImage
          src="/images/bookimage.jpg"
          alt="คำอธิบายรูป"
          width={400}
          height={300}
          priority
        />
      </ImageContainerres>
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
  width: 100%;
  height: 100vh;
  background-image: url("/images/book.png");
  background-position: center;
  background-size: cover;
  position: relative;
  @media (max-width: 500px) {
    display: none;
  }
`;
const ImageContainerres = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url("/images/bookimage.jpg");
  background-position: center;
  background-size: cover;
  position: relative;
  @media (min-width: 500px) {
    display: none;
  }
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  @media (min-width: 500px) {
    display: none;
  }
`;

const OverlayText = styled.div`
  padding-top: 70px;
  color: #ff7700;
  font-size: 45px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  @media (max-width: 500px) {
    font-size: 19px;
    font-weight: bold;
  }
`;

const Text = styled.div`
  margin-top: 20px;
  color: white;
  font-size: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Text1 = styled.div`
  margin-bottom: 10px;
  color: white;
  font-size: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Search = styled.div`
  margin-top: 50px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
  display: flex;
  justify-content: center;

  @media (max-width: 500px) {
  }
`;

const ContentContainer = styled.div`
  background-color: var(--FONT_WHITE);
  color: #333;
  margin-top: 250px;
  @media (max-width: 500px) {
    display: none;
  }
`;

const TextOur = styled.div`
  font-size: 60px;
  font-weight: bold;
  text-align: center;
  @media (max-width: 500px) {
    font-size: 20px;
    margin-top: 60px;
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
  margin-top: 100px;
  @media (max-width: 500px) {
    margin-top: 100px;
    display: none;
  }
`;

const Swipermagins = styled.div`
  @media (min-width: 500px) {
    padding: 10px;
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
    padding: 14px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  }
`;

const BookImage = styled.img`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 4 / 5; /* รักษาสัดส่วน */
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 500px) {
    max-width: 250px;
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

const BookMargin = styled.div`
  @media (max-width: 500px) {
    margin-top: 50px;
    margin-left: 50px;
    margin-right: 50px;
  }
`;

export default HomePage;
