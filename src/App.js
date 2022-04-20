import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import MainMenu from './pages/MainMenu'
import AdminDashboard from './pages/AdminDashboard'
import AdminDashboardHotelRooms from './pages/AdminDashboardHotelRooms'
import AdminDashboardServices from './pages/AdminDashboardServices'
import Review from './pages/Review'
import SignInPage from './pages/SignInPage'
import Overlay from './components/Overlay'
import { CssBaseline } from '@mui/material'
import AdminRoute from './adapters/AdminRoute'
import ReceptionistRoute from './adapters/ReceptionistRoute'
import Authentication from './adapters/Authentication'
import AdminDashboardOrders from './pages/AdminDashboardOrders'
import AdminDashboardOrdersHistory from './pages/AdminDashboardOrdersHistory'
import Maps from './pages/Maps'
import UserRentPage from './pages/UserRentPage'
import UserRoomServicePage from './pages/UserRoomServicePage'
import UserCheckoutPage from './pages/UserCheckoutPage'
import AdminDashboardMenu from './pages/AdminDashboardMenu'
import AdminDashboardFoodOrdersHistory from './pages/AdminDashboardFoodOrdersHistory'

var refreshToken = window.setInterval(function () {
  Authentication.refreshTokenIfExpired()
}, 60000)

function App() {
  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Overlay>
          <Routes>
            <Route path="/rent" element={<UserRentPage />} />

            <Route path="/roomService" element={<UserRoomServicePage />} />

            <Route path="/checkout" element={<UserCheckoutPage />} />

            <Route path="/admin" element={<SignInPage />} />

            <Route
              exact
              path="/admin/dashboard/services"
              element={<AdminRoute />}
            >
              <Route
                exact
                path="/admin/dashboard/services"
                element={<AdminDashboardServices />}
              />
            </Route>

            <Route
              exact
              path="/admin/dashboard"
              element={<ReceptionistRoute />}
            >
              <Route
                exact
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />
            </Route>

            <Route
              exact
              path="/admin/dashboard/hotel-rooms"
              element={<AdminRoute />}
            >
              <Route
                exact
                path="/admin/dashboard/hotel-rooms"
                element={<AdminDashboardHotelRooms />}
              />
            </Route>

            <Route
              exact
              path="/admin/dashboard/orders"
              element={<AdminDashboardOrders />}
            ></Route>

            <Route
              exact
              path="/admin/dashboard/orders-history"
              element={<ReceptionistRoute />}
            >
              <Route
                exact
                path="/admin/dashboard/orders-history"
                element={<AdminDashboardOrdersHistory />}
              />
            </Route>

            <Route exact path="/admin/dashboard/menu" element={<AdminRoute />}>
              <Route
                exact
                path="/admin/dashboard/menu"
                element={<AdminDashboardMenu />}
              />
            </Route>

            <Route
              exact
              path="/admin/dashboard/food-orders-history"
              element={<ReceptionistRoute />}
            >
              <Route
                exact
                path="/admin/dashboard/food-orders-history"
                element={<AdminDashboardFoodOrdersHistory />}
              />
            </Route>

            <Route path="/menu/:roomId" element={<MainMenu />} />

            <Route path="/review" element={<Review />} />

            <Route path="/maps" element={<Maps />} />
          </Routes>
        </Overlay>
      </React.Fragment>
    </div>
  )
}

export default App
