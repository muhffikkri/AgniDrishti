import {
  Map,
  LayoutDashboard,
  Wheat,
  Handshake,
  ReceiptText,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/risk-intelligence", label: "Risk Intelligence", icon: Map },
  { href: "/residue", label: "Residue Registry", icon: Wheat },
  { href: "/marketplace", label: "Buyer Matching", icon: Handshake },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/impact", label: "Impact & Evidence", icon: LineChart },
];
