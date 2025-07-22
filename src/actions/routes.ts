import { CartItem } from "@/types";
import axios from "axios";

export const genericRequestService = async ({
  params,
  body,
  config = {},
  controller = undefined,
}: {
  params: any;
  body: any;
  config: any;
  controller?: any;
}) => {
  const { url, method, apiKey } = config;

  try {
    const { data } = await axios({
      signal: controller ? controller.signal : undefined,
      url,
      method,
      params: {
        ...(params && {
          ...params,
        }),
      },
      data: {
        ...(body && {
          ...body,
        }),
      },
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        ...(config?.headers && config.headers),
      },
      timeout: config?.timeout,
    });

    return data;
  } catch (error: any) {
    if (error.message === "canceled") {
      return { error: "request was aborted" };
    }

    if (axios.isAxiosError(error)) {
      // Crear un mensaje de error más descriptivo basado en el código HTTP
      let userFriendlyMessage = error.message;
      let status = error.response?.status || 0;

      // Para errores de red, intentamos ser más específicos basados en el contexto
      if (error.code === "ERR_NETWORK") {
        // Si el error ocurre en un POST o PUT, probablemente es un error de validación
        const method = error.config?.method?.toUpperCase() || "";
        if (method === "POST" || method === "PUT") {
          status = 400;
          userFriendlyMessage =
            "Error de validación. Por favor verifica los datos enviados.";
        } else {
          userFriendlyMessage =
            "Error de red. Por favor verifica tu conexión e intenta de nuevo.";
        }
      }

      if (status) {
        switch (status) {
          case 400:
            userFriendlyMessage =
              (typeof error.response?.data === "string"
                ? error.response?.data
                : error.response?.data?.message) ||
              "Error en la solicitud. Por favor verifica los datos enviados.";
            break;
          case 401:
            userFriendlyMessage =
              "No autorizado. Por favor verifica tus credenciales.";
            break;
          case 403:
            userFriendlyMessage =
              "Acceso denegado. No tienes permisos para esta operación.";
            break;
          case 404:
            userFriendlyMessage =
              "Recurso no encontrado. Verifica la URL o identificador.";
            break;
          case 422:
            userFriendlyMessage =
              "Los datos enviados no pueden ser procesados. Verifica la información.";
          case 418:
            userFriendlyMessage =
              "Ha ocurrido un error al procesar la compra. Por favor intenta de nuevo.";
            break;
          case 500:
          case 502:
          case 503:
            userFriendlyMessage =
              "Error interno del servidor. Por favor intenta de nuevo más tarde.";
            break;
          case 504:
            userFriendlyMessage =
              "Tiempo de espera agotado. Por favor intenta de nuevo.";
            break;
        }
      }

      return {
        success: false,
        message: userFriendlyMessage,
        error: error,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        originalResponse: error.response,
        originalRequest: error.request,
        originalConfig: error.config,
      };
    }

    return {
      success: false,
      message: error.message || "Error desconocido",
      error: error,
    };
  }
};

export const sendOrder = async (orderData: {
  customerData: {
    numero_de_cedula: string;
    banco: string;
  };
  cart: CartItem[];
  total: number;
}) => {
  const response = await genericRequestService({
    config: {
      url: "https://backend-parcial.onrender.com/checkout",
      method: "POST",
    },
    body: {
      order: {
        precio: orderData.total,
        cedula: orderData.customerData.numero_de_cedula,
        banco: orderData.customerData.banco,
      },
    },
    params: {},
  });

  return response;
};
