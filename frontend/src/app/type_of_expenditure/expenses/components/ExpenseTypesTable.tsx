"use client";

import { ItemActions } from "@/components/ui/ItemActions";
import { Table, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ExpenseType, ExpenseTypeDialog } from "./ExpenseTypeDialog";
import { referenceApi } from "@/shared/api/reference";
import { toaster } from "@/components/ui/toaster";

export const ExpenseTypesTable = () => {
  const [types, setTypes] = useState<ExpenseType[]>([]);
  const [editItem, setEditItem] = useState<ExpenseType | null>(null);
  const [loading, setLoading] = useState(false);

  const editDialog = useDisclosure();

  const loadTypes = async () => {
    try {
      setLoading(true);
      const list = await referenceApi.getCategories();
      setTypes(list.map((c) => ({ id: c.id, name: c.name })));
    } catch (error) {
      toaster.error({ title: "Ошибка загрузки типов затрат" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleDelete = async (type: ExpenseType) => {
    if (!type.id) return;
    try {
      await referenceApi.deleteCategory(String(type.id));
      toaster.success({ title: "Тип затрат удалён" });
      loadTypes();
    } catch (error) {
      toaster.error({ title: "Ошибка удаления типа затрат" });
    }
  };

  const handleEdit = async (data: ExpenseType) => {
    if (!data.id) return;
    try {
      await referenceApi.updateCategory(String(data.id), { name: data.name });
      toaster.success({ title: "Тип затрат обновлён" });
      editDialog.onClose();
      loadTypes();
    } catch (error) {
      toaster.error({ title: "Ошибка обновления типа затрат" });
    }
  };

  const handleEditClick = (type: ExpenseType) => {
    setEditItem(type);
    editDialog.onOpen();
  };

  return (
    <>
      <Table.ScrollArea borderWidth="1px">
        <Table.Root variant={"outline"}>
          <Table.Caption />
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Название</Table.ColumnHeader>
              <Table.ColumnHeader width="60px"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {types.map((type) => (
              <Table.Row key={type.id}>
                <Table.Cell>{type.name}</Table.Cell>
                <Table.Cell>
                  <ItemActions item={type} onEdit={() => handleEditClick(type)} onDelete={handleDelete} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Диалог редактирования */}
      <ExpenseTypeDialog
        open={editDialog.open}
        onOpenChange={(val) => (!val ? editDialog.onClose() : editDialog.onOpen())}
        initialValue={editItem}
        onSubmit={handleEdit}
      />
    </>
  );
};
