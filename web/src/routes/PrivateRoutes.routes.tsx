import DashboardLayout from "@/components/DashboardLayout"
import Home from "@/pages/home/Home"
import { Navigate, Route, Routes } from "react-router-dom"

function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}

export default PrivateRoutes
