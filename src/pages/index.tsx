import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Product, CartItem } from "@/types";
import { sampleProducts } from "@/data/products";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, quantity),
    }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity === 0) return;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Reset quantity selector
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const goToCheckout = () => {
    if (cart.length === 0) {
      alert("Por favor agrega productos al carrito antes de continuar");
      return;
    }
    // Store cart data in localStorage for checkout page
    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  return (
    <>
      <Head>
        <title>Marketplace - Productos</title>
        <meta
          name="description"
          content="Selecciona productos para tu compra"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <header className={styles.header}>
          <h1>🛍️ Marketplace</h1>
          <div className={styles.cartSummary}>
            <span>Carrito: {getTotalItems()} items</span>
            <span>${getTotalPrice().toLocaleString()}</span>
            {cart.length > 0 && (
              <button className={styles.checkoutBtn} onClick={goToCheckout}>
                Ir al Checkout
              </button>
            )}
          </div>
        </header>

        <main className={styles.main}>
          <h2>Selecciona tus productos</h2>

          <div className={styles.productsGrid}>
            {sampleProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <span>📱</span>
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.price}>
                    ${product.price.toLocaleString()}
                  </div>
                  <div className={styles.stock}>
                    Stock disponible: {product.stock}
                  </div>

                  <div className={styles.quantitySection}>
                    <label>Cantidad:</label>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            (quantities[product.id] || 1) - 1
                          )
                        }
                        disabled={
                          !quantities[product.id] || quantities[product.id] <= 1
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantities[product.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            product.id,
                            (quantities[product.id] || 1) + 1
                          )
                        }
                        disabled={quantities[product.id] >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className={styles.addToCartBtn}
                    onClick={() => addToCart(product)}
                    disabled={
                      product.stock === 0 ||
                      (quantities[product.id] || 1) > product.stock
                    }
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className={styles.cartPreview}>
              <h3>Resumen del Carrito</h3>
              {cart.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                  <span>
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className={styles.cartTotal}>
                <strong>Total: ${getTotalPrice().toLocaleString()}</strong>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
