"use client";
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import styled from "styled-components";
import { useUser } from "@auth0/nextjs-auth0/client";
import TableToken from "@/components/client/tableToken";
import { loadStripe } from "@stripe/stripe-js";
const Token: React.FC = () => {
  const [token, setToken] = useState("");
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | string>(0);

  const { user } = useUser();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.sub) return;

      const encodedId = encodeURIComponent(user.sub);
      const res = await fetch(`/api/balance/${encodedId}`, {
        cache: "no-store",
      });

      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
      } else {
        console.error(data.message);
      }
    };

    fetchBalance();
  }, [user]);

  useEffect(() => {
    if (token === "") {
      setSelectedToken(null);
    } else {
      const parsedValue = parseFloat(token);
      if (!isNaN(parsedValue) && parsedValue <= 1000) {
        setSelectedToken(parsedValue);
      }
    }
  }, [token]);

  const handleTokenClick = (value: number) => {
    if (value <= 1000) {
      setToken(value.toString());
      setSelectedToken(value);
    }
  };

  const handleSubmit = async () => {
    if (!user?.sub || !selectedToken) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.sub, tokenAmount: selectedToken }),
      });
      const data = await res.json();
      if (res.ok && data.sessionId) {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        const { error } = await stripe!.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (error) setError(error.message ?? null);
      } else {
        setError(data.message || "Failed to create checkout session");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <div>
        <Text>จำนวน Token: {balance || 0}</Text>
      </div>
      <TextToken>เติม Token</TextToken>
      <TextField
        label="Token"
        variant="outlined"
        type="number"
        value={token}
        onChange={(e) => {
          const value = parseFloat(e.target.value);
          if (isNaN(value)) {
            setToken("");
          } else if (value <= 1000) {
            setToken(e.target.value);
          }
        }}
        onBlur={() => {
          const value = parseFloat(token);
          if (isNaN(value) || value > 1000) {
            setToken("");
          } else {
            setToken(value.toString());
          }
        }}
        fullWidth
        required
        inputProps={{ max: 1000, min: 1 }}
        style={{
          marginBottom: "16px",
          width: "100%",
          maxWidth: "700px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      <Button>
        {[20, 50, 100, 300, 500, 1000].map((val) => (
          <ButtonToken
            key={val}
            onClick={() => handleTokenClick(val)}
            $active={selectedToken === val}
          >
            <div>{val} Token</div>
            <div>฿{val.toLocaleString()}</div>
          </ButtonToken>
        ))}
      </Button>
      <Summit
        onClick={handleSubmit}
        disabled={loading || !user || !selectedToken}
      >
        {loading ? "กำลังเติม Token..." : "เติม Token"}
      </Summit>
      <TableToken />

      {error && <h1>{error}</h1>}
    </Main>
  );
};

export default Token;

const Main = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
`;

const TextToken = styled.h1`
  display: flex;
  justify-content: center;
  font-size: 40px;
  margin-top: 20px;
  margin-bottom: 20px;

  @media (max-width: 500px) {
    margin-top: 20px;
  }
`;

const Text = styled.h1`
  display: flex;
  justify-content: end;
  font-size: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 20px;
  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-content: center;
  }
`;

const ButtonToken = styled.button<{ $active?: boolean }>`
  border-radius: 15px;
  padding: 10px 20px;
  font-size: 20px;
  margin: 10px;
  cursor: pointer;
  border: 2px solid
    ${(props) => (props.$active ? "var(--FONT_YELLOW)" : "var(--FONT_BLACK)")};
  background-color: ${(props) => (props.$active ? "var(--FONT_BLACK)" : "")};
  color: ${(props) =>
    props.$active ? "var(--FONT_YELLOW)" : "var(--FONT_BLACK)"};
  transition: background-color 0.2s;
`;

const Summit = styled.button`
  border: 1px solid #ccc;
  padding: 10px 20px;
  font-size: 20px;
  margin: 10px;
  margin-left: auto;
  display: block;
`;
