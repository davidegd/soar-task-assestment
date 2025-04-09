import axios from "axios";
import { Product, ProductGroup } from "./product-service";

// URL base para las peticiones API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.alegra.com/api/v1/";

// Función para obtener el header de autenticación
const getAuthHeader = () => {
  return (
    process.env.NEXT_PUBLIC_ALEGRA_API_KEY ||
    "Basic bXV5cGFuYW1hQGdtYWlsLmNvbTo2MzU1MWZmMTE1ODA1MTg0MjRlYw=="
  );
};

export const getProductsFromInvoices = async (
  client_id: string,
  date_after: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}invoices?client_id=${client_id}&date_after=${date_after}&limit=4`,
      {
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
      }
    );

    const items = response.data.flatMap((invoice: any) => invoice.items);
    return items;
  } catch (error) {
    console.error("Error fetching products from invoices:", error);
    return [];
  }
};

/**
 * Agrupa los productos por remisión/factura
 */
export const groupProductsByInvoice = (products: any[]): ProductGroup[] => {
  // Crear un mapa para agrupar productos por remisión
  const invoiceMap = new Map<string, any[]>();

  // Agrupar productos por remisión
  products.forEach((product) => {
    if (!product.remission) return; // Ignorar productos sin remisión

    const key = product.remission;
    if (!invoiceMap.has(key)) {
      invoiceMap.set(key, []);
    }
    invoiceMap.get(key)?.push(product);
  });

  // Convertir el mapa a un array de ProductGroup
  const productGroups: ProductGroup[] = [];
  invoiceMap.forEach((items, remission) => {
    if (items.length > 0) {
      productGroups.push({
        remission: remission,
        remissionNumber: items[0].remissionNumber || remission,
        items: items,
      });
    }
  });

  return productGroups;
};

/**
 * Obtiene un grupo de productos específico a partir de las facturas de un cliente
 */
export const fetchClientProductGroup = async (
  id: string,
  params?: { clientId?: string | null; dateAfter?: string | null }
): Promise<ProductGroup | null> => {
  try {
    if (!params?.clientId || !params?.dateAfter) {
      throw new Error("Client ID and date are required");
    }

    // Obtener los productos de las facturas del cliente
    const products = await getProductsFromInvoices(params.clientId, params.dateAfter);

    // Si no hay productos, retornar null
    if (!products || products.length === 0) {
      return null;
    }

    // Agrupar productos por factura
    const productGroups = groupProductsByInvoice(products);

    // Buscar el grupo específico por ID
    const group = productGroups.find((group) => group.remission === id);

    // Si no encontramos el grupo específico pero tenemos productos,
    // creamos un grupo con todos los productos (para propósitos de demostración)
    if (!group && products.length > 0) {
      return {
        remission: id,
        remissionNumber: `INV-${id}`,
        items: products,
      };
    }

    return group || null;
  } catch (error) {
    console.error(`Error fetching client product group with ID ${id}:`, error);
    return null;
  }
};

/**
 * Obtiene todos los productos de las facturas de un cliente
 */
export const fetchClientProducts = async (params?: {
  clientId?: string | null;
  dateAfter?: string | null;
}): Promise<Product[]> => {
  try {
    if (!params?.clientId || !params?.dateAfter) {
      throw new Error("Client ID and date are required");
    }

    // Obtener los productos de las facturas del cliente
    const products = await getProductsFromInvoices(params.clientId, params.dateAfter);

    return products;
  } catch (error) {
    console.error("Error fetching client products:", error);
    return [];
  }
};
