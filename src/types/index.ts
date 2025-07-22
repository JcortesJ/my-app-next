export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerData {
  cedula: string;
  numero_de_cedula: string;
  banco: string;
}
