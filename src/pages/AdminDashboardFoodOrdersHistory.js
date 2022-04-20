import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useState, useEffect } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined'
import { Button, Grid } from '@mui/material'
import ButtonGroup from '@mui/material/ButtonGroup'
import DeleteDialog from '../components/DeleteDialog'
import Switch from '@mui/material/Switch'
import { FormControlLabel } from '@mui/material'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CustomSnackBar from '../components/CustomSnackBar'
import { useDispatch } from 'react-redux'
import {
  decrementCount,
  incrementCount,
} from '../redux/unprocessedOrdersHandler'

export default function CollapsibleTable() {
  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [orderStatus, setOrderStatus] = useState('ALL')
  const pageSize = 10
  const [selectedBtn, setSelectedBtn] = React.useState(1)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [menuOrder, setMenuOrder] = React.useState({})
  const [menuiIndex, setMenuIndex] = useState(0)
  const [loadNewOrders, setLoadNewOrders] = useState(false)
  const [openMenu, setOpenMenu] = useState({})
  const dispatch = useDispatch()

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false)
  }

  const handleDeleteDialogOpen = (menuOrder, menuIndex) => {
    setMenuOrder(menuOrder)
    setMenuIndex(menuIndex)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDialogCloseAndDeleteOrder = () => {
    deleteMenuOrder(menuOrder, menuiIndex)
    setIsDeleteDialogOpen(false)
  }

  const handleChange = (event, value) => {
    setPage(value)

    axios
      .get(
        `api/v1/menu-order?size=${pageSize}&page=${
          value - 1
        }&menuOrderStatus=${orderStatus}`,
      )
      .then((res) => {
        const orderHistory = [...res.data.menuOrders]
        setRows(orderHistory)
      })
    setOpenMenu(null)
  }

  const calculateOrderStatus = (isProcessed) => {
    if (isProcessed) {
      return <DoneOutlinedIcon />
    } else {
      return <ReportOutlinedIcon />
    }
  }

  const deleteMenuOrder = (menuOrders, menuIndex) => {
    let menuOrdersCopy = [...rows]
    menuOrdersCopy.splice(menuIndex, 1)

    axios.delete(`api/v1/menu-order/${menuOrders.id}`).then((res) => {
      setRows(menuOrdersCopy)
    })
  }

  const getProcessedOrders = () => {
    setSelectedBtn(2)

    setPage(1)
    axios
      .get(
        `api/v1/menu-order?size=${pageSize}&page=${0}&menuOrderStatus=PROCESSED`,
      )
      .then((res) => {
        const orderHistory = [...res.data.menuOrders]
        setRows(orderHistory)
        setTotalPages(res.data.totalPages)
      })

    setOrderStatus('PROCESSED')
  }

  const getUnprocessedOrders = () => {
    setSelectedBtn(4)
    setPage(1)
    axios
      .get(
        `api/v1/menu-order?size=${pageSize}&page=${0}&menuOrderStatus=UNPROCESSED`,
      )
      .then((res) => {
        const orderHistory = [...res.data.menuOrders]
        setRows(orderHistory)
        setTotalPages(res.data.totalPages)
      })
    setOrderStatus('UNPROCESSED')
  }

  const getAllOrders = () => {
    setSelectedBtn(1)
    setPage(1)
    axios
      .get(`api/v1/menu-order?size=${pageSize}&page=${0}&menuOrderStatus=ALL`)
      .then((res) => {
        const orderHistory = [...res.data.menuOrders]
        setRows(orderHistory)
        setTotalPages(res.data.totalPages)
      })
    setOrderStatus('ALL')
  }

  useEffect(() => {
    axios
      .get(`api/v1/menu-order?size=${pageSize}&page=0&menuOrderStatus=ALL`)
      .then((res) => {
        const orderHistory = [...res.data.menuOrders]
        setRows(orderHistory)
        setTotalPages(res.data.totalPages)
      })
  }, [])

  setTimeout(function () {
    setLoadNewOrders(!loadNewOrders)
  }, 200000)

  useEffect(() => {
    axios
      .get(
        `api/v1/menu-order?size=${pageSize}&page=${
          page - 1
        }&menuOrderStatus=${orderStatus}`,
      )
      .then((res) => {
        const orderHistory = [...res.data.menuOrders]
        setRows(orderHistory)
        setTotalPages(res.data.totalPages)
      })
  }, [loadNewOrders])

  const enableOrDisableMenuOrder = (
    menuOrderId,
    menuOrderState,
    menuOrderIndex,
  ) => {
    axios
      .patch(`/api/v1/menu-order/${menuOrderId}/process`, {})
      .then((res) => {})
    let menuOrders = [...rows]
    menuOrders[menuOrderIndex].processed = menuOrderState

    if (orderStatus == 'PROCESSED' || orderStatus == 'UNPROCESSED') {
      menuOrders.splice(menuOrderIndex, 1)

      setRows(menuOrders)
    } else setRows(menuOrders)

    if (!menuOrderState) {
      dispatch(incrementCount())
    } else {
      dispatch(decrementCount())
    }
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const BasicCard = React.forwardRef((props, ref) => {
    const menuOrder = props.menuOrder
    return (
      <div ref={ref}>
        <Card>
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 'bold' }}
              paddingBottom={1}
            >
              Room Number: {menuOrder.roomNumber}
            </Typography>
            <Box sx={{ borderBottom: 1, marginBottom: 2 }}></Box>
            {menuOrder.menuItems.map((menuItems, rowIndex) => (
              <Grid key={rowIndex} container direction="row">
                <Grid item xs={6}>
                  <Typography
                    sx={{ mb: 1.5, wordWrap: 'break-word' }}
                    color="text.secondary"
                  >
                    {menuItems.name}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    style={{ fontWeight: 'bold' }}
                  >
                    {'x' + menuItems.amount}
                  </Typography>
                </Grid>
                <Grid item xs={5} display="flex" justifyContent="flex-end">
                  <Typography
                    sx={{ mb: 1.5 }}
                    color="text.secondary"
                    style={{ fontWeight: 'bold' }}
                  >
                    {menuItems.totalPrice.toFixed(2) + ' kn'}
                  </Typography>
                </Grid>
              </Grid>
            ))}

            <Box sx={{ borderBottom: 1 }}></Box>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Grid>
                <Typography sx={{ mb: 1.5, mt: 1.5 }} color="text.secondary">
                  Total price:
                </Typography>
              </Grid>

              <Grid>
                <Typography
                  sx={{ mb: 1.5, mt: 1.5 }}
                  color="text.secondary"
                  style={{ fontWeight: 'bold' }}
                >
                  {menuOrder.totalPrice.toFixed(2) + ' kn'}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Grid>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Payment Method:
                </Typography>
              </Grid>

              <Grid>
                <Typography
                  sx={{ mb: 1.5 }}
                  color="text.secondary"
                  style={{ fontWeight: 'bold' }}
                >
                  {menuOrder.paymentOption}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button variant="contained" onClick={handlePrint}>
              Print
            </Button>
          </CardActions>
        </Card>
      </div>
    )
  })

  const openRow = (menuOrders, rowState) => {
    if (rowState) {
      setOpenMenu(menuOrders.id)
    } else if (openMenu === menuOrders.id) {
      setOpenMenu(null)
    }
  }
  const Row = ({ menuOrders, deleteMenuOrder, menuIndex }) => {
    let isRowOpen = false
    if (menuOrders.id === openMenu) {
      isRowOpen = true
    }
    const [open, setOpen] = React.useState(isRowOpen)

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open)
                openRow(menuOrders, !open)
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="center">
            {calculateOrderStatus(menuOrders.processed)} {menuOrders.id}
          </TableCell>
          <TableCell align="center">#{menuOrders.roomNumber}</TableCell>
          <TableCell align="center">
            <FormControlLabel
              control={
                <Switch
                  checked={menuOrders.processed}
                  name="checkedC"
                  onClick={(e) =>
                    enableOrDisableMenuOrder(
                      menuOrders.id,
                      e.target.checked,
                      menuIndex,
                    )
                  }
                />
              }
              label=""
            />
          </TableCell>
          <TableCell align="center">
            {menuOrders.createdAt.replace('T', ' ')}
          </TableCell>
          <TableCell align="right">
            {' '}
            <IconButton
              color="error"
              onClick={() => deleteMenuOrder(menuOrders, menuIndex)}
            >
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <BasicCard ref={componentRef} menuOrder={menuOrders}></BasicCard>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  }

  return (
    <div>
      <ButtonGroup disableElevation color="primary" sx={{ mb: 2 }}>
        <Button
          variant={selectedBtn === 1 ? 'contained' : 'text'}
          onClick={() => getAllOrders()}
        >
          All
        </Button>
        <Button
          variant={selectedBtn === 2 ? 'contained' : 'text'}
          onClick={() => getProcessedOrders()}
        >
          Processed orders
        </Button>
        <Button
          variant={selectedBtn === 4 ? 'contained' : 'text'}
          onClick={() => getUnprocessedOrders()}
        >
          Unprocessed orders
        </Button>
      </ButtonGroup>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Food Order id</TableCell>
              <TableCell align="center">Room Number</TableCell>
              <TableCell align="center">Is Processed</TableCell>
              <TableCell align="center">Order created</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <Row
                key={row.name}
                menuOrders={row}
                menuIndex={rowIndex}
                deleteMenuOrder={handleDeleteDialogOpen}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box pt={1}>
        <Stack spacing={2}>
          <Pagination count={totalPages} page={page} onChange={handleChange} />
        </Stack>
      </Box>
      <DeleteDialog
        isDialogOpen={isDeleteDialogOpen}
        deleteMethod={handleDeleteDialogCloseAndDeleteOrder}
        closeDialog={handleDeleteDialogClose}
      />
    </div>
  )
}
