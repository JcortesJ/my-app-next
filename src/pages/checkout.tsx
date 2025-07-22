import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { CartItem, CustomerData } from "@/types";
import { sendOrder } from "@/actions/routes";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ToastContainer";
import Loader from "@/components/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bancos = ["Bancolombia"];

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData>({
    cedula: "",
    numero_de_cedula: "",
    banco: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    // Load cart from localStorage
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCart(JSON.parse(cartData));
    } else {
      // Redirect to home if no cart data
      router.push("/");
    }
  }, [router]);

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    /*
    if (!customerData.cedula.trim()) {
      newErrors.cedula = "El tipo de cédula es requerido";
    }
      */

    if (!customerData.numero_de_cedula.trim()) {
      newErrors.numero_de_cedula = "El número de cédula es requerido";
    } else if (!/^\d+$/.test(customerData.numero_de_cedula)) {
      newErrors.numero_de_cedula =
        "El número de cédula debe contener solo números";
    }

    if (!customerData.banco.trim()) {
      newErrors.banco = "Selecciona un banco";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data
      const orderData = {
        customerData: {
          numero_de_cedula: customerData.numero_de_cedula,
          banco: customerData.banco,
        },
        cart,
        total: getTotalPrice(),
      };

      // Send order
      const response = await sendOrder(orderData);

      console.log("Order response:", response);

      // Check if the response indicates an error
      if (response && response.success === false) {
        console.log("response", response);
        // Show specific error message from the API
        showError(
          response.message || "Error al procesar la compra. Inténtalo de nuevo."
        );
        return;
      }

      // Success case
      showSuccess(
        "¡Compra realizada exitosamente! Gracias por tu compra.",
        4000
      );

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect after a short delay to allow user to see the success message
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error: any) {
      console.error("Order submission error:", error);

      // Show specific error message if available, otherwise generic message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error al procesar la compra. Inténtalo de nuevo.";

      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    router.push("/");
  };

  if (cart.length === 0) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Checkout - Finalizar Compra</title>
        <meta
          name="description"
          content="Completa tu información para finalizar la compra"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <header className={styles.header}>
          <h1>🛍️ Checkout</h1>
          <button className={styles.backBtn} onClick={goBack}>
            ← Volver a Productos
          </button>
        </header>

        <main className={styles.checkoutMain}>
          <div className={styles.checkoutContainer}>
            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h2>Resumen del Pedido</h2>
              <div className={styles.orderItems}>
                {cart.map((item) => (
                  <div key={item.product.id} className={styles.orderItem}>
                    <div className={styles.orderItemInfo}>
                      <h4>{item.product.name}</h4>
                      <p>Cantidad: {item.quantity}</p>
                      <p>
                        Precio unitario: ${item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className={styles.orderItemTotal}>
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.orderTotal}>
                <h3>Total: ${getTotalPrice().toLocaleString()}</h3>
              </div>
            </div>

            {/* Customer Form */}
            <div className={styles.customerForm}>
              <h2>Información Personal</h2>
              <form onSubmit={handleSubmit}>
                {/*
                <div className={styles.formGroup}>
                  
                  <label htmlFor="cedula">Tipo de Cédula</label>
                  <select
                    id="cedula"
                    value={customerData.cedula}
                    onChange={(e) =>
                      handleInputChange("cedula", e.target.value)
                    }
                    className={errors.cedula ? styles.error : ""}
                  >
                    <option value="">Selecciona el tipo de cédula</option>
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                    <option value="PP">Pasaporte (PP)</option>
                  </select>
                  {errors.cedula && (
                    <span className={styles.errorMessage}>{errors.cedula}</span>
                  )}
                </div>
                */}
                <div className={styles.formGroup}>
                  <label htmlFor="numero_de_cedula">Número de Cédula *</label>
                  <input
                    type="text"
                    id="numero_de_cedula"
                    value={customerData.numero_de_cedula}
                    onChange={(e) =>
                      handleInputChange("numero_de_cedula", e.target.value)
                    }
                    placeholder="Ingresa tu número de cédula"
                    className={errors.numero_de_cedula ? styles.error : ""}
                    disabled={isSubmitting}
                  />
                  {errors.numero_de_cedula && (
                    <span className={styles.errorMessage}>
                      {errors.numero_de_cedula}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="banco">Banco *</label>
                  <select
                    id="banco"
                    value={customerData.banco}
                    onChange={(e) => handleInputChange("banco", e.target.value)}
                    className={errors.banco ? styles.error : ""}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona tu banco</option>
                    {bancos.map((banco) => (
                      <option key={banco} value={banco}>
                        {banco}
                      </option>
                    ))}
                  </select>
                  {errors.banco && (
                    <span className={styles.errorMessage}>{errors.banco}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className={styles.buttonContent}>
                      <Loader size="small" color="white" />
                      <span>Procesando compra...</span>
                    </div>
                  ) : (
                    `Finalizar Compra - $${getTotalPrice().toLocaleString()}`
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <Loader
              size="large"
              color="primary"
              text="Procesando tu compra..."
            />
            <p className={styles.loadingMessage}>
              Por favor espera mientras confirmamos tu pedido
            </p>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
