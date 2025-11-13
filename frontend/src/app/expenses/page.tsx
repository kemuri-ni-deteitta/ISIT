"use client";

import { Box, Button, Card, Flex, Heading, useDisclosure, Input } from "@chakra-ui/react";
import { ExpenseList } from "./components/ExpenseList";
import { ExpenseDialog } from "./components/ExpenseDialog";
import { useState } from "react";
import { LuSearch, LuFilter } from "react-icons/lu";

export default function ExpensesPage() {
  const dialog = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box>
      <Heading textStyle="heading.title" mb="35px">
        Ввод данных о затратах
      </Heading>
      <Card.Root>
        <Card.Header>
          <Flex align="center" justify="space-between" gap={4}>
            <Flex align="center" flex={1} gap={2}>
              <LuSearch size={20} />
              <Input
                placeholder="Поиск пользователя"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outline"
              />
              <LuFilter size={20} style={{ cursor: "pointer" }} />
            </Flex>
            <Button onClick={dialog.onOpen} colorPalette="blue">
              Новая запись
            </Button>
          </Flex>
        </Card.Header>
        <Card.Body>
          <ExpenseList key={refreshKey} />
        </Card.Body>
      </Card.Root>

      <ExpenseDialog
        open={dialog.open}
        onClose={() => dialog.onClose()}
        onCreated={() => {
          setRefreshKey((x) => x + 1);
          dialog.onClose();
        }}
      />
    </Box>
  );
}


