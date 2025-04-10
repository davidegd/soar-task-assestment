import React from "react"

import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { CardItem } from "@/components/dashboard/card-item"
import type { Card } from "@/types"
import { useTheme } from "next-themes"

jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light", setTheme: jest.fn() })),
}))

describe("CardItem Component", () => {
  const mockCard: Card = {
    balance: 1000,
    cardHolder: "John Doe",
    validThru: "12/25",
    cardNumber: "1234 5678 9012 3456",
    isDark: false,
    id: "3",
    type: "visa",
  }

  it("renders card information correctly", () => {
    const { getByText, getByAltText } = render(<CardItem card={mockCard} />)

    expect(getByText("Balance")).toBeInTheDocument()
    expect(getByText("$1,000.00")).toBeInTheDocument()
    expect(getByText("John Doe")).toBeInTheDocument()
    expect(getByText("12/25")).toBeInTheDocument()
    expect(getByText("1234 **** **** 3456")).toBeInTheDocument()
    expect(getByAltText("card-logo")).toBeInTheDocument()
  })

  it("applies correct class based on theme", () => {
    ;(useTheme as jest.Mock).mockReturnValue({ theme: "dark" })

    const { container } = render(<CardItem card={mockCard} />)
    expect(container.firstChild).toHaveClass("card-dark")
  })

  it("applies correct class based on card.isDark", () => {
    ;(useTheme as jest.Mock).mockReturnValue({ theme: "light" })
    const darkCard = { ...mockCard, isDark: true }

    const { container } = render(<CardItem card={darkCard} />)
    expect(container.firstChild).toHaveClass("card-dark")
  })

  it("applies correct class when neither theme nor card is dark", () => {
    ;(useTheme as jest.Mock).mockReturnValue({ theme: "light" })

    const { container } = render(<CardItem card={mockCard} />)
    expect(container.firstChild).toHaveClass("card-light")
  })
})
