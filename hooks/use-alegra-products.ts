"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { useApp } from "@/context/app-context"
import { getProductsFromInvoices } from "@/services/alegra-service"
import type { Product } from "@/services/product-service"

interface UseAlegraProductsReturn {
  isLoading: boolean
  error: string | null
  products: Product[]
  categorizedProducts: Record<string, Product[]>
  fetchProducts: (clientId: string, dateAfter: string) => Promise<Product[]>
  clearProducts: () => void
}

/**
 * Agrupa productos en solo 3 categorías: "Frutas y Verduras", "Hierbas" y "Otros"
 */
export function groupProductsByCategory(products: Product[]): Record<string, Product[]> {
  const categories: Record<string, Product[]> = {
    "Frutas y Verduras": [],
    "Hierbas y Especias": [],
    Otros: [],
  }

  // Clasificar productos en categorías basadas en nombres
  products.forEach((product) => {
    const name = product.name.toLowerCase()

    if (
      name.includes("huevos") ||
      name.includes("aceite") ||
      name.includes("mostaza") ||
      name.includes("salsa") ||
      name.includes("Ajinomoto") ||
      name.includes("Alcaparras") ||
      name.includes("Alfalfa") ||
      name.includes("Arroz") ||
      name.includes("Baby Romana Mesclum") ||
      name.includes("Bandeja") ||
      name.includes("Carbón") ||
      name.includes("Cardamomo") ||
      name.includes("Clavellinas") ||
      name.includes("Fiambrera") ||
      name.includes("Flores") ||
      name.includes("Hamburguesa") ||
      name.includes("Bandeja de") ||
      name.includes("Champiñón") ||
      name.includes("Ajo")
    ) {
      categories["Otros"].push(product)
    } else if (
      name.includes("cilantro") ||
      name.includes("albahaca") ||
      name.includes("perejil") ||
      name.includes("guasca") ||
      name.includes("arugula") ||
      name.includes("espinaca") ||
      name.includes("hierba") ||
      name.includes("menta") ||
      name.includes("oregano") ||
      name.includes("tomillo") ||
      name.includes("romero") ||
      name.includes("hierba buena") ||
      name.includes("hierba de") ||
      name.includes("jengibre")
    ) {
      categories["Hierbas y Especias"].push(product)
    } else {
      categories["Frutas y Verduras"].push(product)
    }
  })

  // Eliminar categorías vacías
  Object.keys(categories).forEach((key) => {
    if (categories[key].length === 0) {
      delete categories[key]
    }
  })

  return categories
}

function inferStepFromItems(items: Product[]) {
  return items.map((item) => {
    if (item.unit === "unit") {
      return { ...item, step: 1 }
    }

    if (item.unit === "kilogram") {
      const decimal = item.quantity % 1
      let step = 1

      if (decimal !== 0) {
        if (decimal % 0.25 === 0) step = 0.25
        else if (decimal % 0.1 === 0) step = 0.1
        else if (decimal % 0.5 === 0) step = 0.5
        else step = 0.1
      }

      return { ...item, step }
    }

    return { ...item, step: 1 }
  })
}

export function useAlegraProducts(): UseAlegraProductsReturn {
  const { setAlegraProducts, setCategorizedProducts } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = useCallback(
    async (clientId: string, dateAfter: string): Promise<Product[]> => {
      setIsLoading(true)
      setError(null)

      if (!clientId || !dateAfter) {
        const errorMsg = "Client ID and Date After are required"
        setError(errorMsg)
        toast.error("Missing parameters", {
          description: errorMsg,
        })
        return []
      }

      try {
        const fetchedProducts = await getProductsFromInvoices(clientId, dateAfter)

        if (!fetchedProducts || fetchedProducts.length === 0) {
          const noProductsMsg = "No products found for the specified criteria"
          setError(noProductsMsg)
          toast.warning("No products found", {
            description: noProductsMsg,
          })
          return []
        }

        const productsWithStep = inferStepFromItems(fetchedProducts)
        setProducts(productsWithStep)

        setAlegraProducts(productsWithStep)

        const categorized = groupProductsByCategory(productsWithStep)
        setCategorizedProducts(categorized)

        toast.success("Productos basados en tus ordenes anteriores", {
          description: `${fetchedProducts.length} productos`,
        })

        return productsWithStep
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to fetch products from Alegra"
        setError(errorMsg)
        toast.error("Error loading products", {
          description: errorMsg,
        })
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [setAlegraProducts, setCategorizedProducts]
  )

  const clearProducts = useCallback(() => {
    setProducts([])
    setAlegraProducts([])
    setCategorizedProducts({})
  }, [setAlegraProducts, setCategorizedProducts])

  return {
    isLoading,
    error,
    products,
    categorizedProducts: groupProductsByCategory(products),
    fetchProducts,
    clearProducts,
  }
}
