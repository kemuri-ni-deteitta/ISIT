"use client";
import { Box, IconButton, Menu, Portal, Button, Dialog } from "@chakra-ui/react";
import { useState } from "react";
import { LuEllipsisVertical, LuFilePen, LuTrash } from "react-icons/lu";

interface ItemActionsProps<T> {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
}

export const ItemActions = <T,>({ item, onEdit, onDelete }: ItemActionsProps<T>) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Menu.Root positioning={{ placement: "right-start" }}>
        <Menu.Trigger asChild>
          <IconButton aria-label="Действия" variant="ghost">
            <LuEllipsisVertical />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="edit" onClick={() => onEdit(item)}>
                <LuFilePen />
                <Box flex="1">Редактировать</Box>
              </Menu.Item>
              <Menu.Item value="delete" onClick={() => setDeleteOpen(true)}>
                <LuTrash />
                <Box flex="1">Удалить</Box>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      <Portal>
        <Dialog.Root open={deleteOpen} onOpenChange={(e) => setDeleteOpen(e.open)} role="alertdialog">
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Подтвердите удаление</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>Вы уверены, что хотите удалить этот элемент?</Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Отмена
                </Button>
                <Button
                  colorPalette="red"
                  onClick={() => {
                    onDelete(item);
                    setDeleteOpen(false);
                  }}
                >
                  Удалить
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Portal>
    </>
  );
};
