"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  Field,
  Input,
  NumberInput,
  Portal,
  Select,
  createListCollection,
  Grid,
} from "@chakra-ui/react";
import { referenceApi } from "@/shared/api/reference";
import { expensesApi } from "@/shared/api/expenses";
import type { Category, Department } from "@/shared/types/expense";
import { toaster } from "@/components/ui/toaster";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const ExpenseDialog = ({ open, onClose, onCreated }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [categoryId, setCategoryId] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [vendor, setVendor] = useState<string>("");
  const [fundingSource, setFundingSource] = useState<string>("internal");

  const categoriesCollection = useMemo(
    () => createListCollection({ items: categories.map((c) => ({ label: c.name, value: c.id })) }),
    [categories]
  );
  const departmentsCollection = useMemo(
    () => createListCollection({ items: departments.map((d) => ({ label: d.name, value: d.id })) }),
    [departments]
  );

  useEffect(() => {
    if (!open) return;
    (async () => {
      const [cats, deps] = await Promise.all([referenceApi.getCategories(), referenceApi.getDepartments()]);
      setCategories(cats);
      setDepartments(deps);
    })();
  }, [open]);

  const isInvalid = !categoryId || !departmentId || !amount || !date;

  const handleSubmit = async () => {
    await expensesApi.create({
      category_id: categoryId,
      department_id: departmentId,
      amount: String(amount),
      incurred_on: date,
      description: undefined, // Keep description separate from performer
      funding_source: fundingSource,
      performer: vendor || undefined,
    });
    toaster.success({ title: "Запись создана" });
    onCreated();
  };

  const resetAndClose = () => {
    setCategoryId("");
    setDepartmentId("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setVendor("");
    setFundingSource("internal");
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
                  <NumberInput.Root value={amount} onValueChange={(details) => setAmount(String(details.value || ""))}>
                    <NumberInput.Input placeholder="Введите сумму, Р" />
                  </NumberInput.Root>
                </Field.Root>

                {/* Right Column */}
                <Field.Root>
                  <Field.Label>Источник финансирования</Field.Label>
                  <Select.Root
                    value={[fundingSource]}
                    onValueChange={(details) => setFundingSource(details.value[0] || "internal")}
                    collection={createListCollection({
                      items: [{ label: "Внутренний бюджет", value: "internal" }],
                    })}
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
                        <Select.Item item={{ label: "Внутренний бюджет", value: "internal" }}>
                          Внутренний бюджет
                          <Select.ItemIndicator />
                        </Select.Item>
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                </Field.Root>

                {/* Left Column */}
                <Field.Root>
                  <Field.Label>Исполнитель</Field.Label>
                  <Input placeholder="Введите данные исполнителя" value={vendor} onChange={(e) => setVendor(e.target.value)} />
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


