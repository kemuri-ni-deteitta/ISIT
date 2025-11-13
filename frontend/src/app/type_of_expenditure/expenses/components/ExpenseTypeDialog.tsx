"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, Button, Portal, Field, Input } from "@chakra-ui/react";

export interface ExpenseType {
  id?: string | number;
  name: string;
}

interface ExpenseTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: ExpenseType | null;
  onSubmit: (data: ExpenseType) => void;
}

export const ExpenseTypeDialog = ({ open, onOpenChange, initialValue, onSubmit }: ExpenseTypeDialogProps) => {
  const [name, setName] = useState(initialValue?.name ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isEditMode = !!initialValue?.id;
  const isNameInvalid = !name.trim();

  useEffect(() => {
    if (open) {
      if (isEditMode && initialValue) {
        setName(initialValue.name);
      } else {
        setName("");
      }
    }
  }, [open, initialValue, isEditMode]);

  const handleSave = () => {
    if (isNameInvalid) return;
    const data = isEditMode ? { ...initialValue, name: name.trim() } : { name: name.trim() };
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName(initialValue?.name ?? "");
    onOpenChange(false);
  };

  return (
    <Portal>
      <Dialog.Root
        open={open}
        onOpenChange={(details) => onOpenChange(details.open)}
        initialFocusEl={() => inputRef.current}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{isEditMode ? "Редактировать тип расхода" : "Создать тип расхода"}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root required>
                <Field.Label>Название</Field.Label>
                <Input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  autoFocus
                />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
              <Button onClick={handleSave} colorPalette="teal" disabled={isNameInvalid}>
                {isEditMode ? "Сохранить" : "Создать"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  );
};
