import { Button, Container, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import AdminRentForm from '../components/AdminRentForm'
import TimelineChart from '../components/TimelineChart'
import CustomSnackBar from '../components/CustomSnackBar'
import * as apiCalls from '../api/apiCalls'

const AdminDashboardOrders = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isGraphOpen, setIsGraphOpen] = useState(true)
  const [rooms, setRooms] = useState([])
  const [servicesTypes, setServicesTypes] = useState([])
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false)
  const [message, setMessage] = useState(undefined)
  const [severity, setSeverity] = useState(undefined)
  const [isRentRequestLoading, setIsRentRequestIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [newOrder, setNewOrder] = useState()
  const [selectedServiceType, setSelectedServiceType] = useState({
    id: '',
    name: '',
  })
  const [orderSelectedServiceType, setOrderSelectedServiceType] = useState({
    id: '',
    name: '',
  })

  const handleIsFormOpen = () => {
    setIsFormOpen(!isFormOpen)
  }

  const handleIsGraphOpen = () => {
    setIsGraphOpen(!isGraphOpen)
  }

  const onClickHandleSnackBar = () => {
    setIsSnackBarOpen(false)
  }

  const getServiceTypes = () => {
    apiCalls
      .getServiceTypes('EN')
      .then((response) => {
        setServicesTypes([...response.data.servicesTypes])
      })
      .catch((error) => {
        setIsSnackBarOpen(true)
        setMessage('Something went wrong. Please try again.')
        setSeverity('error')
      })
  }

  const getAllRooms = () => {
    apiCalls
      .getAllRooms()
      .then((response) => {
        setRooms([...response.data.rooms])
      })
      .catch((error) => {
        setIsSnackBarOpen(true)
        setMessage('Something went wrong. Please try again,')
        setSeverity('error')
      })
  }

  const handleSubmit = (order) => {
    setIsRentRequestIsLoading(true)

    apiCalls
      .createNewOrder(order)
      .then((response) => {
        setIsRentRequestIsLoading(false)
        setIsSuccess(true)
        setNewOrder(response.data)
      })
      .catch((error) => {
        setIsRentRequestIsLoading(false)
        setIsSnackBarOpen(true)
        setMessage('Something went wrong. Please try again.')
        setSeverity('error')
        setNewOrder()
      })
  }

  useEffect(() => {
    getAllRooms()
    getServiceTypes()
  }, [])

  return (
    <Container sx={{ width: '100%' }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" textAlign={'center'}>
          Rent
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="h6" textAlign={'left'}>
            Create new Rent
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleIsFormOpen}>
            {isFormOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ paddingTop: 1 }} />
      {isFormOpen && (
        <AdminRentForm
          servicesTypes={servicesTypes}
          rooms={rooms}
          handleSubmit={handleSubmit}
          isRentRequestLoading={isRentRequestLoading}
          isSuccess={isSuccess}
          message={message}
          setIsSuccess={setIsSuccess}
          setIsSnackBarOpen={setIsSnackBarOpen}
          onClickHandleSnackBar={onClickHandleSnackBar}
          selectedServiceType={orderSelectedServiceType}
          setSelectedServiceType={setOrderSelectedServiceType}
        />
      )}
      <Grid container spacing={2} paddingTop={2}>
        <Grid item>
          <Typography variant="h6" textAlign={'left'}>
            Rents Timesheet
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={handleIsGraphOpen}>
            {isGraphOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ paddingTop: 1 }} />
      {isGraphOpen && (
        <TimelineChart
          newOrder={newOrder}
          selectedServiceType={selectedServiceType}
          setSelectedServiceType={setSelectedServiceType}
          orderServiceType={orderSelectedServiceType}
          setIsSnackBarOpen={setIsSnackBarOpen}
          setMessage={setMessage}
          setSeverity={setSeverity}
        />
      )}
      <CustomSnackBar
        showSnackBar={isSnackBarOpen}
        message={message}
        severity={severity}
        onClick={onClickHandleSnackBar}
      />
    </Container>
  )
}

export default AdminDashboardOrders
