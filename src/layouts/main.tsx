import AppHeader from "@/components/common/app-header"
import { Outlet } from "react-router"

export default function MainLayout() {
  return (
    <>
        <AppHeader />
        <main className="max-w-7xl mx-auto px-4 py-2">
          <Outlet />
        </main>
    </>
  )
}