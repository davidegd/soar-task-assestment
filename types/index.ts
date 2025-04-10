export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  dateOfBirth: string
  presentAddress: string
  permanentAddress: string
  city: string
  postalCode: string
  country: string
}

export interface Card {
  id: string
  cardNumber: string
  cardHolder: string
  validThru: string
  balance: number
  type: "visa" | "mastercard"
  isDark: boolean
}

export interface Transaction {
  id: string
  title: string
  date: string
  amount: number
  type: "deposit" | "withdrawal"
  icon: string
}

export interface Contact {
  id: string
  name: string
  role: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
  fill?: boolean
  tension?: number
}

export interface NavItem {
  title: string
  href: string
  icon: string
  active?: boolean
}
