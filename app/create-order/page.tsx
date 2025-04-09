"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ShoppingCart,
  Plus,
  Minus,
  Tag,
  Cherry,
  Wheat,
  EggFried,
  Grape,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAlegraProducts } from "@/hooks/use-alegra-products";
import type { Product } from "@/services/product-service";
import { decompress } from "lz-string";

interface OrderItem {
  product: Product;
  quantity: number;
}

const decodeShortUrl = (encoded: string) => {
  try {
    const decoded = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));

    const params = new URLSearchParams(decoded);

    return {
      client_id: params.get("c") || "",
      date_after: params.get("d")?.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3") || "",
    };
  } catch (error) {
    console.error("Error decoding:", error);
    return null;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Frutas y Verduras":
      return <Grape className="mr-2 h-5 w-5 text-emerald-400" />;
    case "Hierbas y Especias":
      return <Wheat className="mr-2 h-5 w-5 text-emerald-400" />;
    case "Otros":
    default:
      return <ChefHat className="mr-2 h-5 w-5 text-emerald-400" />;
  }
};

export default function CreateOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [decodedParams, setDecodedParams] = useState<{ client_id: any; date_after: any } | null>(
    null
  );

  // Valores por defecto para clientId y dateAfter (ocultos para el usuario)
  // const clientId = searchParams.get("client_id") || "44";
  // const dateAfter = searchParams.get("date_after") || "2024-03-20";
  // const params = searchParams.get("p")

  // Usar directamente el hook de useAlegraProducts
  const { isLoading: isLoadingAlegra, fetchProducts, categorizedProducts } = useAlegraProducts();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isLoadingAlegra || isSubmitting;

  useEffect(() => {
    const encoded = searchParams.get("p");
    console.log(encoded);
    if (encoded) {
      try {
        const decoded = decodeShortUrl(encoded);
        if (decoded) {
          const { client_id, date_after } = decoded;
          console.log(client_id, date_after);
          setDecodedParams({ client_id: client_id, date_after });
        }
      } catch (error) {
        console.error("Invalid base64 or JSON:", error);
      }
    }
  }, [searchParams]);
  console.log(decodedParams);
  useEffect(() => {
    const loadData = async () => {
      try {
        if (decodedParams && decodedParams.client_id && decodedParams.date_after)
          await fetchProducts(decodedParams.client_id, decodedParams.date_after);
      } catch (error) {
        console.error("Error loading products:", error);
        toast.error("Error loading products", {
          description: "Failed to load product data. Please try again.",
        });
      }
    };

    loadData();
  }, [decodedParams, fetchProducts]);

  // Función para añadir o actualizar un producto en la orden
  const updateOrderItem = (product: Product, quantity: number) => {
    setOrderItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingItemIndex >= 0) {
        // Si el producto ya está en la orden, actualizar cantidad
        const updatedItems = [...prevItems];

        // Si la cantidad es 0, eliminar el producto
        if (quantity <= 0) {
          updatedItems.splice(existingItemIndex, 1);
          return updatedItems;
        }

        // Actualizar cantidad
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity,
        };
        return updatedItems;
      } else {
        // Si el producto no está en la orden y la cantidad es mayor que 0, añadirlo
        if (quantity > 0) {
          return [...prevItems, { product, quantity }];
        }
        return prevItems;
      }
    });
  };

  // Función para incrementar la cantidad de un producto
  const incrementQuantity = (product: Product) => {
    const currentItem = orderItems.find((item) => item.product.id === product.id);
    const currentQuantity = currentItem ? currentItem.quantity : 0;
    // Usar siempre un paso de 1, independientemente de la unidad
    const newQuantity = currentQuantity + product.step;

    // No verificar límite de stock, permitir cualquier cantidad
    updateOrderItem(product, Number(newQuantity.toFixed(2)));
  };

  // Función para decrementar la cantidad de un producto
  const decrementQuantity = (product: Product) => {
    const currentItem = orderItems.find((item) => item.product.id === product.id);
    const currentQuantity = currentItem ? currentItem.quantity : 0;

    // Usar siempre un paso de 1, independientemente de la unidad
    const newQuantity = currentQuantity - product.step;

    updateOrderItem(product, newQuantity > 0 ? Number(newQuantity.toFixed(2)) : 0);
  };

  // Calcular el total de la orden
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  // Manejar la creación de la orden
  const handleCreateOrder = () => {
    if (orderItems.length === 0) {
      toast.error("Empty order", {
        description: "Please add at least one product to your order",
      });
      return;
    }

    setIsSubmitting(true);

    // Simular una petición a la API
    setTimeout(() => {
      toast.success("Order created successfully", {
        description: `Order total: $${calculateTotal().toFixed(2)}`,
      });
      setOrderItems([]);
      setIsSubmitting(false);

      // Redirigir al dashboard después de crear la orden
      router.push("/dashboard");
    }, 1500);
  };

  // Manejar la negociación de precio
  const handleNegotiatePrice = () => {
    if (orderItems.length === 0) {
      toast.error("Empty order", {
        description: "Please add at least one product to your order",
      });
      return;
    }

    setIsSubmitting(true);

    // Simular una petición a la API
    setTimeout(() => {
      toast.success("Negotiation request sent", {
        description: `Request sent with total: $${calculateTotal().toFixed(2)}`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  // Obtener la cantidad actual de un producto en la orden
  const getItemQuantity = (productId: string) => {
    const item = orderItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Mostrar un estado de carga mientras se obtienen los datos
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-12 w-full bg-neutral-200" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl bg-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:h-[calc(100vh-4rem)]">
      {/* Encabezado */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Order</h1>
          <p className="text-muted-foreground">Select products and quantities for your order</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">
            <span className="text-muted-foreground">Items:</span> {orderItems.length}
          </div>
          <div className="text-sm font-medium">
            <span className="text-muted-foreground">Total:</span> ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>

      {/* Contenido principal con scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-8 pb-20">
            {Object.entries(categorizedProducts).map(([category, products], index) => (
              <div key={category + index} className="fade-in">
                <div className="mb-4 flex items-center">
                  {getCategoryIcon(category)}
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <Separator className="ml-4 flex-1" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product, i) => (
                    <ProductCard
                      key={product.id + i}
                      product={product}
                      category={category}
                      quantity={getItemQuantity(product.id)}
                      onIncrement={() => incrementQuantity(product)}
                      onDecrement={() => decrementQuantity(product)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer fijo */}
      <div className="sticky bottom-0 left-0 right-0 mt-auto border-t bg-background p-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="w-full md:w-auto">
            <div className="text-sm text-muted-foreground">Total Order Value</div>
            <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
          </div>
          <div className="flex w-full gap-4 md:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 md:flex-none"
              onClick={handleNegotiatePrice}
              disabled={isSubmitting || orderItems.length === 0}
            >
              <Tag className="mr-2 h-5 w-5" />
              Negotiate Price
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-emerald-500 md:flex-none"
              onClick={handleCreateOrder}
              disabled={isSubmitting || orderItems.length === 0}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Create Order
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar un producto individual
interface ProductCardProps {
  product: Product;
  category: string;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function ProductCard({ product, category, quantity, onIncrement, onDecrement }: ProductCardProps) {
  const isInCart = quantity > 0;

  // Obtener el icono según la categoría
  const getProductIcon = (category: string) => {
    switch (category) {
      case "Frutas y Verduras":
        return <Grape className="h-10 w-10 text-neutral-600" />;
      case "Hierbas y Especias":
        return <Wheat className="h-10 w-10 text-neutral-600" />;
      case "Otros":
      default:
        return <ChefHat className="h-10 w-10 text-neutral-600" />;
    }
  };

  return (
    <Card
      className={cn(
        "smooth-transition overflow-hidden transition-all duration-200",
        isInCart ? "border-primary/50 shadow-md" : ""
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-emerald-100">
            {getProductIcon(category)}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {product.description ||
                `${product.unit === "kilogram" ? "Sold by weight" : "Sold by unit"}`}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-semibold">${product.price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                Unidad mínima: {product.unit === "kilogram" ? `${product.step}kg` : "1 und"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t  px-3 pt-3">
          <div className="text-sm">
            {/* <span className="text-muted-foreground">Available:</span> {product.quantity}{" "}
            {product.unit === "kilogram" ? "kg" : "units"} */}
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onDecrement}
              disabled={quantity === 0}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Decrease quantity</span>
            </Button>

            <div className="w-16 text-center font-medium">
              {quantity > 0 ? quantity : 0} {product.unit === "kilogram" ? "kg" : ""}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onIncrement}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
