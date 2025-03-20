import {
  Home,
  CreditCard,
  Users,
  BarChart3,
  FileText,
  Settings,
  CheckSquare,
  Landmark,
  Wallet,
} from "lucide-react";

export function getNavigationItems(pathname: string) {
  return [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/dashboard",
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: <FileText className="h-5 w-5" />,
      active: pathname === "/transactions",
    },
    {
      title: "Accounts",
      href: "/accounts",
      icon: <Users className="h-5 w-5" />,
      active: pathname === "/accounts",
    },
    {
      title: "Investments",
      href: "/investments",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname === "/investments",
    },
    {
      title: "Credit Cards",
      href: "/cards",
      icon: <CreditCard className="h-5 w-5" />,
      active: pathname === "/cards",
    },
    {
      title: "Loans",
      href: "/loans",
      icon: <Landmark className="h-5 w-5" />,
      active: pathname === "/loans",
    },
    {
      title: "Services",
      href: "/services",
      icon: <CheckSquare className="h-5 w-5" />,
      active: pathname === "/services",
    },
    {
      title: "My Privileges",
      href: "/privileges",
      icon: <Wallet className="h-5 w-5" />,
      active: pathname === "/privileges",
    },
    {
      title: "Setting",
      href: "/setting",
      icon: <Settings className="h-5 w-5" />,
      active: pathname === "/setting",
    },
  ];
}
