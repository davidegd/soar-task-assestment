import axios from "axios";
export interface Tax {
  id: string;
  name: string;
  percentage: string;
  description: string | null;
  status: string;
  deductible: string;
  type: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  reference: string;
  quantity: number;
  unit: "kilogram" | "unit";
  tax: Tax[];
  total: number;
  remission: string;
  remissionNumber: string;
  idItemRemission: string;
  step: number;
}

export interface ProductGroup {
  remission: string;
  remissionNumber: string;
  items: Product[];
}
