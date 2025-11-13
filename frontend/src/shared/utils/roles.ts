// Role mapping: English (backend) -> Russian (UI)
export const roleLabels: Record<string, string> = {
  employee: "Сотрудник",
  analyst: "Аналитик",
  financial_admin: "Финансовый администратор",
};

// Role mapping: Russian (UI) -> English (backend)
export const roleValues: Record<string, string> = {
  "Сотрудник": "employee",
  "Аналитик": "analyst",
  "Финансовый администратор": "financial_admin",
};

export function getRoleLabel(roleValue: string): string {
  return roleLabels[roleValue] || roleValue;
}

export function getRoleValue(roleLabel: string): string {
  return roleValues[roleLabel] || roleLabel;
}

