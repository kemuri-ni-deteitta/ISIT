"use client";

import { Button, Card, Flex, useDisclosure, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { referenceApi } from "@/shared/api/reference";
import { ExpenseTypeDialog, type ExpenseType } from "./ExpenseTypeDialog";
import { toaster } from "@/components/ui/toaster";
import { ItemActions } from "@/components/ui/ItemActions";

export const ExpenseTypesManager = () => {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const [items, setItems] = useState<ExpenseType[]>([]);
  const [editItem, setEditItem] = useState<ExpenseType | null>(null);

  const load = async () => {
    try {
      const list = await referenceApi.getCategories();
      setItems(list.map((c) => ({ id: c.id, name: c.name })));
    } catch (e) {
      toaster.error({ title: "Ошибка загрузки типов затрат" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data: ExpenseType) => {
    try {
      await referenceApi.createCategory({ name: data.name });
      toaster.success({ title: "Тип затрат создан" });
      createDialog.onClose();
      load();
    } catch {
      toaster.error({ title: "Ошибка создания типа затрат" });
    }
  };

  const handleEdit = async (data: ExpenseType) => {
    if (!data.id) return;
    try {
      await referenceApi.updateCategory(String(data.id), { name: data.name });
      toaster.success({ title: "Тип затрат обновлён" });
      editDialog.onClose();
      load();
    } catch {
      toaster.error({ title: "Ошибка обновления типа затрат" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await referenceApi.deleteCategory(id);
      toaster.success({ title: "Тип затрат удалён" });
      load();
    } catch {
      toaster.error({ title: "Ошибка удаления типа затрат" });
    }
  };

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Flex align="center" justify="space-between">
            <Card.Title>Типы затрат</Card.Title>
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
                      <Text color="gray.500">Нет типов затрат</Text>
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
                          onDelete={() => handleDelete(String(i.id))}
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

      <ExpenseTypeDialog open={createDialog.open} onOpenChange={(v) => (!v ? createDialog.onClose() : createDialog.onOpen())} onSubmit={handleCreate} />
      <ExpenseTypeDialog
        open={editDialog.open}
        onOpenChange={(v) => (!v ? editDialog.onClose() : editDialog.onOpen())}
        initialValue={editItem ?? undefined}
        onSubmit={handleEdit}
      />
    </>
  );
};
