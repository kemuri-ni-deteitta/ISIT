"use client";

import { useState } from "react";
import { Button, Card, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AdminPanelUsersDialog } from "./AdminPanelUsersDialog";
import { SearchInput } from "@/components/ui/SearchInput";
import { AdminPanelUsersTable } from "./AdminPanelUsersTable";
import { toaster } from "@/components/ui/toaster";

export const AdminPanelUsersManager = () => {
  const createDialog = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreate = (data: any) => {
    toaster.success({ title: "Пользователь успешно создан" });
    createDialog.onClose();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    console.log("Search term:", value);
  };

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Flex align="center" justify="space-between">
            <SearchInput value={searchTerm} onChange={handleSearchChange} placeholder="Поиск пользователей..." />
            <Button onClick={createDialog.onOpen}>Добавить</Button>
          </Flex>
        </Card.Header>
        <Card.Body>
          <AdminPanelUsersTable />
        </Card.Body>
      </Card.Root>

      <AdminPanelUsersDialog
        open={createDialog.open}
        onOpenChange={(val) => (!val ? createDialog.onClose() : createDialog.onOpen())}
        initialValue={null}
        onSubmit={handleCreate}
      />
    </>
  );
};
