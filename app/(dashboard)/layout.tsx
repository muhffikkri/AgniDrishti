import { AppShell } from "@/components/layout/app-shell";
import { AppStoreProvider } from "@/context/AppStore";
import { ToastProvider } from "@/components/ui/toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <AppShell>{children}</AppShell>
      </ToastProvider>
    </AppStoreProvider>
  );
}
