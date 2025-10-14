import type { Metadata } from "next";
import SideNav from "@/components/SideNav/SideNav";
import 'react-image-crop/dist/ReactCrop.css'
import { ToastProvider } from '@/components/Ui/ToastContext';

export const metadata: Metadata = {
  title: "TechShare | Panel de administración",
  description: "Panel de administración de TechShare",
};

export default function AdminLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <ToastProvider>
      <div className={`horizontal-flex`}>
        <div className="side-nav">
          <SideNav />
        </div>
        <div className="content">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
