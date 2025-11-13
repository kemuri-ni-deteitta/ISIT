"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, Badge, Spinner, Flex, Text } from "@chakra-ui/react";
import { expensesApi } from "@/shared/api/expenses";
import { referenceApi } from "@/shared/api/reference";
import type { Category, Department, Expense } from "@/shared/types/expense";
import { ItemActions } from "@/components/ui/ItemActions";
import { toaster } from "@/components/ui/toaster";

export const ExpenseList = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const categoryById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const departmentById = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const handleDelete = async (exp: Expense) => {
    if (!exp?.id) return;
    try {
      await expensesApi.delete(String(exp.id));
      setItems((prev) => prev.filter((i) => i.id !== exp.id));
      toaster.success({ title: "Запись удалена" });
    } catch {
      toaster.error({ title: "Ошибка удаления записи" });
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [list, cats, deps] = await Promise.all([
          expensesApi.list(1, 50),
          referenceApi.getCategories(),
          referenceApi.getDepartments(),
        ]);
        if (!mounted) return;
        setItems(list.expenses);
        setCategories(cats);
        setDepartments(deps);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Flex align="center" justify="center" p={10}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Table.ScrollArea borderWidth="1px">
      <Table.Root variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ДАТА</Table.ColumnHeader>
            <Table.ColumnHeader>ТИП ЗАТРАТ</Table.ColumnHeader>
            <Table.ColumnHeader>СУММА</Table.ColumnHeader>
            <Table.ColumnHeader>ПОДРАЗДЕЛЕНИЯ</Table.ColumnHeader>
            <Table.ColumnHeader>ИСПОЛНИТЕЛЬ</Table.ColumnHeader>
            <Table.ColumnHeader>ИСТОЧНИК ФИНАНСИРОВАНИЯ</Table.ColumnHeader>
            <Table.ColumnHeader width="60px"></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center" py={8}>
                <Text color="gray.500">Нет записей о затратах</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            items.map((e) => (
              <Table.Row key={e.id}>
                <Table.Cell>{new Date(e.incurred_on).toISOString().slice(0, 10)}</Table.Cell>
                <Table.Cell>{categoryById[e.category_id]?.name ?? e.category_id}</Table.Cell>
                <Table.Cell>
                  <Text as="span" fontWeight="medium">
                    {Number(e.amount).toLocaleString("ru-RU")}
                  </Text>{" "}
                  ₽
                </Table.Cell>
                <Table.Cell>{departmentById[e.department_id]?.name ?? e.department_id}</Table.Cell>
                <Table.Cell>{e.performer || "—"}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette="teal">
                    {e.funding_source === "internal" ? "Внутренний бюджет" : e.funding_source}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <ItemActions
                    item={e}
                    onEdit={() => {
                      // TODO: Implement edit
                      console.log("Edit expense", e.id);
                    }}
                    onDelete={handleDelete}
                  />
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};


