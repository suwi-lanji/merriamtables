"use client";

import React from "react";
import { DynamicDatatable } from "../../components/dynamic-datatable";
import { ColumnDef, FilterField, Action } from "../../types/datatable";
import { Star, ShoppingCart } from "lucide-react";
import "../../index.css";
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 999.99,
    stock: 50,
    rating: 4.5,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    price: 699.99,
    stock: 100,
    rating: 4.2,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Headphones",
    category: "Audio",
    price: 149.99,
    stock: 200,
    rating: 4.7,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Appliances",
    price: 79.99,
    stock: 30,
    rating: 4.0,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Fitness Tracker",
    category: "Wearables",
    price: 129.99,
    stock: 75,
    rating: 4.3,
    image: "/placeholder.svg?height=40&width=40",
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
        <Star className="w-5 h-5 text-yellow-400 mr-1" />
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
    onClick: (product) => {
      console.log("Viewing product:", product);
      alert(`Viewing ${product.name}`);
    },
  },
  {
    label: "Edit",
    onClick: (product) => {
      console.log("Editing product:", product);
      alert(`Editing ${product.name}`);
    },
  },
];

export default function Example() {
  return (
    <div className="container mx-auto py-10">
      <DynamicDatatable<Product>
        data={products}
        columns={columns}
        filterFields={filterFields}
        actions={actions}
        title="Product Catalog"
      />
    </div>
  );
}
