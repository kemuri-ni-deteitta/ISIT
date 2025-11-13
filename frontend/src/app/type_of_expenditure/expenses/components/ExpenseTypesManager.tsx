"use client";

import { Button, Card, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { ExpenseTypesTable } from "./ExpenseTypesTable";
import { ExpenseTypeDialog } from "./ExpenseTypeDialog";
import { referenceApi } from "@/shared/api/reference";
import { toaster } from "@/components/ui/toaster";
import { useState } from "react";

export const ExpenseTypesManager = () => {
  const createDialog = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreate = async (data: { name: string }) => {
    try {
      await referenceApi.createCategory({ name: data.name });
      toaster.success({ title: "Тип затрат создан" });
      createDialog.onClose();
      setRefreshKey((k) => k + 1);
    } catch (error: any) {
      const errorMessage = error?.response?.data || error?.message || "Неизвестная ошибка";
      console.error("Error creating expense type:", error);
      toaster.error({ 
        title: "Ошибка создания типа затрат",
        description: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
      });
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
        <Card.Body gap={5}>
          <Text>
            Позволяет управлять типами операционных расходов, создавать новые типы затрат, редактировать
            существующие и удалять неактуальные.
          </Text>
          <ExpenseTypesTable key={refreshKey} />
        </Card.Body>
      </Card.Root>

      <ExpenseTypeDialog
        open={createDialog.open}
        onOpenChange={(val) => (!val ? createDialog.onClose() : createDialog.onOpen())}
        onSubmit={handleCreate}
      />
    </>
  );
};
