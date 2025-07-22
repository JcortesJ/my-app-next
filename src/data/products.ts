import { Product } from "@/types";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone Pro",
    price: 899000,
    description:
      "Último modelo con cámara de alta resolución y batería de larga duración",
    image: "/phone.svg",
    stock: 15,
  },
  {
    id: "2",
    name: "Laptop Gaming",
    price: 2500000,
    description:
      "Laptop para gaming con procesador de alta gama y tarjeta gráfica dedicada",
    image: "/laptop.svg",
    stock: 8,
  },
  {
    id: "3",
    name: "Auriculares Bluetooth",
    price: 350000,
    description: "Auriculares inalámbricos con cancelación de ruido activa",
    image: "/headphones.svg",
    stock: 25,
  },
  /*
  {
    id: "4",
    name: 'Tablet 10"',
    price: 650000,
    description: "Tablet de 10 pulgadas ideal para trabajo y entretenimiento",
    image: "/tablet.svg",
    stock: 12,
  },
  {
    id: "5",
    name: "Smartwatch",
    price: 450000,
    description: "Reloj inteligente con monitor de salud y GPS integrado",
    image: "/watch.svg",
    stock: 20,
  },
  {
    id: "6",
    name: "Cámara Digital",
    price: 1200000,
    description: "Cámara profesional con lente intercambiable y grabación 4K",
    image: "/camera.svg",
    stock: 6,
  },
  */
];
