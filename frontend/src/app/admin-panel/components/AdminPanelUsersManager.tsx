"use client";

import { useState } from "react";
import { Button, Card, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { AdminPanelUsersDialog } from "./AdminPanelUsersDialog";
import { SearchInput } from "@/components/ui/SearchInput";
import { AdminPanelUsersTable } from "./AdminPanelUsersTable";
import { toaster } from "@/components/ui/toaster";
import { usersApi } from "@/shared/api/users";

export const AdminPanelUsersManager = () => {
  const createDialog = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = async (data: any) => {
    try {
      await usersApi.create({
        email: data.email,
        last_name: data.lastName,
        first_name: data.firstName,
        middle_name: data.middleName || undefined,
        role: data.role,
      });
      toaster.success({ title: "Пользователь успешно создан" });
      createDialog.onClose();
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      const errorMessage = error?.response?.data || error?.message || "Неизвестная ошибка";
      console.error("Error creating user:", error);
      toaster.error({
        title: "Ошибка создания пользователя",
        description: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
      });
    }
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
          <AdminPanelUsersTable key={refreshKey} />
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
