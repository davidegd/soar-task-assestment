import { lazy } from "react";

export const DashboardPage = lazy(() => import("./dashboard/page"));
export const CardsPage = lazy(() => import("./cards/page"));
export const SettingsPage = lazy(() => import("./settings/page"));
