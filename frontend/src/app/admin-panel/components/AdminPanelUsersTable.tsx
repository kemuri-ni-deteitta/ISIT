"use client";

import { useState } from "react";
import { Table, TableScrollArea, useDisclosure } from "@chakra-ui/react"; // замени на актуальные импорты
import { AdminPanelUsersDialog, UserData } from "./AdminPanelUsersDialog";
import { SearchInput } from "@/components/ui/SearchInput";
import { ItemActions } from "@/components/ui/ItemActions";

// Mock‑данные пользователей
const mockUsers: UserData[] = [
  {
    id: 1,
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович",
    email: "ivanov@example.com",
    role: "employee",
  },
  {
    id: 2,
    lastName: "Петров",
    firstName: "Пётр",
    middleName: "Петрович",
    email: "petrov@example.com",
    role: "analyst",
  },
  {
    id: 3,
    lastName: "Сидорова",
    firstName: "Анна",
    middleName: "Сергеевна",
    email: "sidorova@example.com",
    role: "financial_admin",
  },
];

export const AdminPanelUsersTable = () => {
  const editDialog = useDisclosure();
  const [users, setUsers] = useState<UserData[]>(mockUsers);
  const [editUser, setEditUser] = useState<UserData | null>(null);

  // При клике на редактирование
  const handleEditClick = (user: UserData) => {
    setEditUser(user); // <-- установили редактируемого пользователя
    editDialog.onOpen(); // <-- открыли диалог
  };

  const handleEditSubmit = (updated: UserData) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    editDialog.onClose();
  };

  const handleDelete = (user: UserData) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  return (
    <>
      <Table.ScrollArea borderWidth="1px">
        <Table.Root variant="outline">
          <Table.Caption />
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Пользователь (ФИО)</Table.ColumnHeader>
              <Table.ColumnHeader>Почта</Table.ColumnHeader>
              <Table.ColumnHeader>Роль</Table.ColumnHeader>
              <Table.ColumnHeader width="60px"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((u) => (
              <Table.Row key={u.id}>
                <Table.Cell>
                  {u.lastName} {u.firstName} {u.middleName}
                </Table.Cell>
                <Table.Cell>{u.email}</Table.Cell>
                <Table.Cell>{u.role}</Table.Cell>
                <Table.Cell>
                  <ItemActions
                    item={u}
                    onEdit={() => handleEditClick(u)}
                    onDelete={() => handleDelete(u)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <AdminPanelUsersDialog
        open={editDialog.open}
        onOpenChange={(val) => (!val ? editDialog.onClose() : editDialog.onOpen())}
        initialValue={editUser}
        onSubmit={handleEditSubmit}
      />
    </>
  );
};
