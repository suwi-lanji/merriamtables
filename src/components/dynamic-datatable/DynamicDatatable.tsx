import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { DatatableProps, ColumnDef } from "../../types/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DynamicDatatable<T extends { id: number | string }>({
  data,
  columns,
  filterFields,
  actions,
  title,
}: DatatableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, _] = useState(10);

  const handleSort = (column: keyof T) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilter = (key: keyof T, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item[key as keyof T])
            .toLowerCase()
            .includes(value.toLowerCase()),
        );
      }
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const renderCell = (column: ColumnDef<T>, value: any, item: T) => {
    if (column.formatFn) {
      return column.formatFn(value);
    }

    switch (column.type) {
      case "text":
      case "number":
        return String(value);
      case "money":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      case "badge":
        return <Badge variant="secondary">{String(value)}</Badge>;
      case "icon":
        return <span className="text-2xl">{value}</span>;
      case "image":
        return (
          <img
            src={value}
            alt="Table cell"
            className="w-10 h-10 object-cover rounded-full"
          />
        );
      case "actions":
        return (
          <div className="flex space-x-2">
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => action.onClick(item)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        );
      default:
        return String(value);
    }
  };

  const renderMobileCard = (item: T) => (
    <Card key={`card-${item.id}`} className="mb-4" role="card">
      <CardContent className="pt-4">
        {columns
          .filter((col) => col.showOnMobile !== false)
          .map((column) => (
            <div
              key={`mobile-${item.id}-${String(column.accessorKey)}`}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <span className="font-medium">{column.header}:</span>
              <span>{renderCell(column, item[column.accessorKey], item)}</span>
            </div>
          ))}
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Menu className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Apply filters to the data</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                {filterFields.map((field) => (
                  <div
                    key={String(field.key)}
                    className="flex flex-col space-y-1"
                  >
                    <label
                      htmlFor={String(field.key)}
                      className="text-sm font-medium"
                    >
                      {field.label}:
                    </label>
                    {field.type === "select" ? (
                      <Select
                        onValueChange={(value) =>
                          handleFilter(field.key, value)
                        }
                        value={(filters[field.key] as string) || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={String(field.key)}
                        type={field.type}
                        value={(filters[field.key] as string) || ""}
                        onChange={(e) =>
                          handleFilter(field.key, e.target.value)
                        }
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden lg:flex flex-wrap gap-4">
            {filterFields.map((field) => (
              <div key={String(field.key)} className="flex flex-col space-y-1">
                <label
                  htmlFor={String(field.key)}
                  className="text-sm font-medium"
                >
                  {field.label}:
                </label>
                {field.type === "select" ? (
                  <Select
                    onValueChange={(value) => handleFilter(field.key, value)}
                    value={(filters[field.key] as string) || ""}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={String(field.key)}
                    type={field.type}
                    value={(filters[field.key] as string) || ""}
                    onChange={(e) => handleFilter(field.key, e.target.value)}
                    className="w-full sm:w-40"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-md border hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      key={String(column.accessorKey)}
                      onClick={() => handleSort(column.accessorKey)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center">
                        {column.header}
                        {sortColumn === column.accessorKey &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="ml-2 h-4 w-4" />
                          ) : (
                            <ChevronDown className="ml-2 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={`row-${row.id}`}>
                    {columns.map((column) => (
                      <TableCell
                        key={`cell-${row.id}-${String(column.accessorKey)}-${column.type}`}
                      >
                        {renderCell(column, row[column.accessorKey], row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden">{paginatedData.map(renderMobileCard)}</div>

          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedData.length,
              )}{" "}
              of {filteredAndSortedData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
