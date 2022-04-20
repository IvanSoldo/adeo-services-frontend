import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Authentication from './Authentication'

const ReceptionistRoute = () => {
  const isTokenExpired = Authentication.isTokenExpired()

  const auth = Authentication.isUserLoggedIn()

  const role = Authentication.getRole()

  return auth &&
    !isTokenExpired &&
    (role == 'ADMIN' || role == 'RECEPTIONIST') ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" />
  )
}

export default ReceptionistRoute
