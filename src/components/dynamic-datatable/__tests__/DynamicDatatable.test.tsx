import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DynamicDatatable from "../DynamicDatatable";
import { ColumnDef, FilterField, Action } from "../../../types/datatable";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
  actions?: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    stock: 50,
    rating: 4.5,
    image: "https://example.com/laptop.jpg",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    stock: 100,
    rating: 4.2,
    image: "https://example.com/smartphone.jpg",
  },
];

const columns: ColumnDef<Product>[] = [
  { header: "Image", accessorKey: "image", type: "image", showOnMobile: true },
  { header: "Name", accessorKey: "name", type: "text", showOnMobile: true },
  {
    header: "Category",
    accessorKey: "category",
    type: "badge",
    showOnMobile: true,
  },
  { header: "Price", accessorKey: "price", type: "money", showOnMobile: true },
  {
    header: "Stock",
    accessorKey: "stock",
    type: "number",
    showOnMobile: false,
  },
  {
    header: "Rating",
    accessorKey: "rating",
    type: "icon",
    formatFn: (value: number) => (
      <div className="flex items-center">
        <span className="text-yellow-400">⭐</span>
        {value.toFixed(1)}
      </div>
    ),
    showOnMobile: true,
  },
  {
    header: "Actions",
    accessorKey: "actions",
    type: "actions",
    showOnMobile: true,
  },
];

const filterFields: FilterField<Product>[] = [
  { key: "name", label: "Name", type: "text" },
  {
    key: "category",
    label: "Category",
    type: "select",
    options: ["Electronics", "Audio", "Appliances", "Wearables"],
  },
  { key: "price", label: "Max Price", type: "number" },
];

const actions: Action<Product>[] = [
  {
    label: "View",
    onClick: vi.fn(), // Mock function for testing
  },
  {
    label: "Edit",
    onClick: vi.fn(), // Mock function for testing
  },
];

describe("DynamicDatatable", () => {
  it("renders the table with data", () => {
    render(
      <DynamicDatatable<Product>
        data={products}
        columns={columns}
        filterFields={filterFields}
        actions={actions}
        title="Product Catalog"
      />,
    );

    // Check if the title is rendered
    expect(screen.getByText("Product Catalog")).toBeInTheDocument();

    // Check if the table headers are rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Price")).toBeInTheDocument();

    // Check if the data is rendered in the table
    const tableRows = screen.getAllByRole("row");
    expect(tableRows[1]).toHaveTextContent("Laptop"); // First data row
    expect(tableRows[2]).toHaveTextContent("Smartphone"); // Second data row
  });

  it("filters data based on input", async () => {
    render(
      <DynamicDatatable<Product>
        data={products}
        columns={columns}
        filterFields={filterFields}
        actions={actions}
        title="Product Catalog"
      />,
    );

    // Find the filter input for "Name"
    const nameFilterInput = screen.getByLabelText("Name:");
    fireEvent.change(nameFilterInput, { target: { value: "Laptop" } });

    // Check if only the filtered data is displayed
    const laptopElements = screen.getAllByText("Laptop");
    expect(laptopElements.length).toBeGreaterThan(0); // At least one "Laptop" element

    const smartphoneElements = screen.queryAllByText("Smartphone");
    expect(smartphoneElements.length).toBe(0); // No "Smartphone" elements
  });

  it("renders mobile cards on small screens", () => {
    // Mock window.innerWidth to simulate a small screen
    window.innerWidth = 500;

    render(
      <DynamicDatatable<Product>
        data={products}
        columns={columns}
        filterFields={filterFields}
        actions={actions}
        title="Product Catalog"
      />,
    );

    // Check if mobile cards are rendered
    const mobileCards = screen.getAllByRole("card"); // Assuming mobile cards have a role="card"
    expect(mobileCards.length).toBe(products.length); // Ensure all products are rendered as cards

    // Check if the first card contains "Laptop"
    expect(mobileCards[0]).toHaveTextContent("Laptop");
    expect(mobileCards[1]).toHaveTextContent("Smartphone");
  });
});
