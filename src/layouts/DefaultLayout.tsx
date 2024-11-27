import Sidebar from "@/components/Sidebar";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <Sidebar />
      <div className="w-full p-4">{children}</div>
    </div>
  );
}
