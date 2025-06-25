import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import styled from "styled-components";
import { useState } from "react";

const Logout = () => {
  const { user, error, isLoading } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  if (isLoading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <ErrorText>{error.message}</ErrorText>;

  const handleAvatarClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const truncateText = (text: string | null | undefined, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Container>
      {user ? (
        <UserContainer>
          <FlexLogout>
            <div onClick={handleAvatarClick}>
              <Avatar
                src={user.picture || "/images/profile.jpg"}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/profile.jpg";
                }}
              />
            </div>
            <Link href="/Token">
              <Email>{truncateText(user.email, 13)}</Email>
            </Link>
            <LogoutResponsiveButton
              onClick={() => (window.location.href = "/api/auth/logout")}
            >
              Logout
            </LogoutResponsiveButton>
          </FlexLogout>
          {dropdownVisible && (
            <DropdownMenu>
              <Link href="/Token" passHref>
                <LogoutButton onClick={() => setDropdownVisible(false)}>
                  เติม Token
                </LogoutButton>
              </Link>
              <LogoutButton
                onClick={() => {
                  setDropdownVisible(false);
                  window.location.href = "/api/auth/logout";
                }}
              >
                Logout
              </LogoutButton>
            </DropdownMenu>
          )}
        </UserContainer>
      ) : (
        <Link href="/api/auth/login" passHref>
          <LoginButton>Login</LoginButton>
        </Link>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  @media (max-width: 500px) {
    position: relative;
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 115%;
      height: 1px;
      border-top: 2px solid var(--ELEMENT_WHITE);
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }
  }
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  object-fit: cover;
  cursor: pointer;
  margin-top: 12px;
  @media (max-width: 500px) {
    width: 20px;
    height: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }
`;

const Email = styled.div`
  font-size: 16px;
  color: var(--FONT_WHITE);
  margin-bottom: 15px;
  @media (max-width: 500px) {
    font-size: 10px;
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 20px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  display: grid;
  background-color: var(--ELEMENT_BLACK);
  border: 1px solid var(--ELEMENT_YELLOW);
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 120px;
  height: 55px;
  padding: 4px;
  text-align: center;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Button = styled.button`
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

const LogoutButton = styled(Button)`
  padding-bottom: 0px;
`;

const LoginButton = styled(Button)`
  margin: 10px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #555;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: red;
`;

const FlexLogout = styled.div`
  @media (min-width: 500px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
  }
  @media (max-width: 500px) {
    display: flex;
    margin: 10px;
  }
`;

const LogoutResponsiveButton = styled(Button)`
  padding-bottom: 0px;
  padding-right: 20px;
  font-size: 8px;
  @media (min-width: 500px) {
    display: none;
  }
`;

export default Logout;
