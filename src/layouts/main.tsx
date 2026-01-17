import AppHeader from "@/components/common/app-header"
import { Outlet } from "react-router"

export default function MainLayout() {
  return (
    <>
        <AppHeader />
        <Outlet />
    </>
  )
}