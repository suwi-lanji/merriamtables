import { ReactNode } from "react";

export type ColumnType =
  | "text"
  | "number"
  | "money"
  | "badge"
  | "icon"
  | "image"
  | "actions";

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  type: ColumnType;
  formatFn?: (value: any) => ReactNode;
  showOnMobile?: boolean;
}

export interface FilterField<T> {
  key: keyof T;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: string[]; // For select type
}

export interface Action<T> {
  label: string;
  onClick: (item: T) => void;
}

export interface DatatableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filterFields: FilterField<T>[];
  actions?: Action<T>[];
  title: string;
}
