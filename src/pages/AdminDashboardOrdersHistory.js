import * as React from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState, useEffect } from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import { Button } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import DeleteDialog from "../components/DeleteDialog";

export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("ALL");
  const pageSize = 10;
  const [selectedBtn, setSelectedBtn] = React.useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceOrder, setServiceOrder] = React.useState({});
  const [serviceIndex, setServiceIndex] = useState(0);
  const [loadNewOrders, setLoadNewOrders] = useState(false);
  const [openOrder, setOpenOrder] = useState({});

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteDialogOpen = (serviceOrder, serviceIndex) => {
    setServiceOrder(serviceOrder);
    setServiceIndex(serviceIndex);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogCloseAndDeleteOrder = () => {
    deleteService(serviceOrder, serviceIndex);
    setIsDeleteDialogOpen(false);
  };

  const handleChange = (event, value) => {
    setPage(value);
    axios
      .get(
        `api/v1/orders?size=${pageSize}&page=${
          value - 1
        }&orderStatus=${orderStatus}`
      )
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
      });
    setOpenOrder(null);
  };

  function getDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    if (day.toString().length == 1) {
      day = "0" + day;
    }
    if (hour.toString().length == 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length == 1) {
      minute = "0" + minute;
    }

    var dateTime = year + "-" + month + "-" + day + "T" + hour + ":" + minute;
    return dateTime;
  }

  const calculateOrderStatus = (startAt, endAt) => {
    var currentDateTime = getDateTime();

    if (currentDateTime >= startAt && currentDateTime >= endAt) {
      return <DoneOutlinedIcon />;
    } else if (currentDateTime >= startAt && currentDateTime < endAt) {
      return <AutorenewOutlinedIcon />;
    } else if (currentDateTime < startAt && currentDateTime < endAt) {
      return <ReportOutlinedIcon />;
    }
  };

  const deleteService = (serviceOrders, serviceIndex) => {
    let serviceOrdersCopy = [...rows];
    serviceOrdersCopy.splice(serviceIndex, 1);

    axios.delete(`api/v1/orders/${serviceOrders.id}`).then((res) => {
      setRows(serviceOrdersCopy);
    });
  };

  const getCompletedOrders = () => {
    setSelectedBtn(2);

    setPage(1);
    axios
      .get(`api/v1/orders?size=${pageSize}&page=${0}&orderStatus=COMPLETED`)
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
        setTotalPages(res.data.totalPages);
      });

    setOrderStatus("COMPLETED");
    setOpenOrder(null);
  };

  const getOccurringOrders = () => {
    setSelectedBtn(3);

    setPage(1);
    axios
      .get(`api/v1/orders?size=${pageSize}&page=${0}&orderStatus=OCCURRING`)
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
        setTotalPages(res.data.totalPages);
      });
    setOrderStatus("OCCURRING");
    setOpenOrder(null);
  };

  const getPendingOrders = () => {
    setSelectedBtn(4);
    setPage(1);
    axios
      .get(`api/v1/orders?size=${pageSize}&page=${0}&orderStatus=PENDING`)
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
        setTotalPages(res.data.totalPages);
      });
    setOrderStatus("PENDING");
    setOpenOrder(null);
  };

  const getAllOrders = () => {
    setSelectedBtn(1);
    setPage(1);
    axios
      .get(`api/v1/orders?size=${pageSize}&page=${0}&orderStatus=ALL`)
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
        setTotalPages(res.data.totalPages);
      });
    setOrderStatus("ALL");
    setOpenOrder(null);
  };

  useEffect(() => {
    axios
      .get(`api/v1/orders?size=${pageSize}&page=0&orderStatus=${orderStatus}`)
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
        setTotalPages(res.data.totalPages);
      });
  }, []);

  setTimeout(function () {
    setLoadNewOrders(!loadNewOrders);
  }, 2000);

  useEffect(() => {
    axios
      .get(
        `api/v1/orders?size=${pageSize}&page=${
          page - 1
        }&orderStatus=${orderStatus}`
      )
      .then((res) => {
        const orderHistory = [...res.data.orders];
        setRows(orderHistory);
        setTotalPages(res.data.totalPages);
      });
  }, [loadNewOrders]);

  const openRow = (rentOrder, rowState) => {
    if (rowState) {
      setOpenOrder(rentOrder.id);
    } else if (openOrder === rentOrder.id) {
      setOpenOrder(null);
    }
  };

  const Row = ({ serviceOrders, deleteService, serviceIndex }) => {
    let isRowOpen = false;
    if (serviceOrders.id === openOrder) {
      isRowOpen = true;
    }
    const [open, setOpen] = React.useState(isRowOpen);
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
                openRow(serviceOrders, !open);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="center">
            {calculateOrderStatus(serviceOrders.startAt, serviceOrders.endAt)}{" "}
            {serviceOrders.id}
          </TableCell>
          <TableCell align="center">#{serviceOrders.roomNumber}</TableCell>
          <TableCell align="center">{serviceOrders.serviceType}</TableCell>
          <TableCell align="center">
            {serviceOrders.createdAt.replace("T", " ")}
          </TableCell>
          <TableCell align="center">
            {serviceOrders.startAt.replace("T", " ")}
          </TableCell>
          <TableCell align="center">
            {serviceOrders.endAt.replace("T", " ")}
          </TableCell>
          <TableCell align="right">
            {" "}
            <IconButton
              color="error"
              onClick={() => deleteService(serviceOrders, serviceIndex)}
            >
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Services
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead></TableHead>
                  <TableBody>
                    {serviceOrders.services.map((services) => (
                      <TableRow key={services}>
                        <TableCell component="th" scope="row">
                          {services}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <div>
      <ButtonGroup disableElevation color="primary" sx={{ mb: 2 }}>
        <Button
          variant={selectedBtn === 1 ? "contained" : "text"}
          onClick={() => getAllOrders()}
        >
          All
        </Button>
        <Button
          variant={selectedBtn === 2 ? "contained" : "text"}
          onClick={() => getCompletedOrders()}
        >
          Completed
        </Button>
        <Button
          variant={selectedBtn === 3 ? "contained" : "text"}
          onClick={() => getOccurringOrders()}
        >
          Occurring
        </Button>
        <Button
          variant={selectedBtn === 4 ? "contained" : "text"}
          onClick={() => getPendingOrders()}
        >
          Pending
        </Button>
      </ButtonGroup>

      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="center">Rent id</TableCell>
              <TableCell align="center">Room Number</TableCell>
              <TableCell align="center">Service Type</TableCell>
              <TableCell align="center">Rent created</TableCell>
              <TableCell align="center">From</TableCell>
              <TableCell align="center">To</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <Row
                key={row.name}
                serviceOrders={row}
                serviceIndex={rowIndex}
                deleteService={handleDeleteDialogOpen}
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
  );
}
