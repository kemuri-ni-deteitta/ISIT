"use client";

import { Button, Card, Flex, Table, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { departmentsApi, type DepartmentDTO } from "@/shared/api/departments";
import { DepartmentDialog } from "./DepartmentDialog";
import { toaster } from "@/components/ui/toaster";
import { ItemActions } from "@/components/ui/ItemActions";

export const DepartmentsManager = () => {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const [items, setItems] = useState<DepartmentDTO[]>([]);
  const [editItem, setEditItem] = useState<DepartmentDTO | null>(null);

  const load = async () => {
    try {
      const list = await departmentsApi.list();
      setItems(list);
    } catch {
      toaster.error({ title: "Ошибка загрузки подразделений" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data: { name: string }) => {
    try {
      await departmentsApi.create({ name: data.name });
      toaster.success({ title: "Подразделение создано" });
      createDialog.onClose();
      load();
    } catch {
      toaster.error({ title: "Ошибка создания подразделения" });
    }
  };

  const handleEdit = async (data: { id?: string; name: string }) => {
    if (!data.id) return;
    try {
      await departmentsApi.update(data.id, { name: data.name });
      toaster.success({ title: "Подразделение обновлено" });
      editDialog.onClose();
      load();
    } catch {
      toaster.error({ title: "Ошибка обновления подразделения" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await departmentsApi.delete(id);
      toaster.success({ title: "Подразделение удалено" });
      load();
    } catch {
      toaster.error({ title: "Ошибка удаления подразделения" });
    }
  };

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Flex align="center" justify="space-between">
            <Card.Title>Подразделения</Card.Title>
            <Button onClick={createDialog.onOpen}>Добавить</Button>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Table.ScrollArea borderWidth="1px">
            <Table.Root variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Название</Table.ColumnHeader>
                  <Table.ColumnHeader width="60px"></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {items.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={2} textAlign="center" py={8}>
                      <Text color="gray.500">Нет подразделений</Text>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  items.map((i) => (
                    <Table.Row key={i.id}>
                      <Table.Cell>{i.name}</Table.Cell>
                      <Table.Cell>
                        <ItemActions
                          item={i}
                          onEdit={() => {
                            setEditItem(i);
                            editDialog.onOpen();
                          }}
                          onDelete={() => handleDelete(i.id)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Card.Body>
      </Card.Root>

      <DepartmentDialog open={createDialog.open} onOpenChange={(v) => (!v ? createDialog.onClose() : createDialog.onOpen())} onSubmit={handleCreate} />
      <DepartmentDialog
        open={editDialog.open}
        onOpenChange={(v) => (!v ? editDialog.onClose() : editDialog.onOpen())}
        initialValue={editItem ?? undefined}
        onSubmit={handleEdit}
      />
    </>
  );
};


