"use client";

import { Button, Card, Flex, useDisclosure, Table, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fundingSourcesApi, type FundingSource } from "@/shared/api/fundingSources";
import { FundingSourceDialog } from "./FundingSourceDialog";
import { toaster } from "@/components/ui/toaster";
import { ItemActions } from "@/components/ui/ItemActions";

export const FundingSourcesManager = () => {
  const createDialog = useDisclosure();
  const editDialog = useDisclosure();
  const [items, setItems] = useState<FundingSource[]>([]);
  const [editItem, setEditItem] = useState<FundingSource | null>(null);

  const load = async () => {
    try {
      const list = await fundingSourcesApi.list();
      setItems(list);
    } catch (e) {
      toaster.error({ title: "Ошибка загрузки источников финансирования" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data: { name: string }) => {
    try {
      await fundingSourcesApi.create({ name: data.name });
      toaster.success({ title: "Источник создан" });
      createDialog.onClose();
      load();
    } catch {
      toaster.error({ title: "Ошибка создания источника" });
    }
  };

  const handleEdit = async (data: { id?: string; name: string }) => {
    if (!data.id) return;
    try {
      await fundingSourcesApi.update(data.id, { name: data.name });
      toaster.success({ title: "Источник обновлён" });
      editDialog.onClose();
      load();
    } catch {
      toaster.error({ title: "Ошибка обновления источника" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fundingSourcesApi.delete(id);
      toaster.success({ title: "Источник удалён" });
      load();
    } catch {
      toaster.error({ title: "Ошибка удаления источника" });
    }
  };

  return (
    <>
      <Card.Root>
        <Card.Header>
          <Flex align="center" justify="space-between">
            <Card.Title>Источники финансирования</Card.Title>
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
                      <Text color="gray.500">Нет источников финансирования</Text>
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

      <FundingSourceDialog open={createDialog.open} onOpenChange={(v) => (!v ? createDialog.onClose() : createDialog.onOpen())} onSubmit={handleCreate} />
      <FundingSourceDialog
        open={editDialog.open}
        onOpenChange={(v) => (!v ? editDialog.onClose() : editDialog.onOpen())}
        initialValue={editItem ?? undefined}
        onSubmit={handleEdit}
      />
    </>
  );
};


