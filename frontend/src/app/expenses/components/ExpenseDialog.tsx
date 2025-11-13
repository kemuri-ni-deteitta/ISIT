"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  Field,
  Input,
  Portal,
  Select,
  createListCollection,
  Grid,
} from "@chakra-ui/react";
import { referenceApi } from "@/shared/api/reference";
import { expensesApi } from "@/shared/api/expenses";
import type { Category, Department } from "@/shared/types/expense";
import { toaster } from "@/components/ui/toaster";
import { usersApi } from "@/shared/api/users";
import { fundingSourcesApi, type FundingSource } from "@/shared/api/fundingSources";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const ExpenseDialog = ({ open, onClose, onCreated }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [sources, setSources] = useState<FundingSource[]>([]);

  const [categoryId, setCategoryId] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [vendor, setVendor] = useState<string>("");
  const [fundingSource, setFundingSource] = useState<string>("");
  const formatter = useMemo(() => new Intl.NumberFormat("ru-RU"), []);

  const categoriesCollection = useMemo(
    () => createListCollection({ items: categories.map((c) => ({ label: c.name, value: c.id })) }),
    [categories]
  );
  const departmentsCollection = useMemo(
    () => createListCollection({ items: departments.map((d) => ({ label: d.name, value: d.id })) }),
    [departments]
  );
  const usersCollection = useMemo(
    () => createListCollection({ items: users.map((u) => ({ label: u.name, value: u.id })) }),
    [users]
  );
  const sourcesCollection = useMemo(
    () => createListCollection({ items: sources.map((s) => ({ label: s.name, value: s.id })) }),
    [sources]
  );

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [cats, deps, us, fs] = await Promise.all([
          referenceApi.getCategories(),
          referenceApi.getDepartments(),
          usersApi.list(),
          fundingSourcesApi.list(),
        ]);
        setCategories(cats);
        setDepartments(deps);
        setUsers(us.map((u) => ({ id: u.id, name: u.full_name ?? u.email })));
        setSources(fs);
        // Set default funding source if available
        if (fs.length > 0 && !fundingSource) {
          setFundingSource(fs[0].id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toaster.error({ title: "Ошибка загрузки данных" });
      }
    })();
  }, [open]);

  const isInvalid = !categoryId || !departmentId || !amount || !date || !fundingSource;

  const handleSubmit = async () => {
    try {
      // Get user name from selected user ID
      const selectedUser = users.find((u) => u.id === vendor);
      const performerName = selectedUser?.name || undefined;

      // Get funding source name from selected ID
      const selectedSource = sources.find((s) => s.id === fundingSource);
      const fundingSourceName = selectedSource?.name || "";

      await expensesApi.create({
        category_id: categoryId,
        department_id: departmentId,
        amount: String(amount).replace(/\s/g, ""),
        incurred_on: date,
        description: undefined,
        funding_source: fundingSourceName,
        performer: performerName,
      });
      toaster.success({ title: "Запись создана" });
      onCreated();
    } catch (error: any) {
      const errorMessage = error?.response?.data || error?.message || "Неизвестная ошибка";
      console.error("Error creating expense:", error);
      toaster.error({
        title: "Ошибка создания записи",
        description: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
      });
    }
  };

  const resetAndClose = () => {
    setCategoryId("");
    setDepartmentId("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setVendor("");
    // Reset to first available source or empty
    if (sources.length > 0) {
      setFundingSource(sources[0].id);
    } else {
      setFundingSource("");
    }
    onClose();
  };

  return (
    <Portal>
      <Dialog.Root open={open} onOpenChange={(d) => (!d.open ? resetAndClose() : undefined)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Создать запись о затратах</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {/* Left Column */}
                <Field.Root>
                  <Field.Label>Тип затрат</Field.Label>
                  <Select.Root collection={categoriesCollection} value={[categoryId]} onValueChange={(details) => setCategoryId(details.value[0] || "")}>
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Выберите тип затрат" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {categoriesCollection.items.map((i) => (
                          <Select.Item key={i.value} item={i}>
                            {i.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                {/* Right Column */}
                <Field.Root>
                  <Field.Label>Дата</Field.Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Field.Root>

                {/* Left Column */}
                <Field.Root>
                  <Field.Label>Сумма расхода</Field.Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => {
                      // Remove all non-digit characters
                      const raw = e.target.value.replace(/\D/g, "");
                      // Format with thousand separators
                      const formatted = raw ? formatter.format(Number(raw)) : "";
                      setAmount(formatted);
                    }}
                    onBlur={(e) => {
                      // Ensure value is preserved on blur
                      const raw = e.target.value.replace(/\D/g, "");
                      const formatted = raw ? formatter.format(Number(raw)) : "";
                      setAmount(formatted);
                    }}
                    placeholder="Введите сумму, ₽"
                  />
                </Field.Root>

                {/* Right Column */}
                <Field.Root>
                  <Field.Label>Источник финансирования</Field.Label>
                  <Select.Root
                    value={[fundingSource]}
                    onValueChange={(details) => setFundingSource(details.value[0] || "internal")}
                    collection={sourcesCollection}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Выберите источник" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {sourcesCollection.items.map((i) => (
                          <Select.Item key={i.value} item={i}>
                            {i.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                {/* Left Column */}
                <Field.Root>
                  <Field.Label>Исполнитель</Field.Label>
                  <Select.Root
                    collection={usersCollection}
                    value={vendor ? [vendor] : []}
                    onValueChange={(details) => setVendor(details.value[0] || "")}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Выберите пользователя" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {usersCollection.items.map((i) => (
                          <Select.Item key={i.value} item={i}>
                            {i.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                {/* Right Column */}
                <Field.Root>
                  <Field.Label>Подразделение</Field.Label>
                  <Select.Root
                    collection={departmentsCollection}
                    value={[departmentId]}
                    onValueChange={(details) => setDepartmentId(details.value[0] || "")}
                  >
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Введите данные подразделения" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content>
                        {departmentsCollection.items.map((i) => (
                          <Select.Item key={i.value} item={i}>
                            {i.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                {/* Left Column - Documents */}
                <Field.Root>
                  <Field.Label>Подтверждающие документы</Field.Label>
                  <Button variant="outline" size="sm">
                    Загрузить
                  </Button>
                </Field.Root>
              </Grid>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={resetAndClose}>
                Отмена
              </Button>
              <Button ml={3} onClick={handleSubmit} disabled={isInvalid}>
                Подтвердить
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Portal>
  );
};


