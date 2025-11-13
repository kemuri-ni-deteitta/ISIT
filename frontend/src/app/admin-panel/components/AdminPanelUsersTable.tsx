"use client";

import { useState, useEffect } from "react";
import { Table, useDisclosure, Spinner, Flex, Text } from "@chakra-ui/react";
import { AdminPanelUsersDialog, UserData } from "./AdminPanelUsersDialog";
import { ItemActions } from "@/components/ui/ItemActions";
import { usersApi } from "@/shared/api/users";
import { toaster } from "@/components/ui/toaster";
import { getRoleLabel } from "@/shared/utils/roles";

// Helper to parse full_name into parts
function parseFullName(fullName: string | null): { lastName: string; firstName: string; middleName: string } {
  if (!fullName) {
    return { lastName: "", firstName: "", middleName: "" };
  }
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 3) {
    return { lastName: parts[0], firstName: parts[1], middleName: parts.slice(2).join(" ") };
  } else if (parts.length === 2) {
    return { lastName: parts[0], firstName: parts[1], middleName: "" };
  } else if (parts.length === 1) {
    return { lastName: parts[0], firstName: "", middleName: "" };
  }
  return { lastName: "", firstName: "", middleName: "" };
}

export const AdminPanelUsersTable = () => {
  const editDialog = useDisclosure();
  const [users, setUsers] = useState<UserData[]>([]);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const list = await usersApi.list();
      setUsers(
        list.map((u) => {
          const nameParts = parseFullName(u.full_name);
          return {
            id: u.id,
            lastName: nameParts.lastName,
            firstName: nameParts.firstName,
            middleName: nameParts.middleName,
            email: u.email,
            role: u.role,
          };
        })
      );
    } catch (error) {
      toaster.error({ title: "Ошибка загрузки пользователей" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditClick = (user: UserData) => {
    setEditUser(user);
    editDialog.onOpen();
  };

  const handleEditSubmit = async (updated: UserData) => {
    if (!updated.id) return;
    try {
      await usersApi.update(String(updated.id), {
        email: updated.email,
        last_name: updated.lastName,
        first_name: updated.firstName,
        middle_name: updated.middleName || undefined,
        role: updated.role,
      });
      toaster.success({ title: "Пользователь обновлён" });
      editDialog.onClose();
      loadUsers();
    } catch (error) {
      toaster.error({ title: "Ошибка обновления пользователя" });
    }
  };

  const handleDelete = async (user: UserData) => {
    if (!user.id) return;
    try {
      await usersApi.delete(String(user.id));
      toaster.success({ title: "Пользователь удалён" });
      loadUsers();
    } catch (error) {
      toaster.error({ title: "Ошибка удаления пользователя" });
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" p={10}>
        <Spinner />
      </Flex>
    );
  }

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
            {users.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={8}>
                  <Text color="gray.500">Нет пользователей</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              users.map((u) => (
                <Table.Row key={u.id}>
                  <Table.Cell>
                    {u.lastName} {u.firstName} {u.middleName}
                  </Table.Cell>
                  <Table.Cell>{u.email}</Table.Cell>
                  <Table.Cell>{getRoleLabel(u.role)}</Table.Cell>
                  <Table.Cell>
                    <ItemActions
                      item={u}
                      onEdit={() => handleEditClick(u)}
                      onDelete={() => handleDelete(u)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
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
