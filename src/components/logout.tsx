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
    setDropdownVisible(!dropdownVisible); // Toggle the dropdown visibility
  };

  console.log("User", user);

  return (
    <Container>
      {user ? (
        <UserContainer>
          <Avatar
            src={user.picture || ""} 
            alt={user.name || "User Avatar"} 
            onClick={handleAvatarClick}
          />
          <Email>{user.email}</Email>

          {/* Dropdown menu */}
          {dropdownVisible && (
            <DropdownMenu>
              <LogoutButton onClick={() => (window.location.href = "/api/auth/logout")}>
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
  margin-bottom: 10px;
`;

const Email = styled.div`
  font-size: 16px;
  color: var(--FONT_WHITE);
  margin-bottom: 15px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px; 
  right: 0;
  background-color:  var(--ELEMENT_BLACK);
  border: 1px solid var(--ELEMENT_YELLOW);
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 150px;
  height: 40px;
  padding: 6px;
  text-align: center;
`;

const Button = styled.button`
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

const LogoutButton = styled(Button)`
  padding-bottom: 20px;
`;

const LoginButton = styled(Button)`
  margin-bottom: 10px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #555;
`;

const ErrorText = styled.div`
  font-size: 16px;
  color: red;
`;

export default Logout;
