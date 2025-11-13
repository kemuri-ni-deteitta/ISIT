"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Input, InputGroup, CloseButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { debounce } from "lodash";

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
  size?: "xs" | "sm" | "md" | "lg";
  delay?: number;
}

export const SearchInput = ({
  value = "",
  onChange,
  placeholder = "Поиск...",
  width = "280px",
  size = "md",
  delay = 400,
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // debounce для onChange
  const debouncedOnChange = useMemo(() => debounce((val: string) => onChange(val), delay), [onChange, delay]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  // Синхронизация внешнего value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (val: string) => {
    setInternalValue(val);
    debouncedOnChange(val);
  };

  const endElement = value ? (
    <CloseButton
      size="xs"
      onClick={() => {
        setInternalValue("");
        inputRef.current?.focus();
      }}
      me="-2"
    />
  ) : undefined;

  return (
    <InputGroup width={width} startElement={<LuSearch style={{ color: "#A0AEC0" }} />} endElement={endElement}>
      <Input
        ref={inputRef}
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        size={size}
        pr="2.5rem"
      />
    </InputGroup>
  );
};
