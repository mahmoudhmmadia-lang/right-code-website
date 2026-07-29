import Login from "@/pages/login/Login"
import { Navigate, Route, Routes } from "react-router-dom"

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default PublicRoutes
