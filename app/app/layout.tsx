import ContentLayout from "@/components/content-layout";
import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";
import { ReactQueryProvider } from "./react-query-provider";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ReactQueryProvider>
      <div className="antialiased h-[100vh] bg-[#F1F2F3]">
        <Sidebar />
        <ContentLayout>{children}</ContentLayout>
      </div>
    </ReactQueryProvider>
  );
}
