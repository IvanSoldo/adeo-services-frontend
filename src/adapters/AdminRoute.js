import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Authentication from './Authentication'

const AdminRoute = () => {
  const isTokenExpired = Authentication.isTokenExpired()

  const auth = Authentication.isUserLoggedIn()

  const role = Authentication.getRole()

  return auth && !isTokenExpired && role == 'ADMIN' ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" />
  )
}

export default AdminRoute
