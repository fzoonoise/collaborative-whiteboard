import Navbar from "./_components/Navbar/Navbar";
import { OrgSidebar } from "./_components/OrgSidebar";
import Sidebar from "./_components/Sidebar/Sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Sidebar />

      <div className="pl-[60px] h-full">
        <div className="flex h-full gap-x-3">
          <OrgSidebar />
          <div className="flex-1 h-full">
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
