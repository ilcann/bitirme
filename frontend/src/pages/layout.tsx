import AppHeader from "@/components/common/app-header"
import { Spotlight } from "@/components/ui/spotlight-new"
import { Outlet } from "react-router"

export default function MainLayout() {
  return (
    <>
        <AppHeader />
        <Outlet />
        <Spotlight />
    </>
  )
}