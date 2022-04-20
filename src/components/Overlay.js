import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'
import { useNavigate, useLocation } from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { SubjectOutlined } from '@material-ui/icons'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import BedroomChildOutlinedIcon from '@mui/icons-material/BedroomChildOutlined'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { format } from 'date-fns'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import Authentication from '../adapters/Authentication'
import CountryDropdownMenu from './CountryDropdownMenu'
import BikeScooterOutlinedIcon from '@mui/icons-material/BikeScooterOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import Grid from '@mui/material/Grid'
import LanguageIcon from '@mui/icons-material/Language'
import { useTranslation } from 'react-i18next'
import RestaurantMenuOutlinedIcon from '@mui/icons-material/RestaurantMenuOutlined'
import DinnerDiningOutlinedIcon from '@mui/icons-material/DinnerDiningOutlined'
import useInterval from '../hooks/useInterval'
import { useDispatch } from 'react-redux'
import { updateCount } from '../redux/unprocessedOrdersHandler'
import { useSelector } from 'react-redux'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import { red } from '@mui/material/colors'

import * as apiCalls from '../api/apiCalls'

const drawerWidth = 240

const useStyles = makeStyles((theme) => {
  return {
    page: {
      background: '#FFFFFF',
      width: '100%',
      padding: theme.spacing(3),
    },
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    active: {
      background: '#f4f4f4',
    },
    title: {
      padding: theme.spacing(2),
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    date: {
      flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
  }
})

function AdminOverlay({ children }) {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { count } = useSelector((state) => state.orderHandler)

  let roomServiceText = count > 0 ? 'Room Service - ' + count : 'Room Service'
  const alertTextColor = {
    color: red[400],
  }

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <SubjectOutlined color="primary" />,
      path: '/admin/dashboard',
      role: ['ADMIN', 'RECEPTIONIST'],
    },
    {
      text: 'Services',
      icon: <AssignmentOutlinedIcon color="primary" />,
      path: '/admin/dashboard/services',
      role: ['ADMIN'],
    },
    {
      text: 'Hotel Rooms',
      icon: <BedroomChildOutlinedIcon color="primary" />,
      path: '/admin/dashboard/hotel-rooms',
      role: ['ADMIN'],
    },
    {
      text: 'Menu',
      icon: <RestaurantMenuOutlinedIcon color="primary" />,
      path: '/admin/dashboard/menu',
      role: ['ADMIN'],
    },
    {
      text: 'Rent',
      icon: <BikeScooterOutlinedIcon color="primary" />,
      path: '/admin/dashboard/orders',
      role: ['ADMIN', 'RECEPTIONIST'],
    },
    {
      text: 'Rent History',
      icon: <HistoryOutlinedIcon color="primary" />,
      path: '/admin/dashboard/orders-history',
      role: ['ADMIN', 'RECEPTIONIST'],
    },

    {
      text: roomServiceText,
      icon:
        count === 0 ? (
          <DinnerDiningOutlinedIcon color="primary" />
        ) : (
          <PriorityHighIcon sx={{ color: red[400] }} />
        ),
      path: '/admin/dashboard/food-orders-history',
      role: ['ADMIN', 'RECEPTIONIST'],
    },
  ]

  const logout = () => {
    Authentication.removeUserCurrentlyLoggedIn()
    navigate('./admin', { replace: true })
  }

  useInterval(() => {
    apiCalls.getUnprocessedRoomServiceOrders().then((response) => {
      dispatch(updateCount(response.data.count))
    })
  }, 10000)

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar} color="primary">
        <Toolbar>
          <Typography className={classes.date}>
            Today is the {format(new Date(), 'do MMMM Y')}
          </Typography>
          {Authentication.getToken() != null && (
            <IconButton onClick={() => logout()}>
              <LogoutIcon style={{ color: 'white' }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <div>
          <Typography variant="h5" className={classes.title}>
            Adeo Services
          </Typography>
        </div>

        <List>
          {menuItems.map((item) =>
            item.role.includes(Authentication.getRole()) ? (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                className={
                  location.pathname === item.path ? classes.active : null
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    style:
                      item.text.includes('Room Service') && count > 0
                        ? alertTextColor
                        : null,
                  }}
                  primary={item.text}
                />
              </ListItem>
            ) : null,
          )}
        </List>
      </Drawer>

      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
      }}
      elevation={3}
    >
      <BottomNavigation showLabels sx={{ bgcolor: '#3f51b5' }}>
        <BottomNavigationAction
          label="Instagram"
          sx={{ color: 'white' }}
          icon={<InstagramIcon />}
          href="https://www.instagram.com/apart_hotel_adeo/"
        />
        <BottomNavigationAction
          label="Adeo"
          sx={{ color: 'white' }}
          icon={<LanguageIcon />}
          href="https://www.aparthotel-adeo.hr/"
        />
        <BottomNavigationAction
          label="Facebook"
          sx={{ color: 'white' }}
          icon={<FacebookIcon />}
          href="https://www.facebook.com/aparthotel.adeo.porec/"
        />
      </BottomNavigation>
    </Box>
  )
}

function UserOverlay({ children }) {
  const { roomNumber, roomId } = useSelector((state) => state.roomHandler)
  const location = useLocation()
  const isRoomDisplayed = !location.pathname.includes('admin')
  const classes = useStyles()
  const navigate = useNavigate()

  const { t } = useTranslation()

  const mainPage = () => {
    navigate(`./menu/${roomId}`, { replace: true })
  }

  return (
    <div>
      {/* app bar */}
      <AppBar color="primary">
        <Toolbar>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item xs={1}>
              <HomeIcon sx={{ mr: 13 }} onClick={() => mainPage()}></HomeIcon>
            </Grid>
            <Grid item xs={6}>
              {isRoomDisplayed && roomNumber !== '' && (
                <Box justifyContent="center">
                  <Typography align="center">
                    {t('overlayHotelRoomLabel') + ' ' + roomNumber}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={0}>
              <CountryDropdownMenu></CountryDropdownMenu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.root}>
        <div className={classes.page}>
          <div className={classes.toolbar}></div>
          {children}
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}

function PageOverlay({ children }) {
  const location = useLocation()

  if (location.pathname.startsWith('/admin/')) {
    return <AdminOverlay children={children}></AdminOverlay>
  } else {
    return <UserOverlay children={children}></UserOverlay>
  }
}

export default function Overlay({ children }) {
  return <PageOverlay children={children}></PageOverlay>
}
