"use client";

import { Box, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      color="black"
      textAlign="center"
      px="4"
    >
      <Text fontSize="3xl" fontWeight="bold" mb="4">
        404 — Страница не найдена
      </Text>
      <Text mb="6">Возможно, вы перешли по неверному адресу или страница была удалена.</Text>
      <Button onClick={() => router.push("/")}>
        На главную
      </Button>
    </Box>
  );
}
