"use client";

import { useState, useEffect, useRef, FC } from "react";
import { Dialog, Button, Portal, Field, Input, Select, createListCollection, Text } from "@chakra-ui/react";

// Интерфейс данных пользователя
export interface UserData {
  id?: number;
  lastName: string;
  firstName: string;
  middleName: string;
  email: string;
  role: string;
}

interface AdminPanelUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: UserData | null;
  onSubmit: (data: UserData) => void;
}

// Mock-массив ролей
const roleOptions = [
  { label: "Сотрудник", value: "employee" },
  { label: "Аналитик", value: "analyst" },
  { label: "Финансовый администратор", value: "financial_admin" },
];

export const AdminPanelUsersDialog: FC<AdminPanelUsersDialogProps> = ({
  open,
  onOpenChange,
  initialValue,
  onSubmit,
}) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const isEditMode = !!initialValue?.id;
  const lastNameRef = useRef<HTMLInputElement | null>(null);

  const roleCollection = createListCollection({
    items: roleOptions.map((r) => ({ label: r.label, value: r.value })),
  });

  useEffect(() => {
    if (open) {
      setLastName(initialValue?.lastName ?? "");
      setFirstName(initialValue?.firstName ?? "");
      setMiddleName(initialValue?.middleName ?? "");
      setEmail(initialValue?.email ?? "");
      setRole(initialValue?.role ?? "");
      lastNameRef.current?.focus();
    }
  }, [open, initialValue]);

  const isFormInvalid = !lastName.trim() || !firstName.trim() || !email.trim() || !role;

  const handleSave = () => {
    if (isFormInvalid) return;
    const data: UserData = {
      id: initialValue?.id,
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      email: email.trim(),
      role,
    };
    onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const currentRoleLabel =
    roleOptions.find((r) => r.value === role)?.label ?? role ?? "—";

  return (
    <Portal>
      <Dialog.Root
        open={open}
        onOpenChange={(details) => onOpenChange(details.open)}
        initialFocusEl={() => lastNameRef.current}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {isEditMode ? "Редактировать пользователя" : "Создать пользователя"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root>
                <Field.Label>Фамилия</Field.Label>
                <Input
                  ref={lastNameRef}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Введите фамилию"
                  autoFocus
                />
              </Field.Root>

              <Field.Root mt={4}>
                <Field.Label>Имя</Field.Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Введите имя"
                />
              </Field.Root>

              <Field.Root mt={4}>
                <Field.Label>Отчество</Field.Label>
                <Input
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Введите отчество (необязательно)"
                />
              </Field.Root>

              <Field.Root mt={4}>
                <Field.Label>Электронная почта</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите e-mail"
                />
              </Field.Root>

              <Field.Root mt={4}>
                <Field.Label>Роль</Field.Label>

                {initialValue?.role ? (
                  <Text fontWeight="medium" color="gray.700">
                    {currentRoleLabel}
                  </Text>
                ) : (
                  <Select.Root
                    collection={roleCollection}
                    value={role}
                    onValueChange={(val) => setRole(val as string)}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Выберите роль" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {roleCollection.items.map((opt) => (
                          <Select.Item item={opt} key={opt.value}>
                            {opt.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                )}
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={handleCancel}>
                Отмена
              </Button>
              <Button
                ml={3}
                colorScheme="teal"
                onClick={handleSave}
                disabled={isFormInvalid}
              >
                {isEditMode ? "Сохранить" : "Создать"}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  );
};
