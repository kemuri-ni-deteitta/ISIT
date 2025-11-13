"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, Button, Portal, Field, Input } from "@chakra-ui/react";
import type { FundingSource } from "@/shared/api/fundingSources";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: FundingSource | null;
  onSubmit: (data: { id?: string; name: string; code?: string }) => void;
}

export const FundingSourceDialog = ({ open, onOpenChange, initialValue, onSubmit }: Props) => {
  const [name, setName] = useState(initialValue?.name ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialValue?.name ?? "");
    }
  }, [open, initialValue]);

  const isInvalid = !name.trim();

  const handleSave = () => {
    if (isInvalid) return;
    onSubmit({ id: initialValue?.id, name: name.trim() });
    onOpenChange(false);
  };

  return (
    <Portal>
      <Dialog.Root open={open} onOpenChange={(d) => onOpenChange(d.open)} initialFocusEl={() => inputRef.current}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{initialValue ? "Редактировать источник" : "Создать источник"}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root required>
                <Field.Label>Название</Field.Label>
                <Input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Внутренний бюджет" />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button ml={3} onClick={handleSave} disabled={isInvalid}>
                {initialValue ? "Сохранить" : "Создать"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  );
};


