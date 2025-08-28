"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Props {
  setSearchQuery: (value: string) => void;
  setInputValue: (value: string) => void;
  setIsSearchClicked: (value: boolean) => void;
}

export const SearchParamsHandler: React.FC<Props> = ({
  setSearchQuery,
  setInputValue,
  setIsSearchClicked,
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      setInputValue(query);
      setIsSearchClicked(true);
    }
  }, [searchParams, setSearchQuery, setInputValue, setIsSearchClicked]);

  return null;
};
