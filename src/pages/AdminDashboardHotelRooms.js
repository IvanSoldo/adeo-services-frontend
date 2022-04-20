import { useState, useEffect } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import HotelRoomDialog from "../components/HotelRoomDialog";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteDialog from "../components/DeleteDialog";

import CustomSnackBar from "../components/CustomSnackBar";

const useStyles = makeStyles(() => ({
  box: {
    height: 10,
    display: "flex",
    padding: 8,
  },
  bottomRightBox: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
}));

const AdminDashboardHotelRooms = () => {
  const [hotelRooms, setHotelRooms] = useState([]);
  const [selectedHotelRoom, setSelectedHotelRoom] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateRoomDialogOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteDialogHotelRooms, setDeleteDialogHotelRooms] = useState([]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    axios.get(`api/v1/rooms`).then((res) => {
      const hotelRooms = [...res.data.rooms];
      setHotelRooms(hotelRooms);
    });
  }, []);

  const handleEditDialogOpen = (hotelRoom) => {
    setSelectedHotelRoom(hotelRoom);
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleCreateDialogOpen = () => {
    setIsCreateRoomDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setIsCreateRoomDialogOpen(false);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteDialogOpen = (hotelRoom) => {
    setDeleteDialogHotelRooms(hotelRoom);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogCloseAndDeleteRoom = () => {
    deleteHotelRoom(deleteDialogHotelRooms);
    setIsDeleteDialogOpen(false);
  };
  const handleDownloadQrCodes = () => {
    axios
      .get(`api/v1/qrcode`, {
        responseType: "blob",
      })
      .then((res) => {
        setIsSnackbarOpen(true);
        setSnackbarText("Downloading QrCodes");
        var fileDownload = require("js-file-download");
        fileDownload(res.data, "qrcodes.zip");
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarText("Error while downloading QrCodes");
      });
  };

  const editHotelRoom = (hotelRoom) => {
    axios
      .patch(`api/v1/rooms/${hotelRoom.id}`, {
        name: hotelRoom.name,
        number: hotelRoom.number,
      })
      .then((res) => {
        let hotelRoomsCopy = [...hotelRooms];
        let indexOfEditingHotelRoom = hotelRoomsCopy.findIndex(
          (hr) => hr.id == hotelRoom.id
        );
        hotelRoomsCopy[indexOfEditingHotelRoom].name = hotelRoom.name;
        hotelRoomsCopy[indexOfEditingHotelRoom].number = hotelRoom.number;
        setHotelRooms(hotelRoomsCopy);
        setIsSnackbarOpen(true);
        setSnackbarText("Hotel Room succesfully edited");
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarText("Error while editing hotel room");
      });
  };

  const deleteHotelRoom = (index) => {
    axios
      .delete(`api/v1/rooms/${hotelRooms[index].id}`)
      .then((res) => {
        let hotelRoomsCopy = [...hotelRooms];
        hotelRoomsCopy.splice(index, 1);
        setHotelRooms(hotelRoomsCopy);
        setIsSnackbarOpen(true);
        setSnackbarText("Hotel Room succesfully deleted");
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarText("Error while deleting hotel room");
      });
  };

  const createHotelRoom = (hotelRoom) => {
    axios
      .post(`api/v1/rooms/`, {
        name: hotelRoom.name,
        number: hotelRoom.number,
      })
      .then((res) => {
        setIsSnackbarOpen(true);
        setSnackbarText("Hotel Room succesfully created");
        hotelRoom.id = res.data.id;
        setHotelRooms([...hotelRooms, hotelRoom]);
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarText("Error while creating hotel room");
      });
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const classes = useStyles();

  return (
    <>
      <Box sx={{ mb: 2, mt: 2 }}>
        <Button
          id="fade-button"
          aria-controls={open ? "fade-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Options
        </Button>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              handleCreateDialogOpen();
            }}
          >
            Create New Hotel Room
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              handleDownloadQrCodes();
            }}
          >
            Download QrCodes
          </MenuItem>
        </Menu>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="center">Room Name</TableCell>
              <TableCell align="center">Room Number</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotelRooms.map((hotelRoom, index) => (
              <TableRow
                key={hotelRoom.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {hotelRoom.id}
                </TableCell>
                <TableCell align="center">{hotelRoom.name}</TableCell>
                <TableCell align="center">{hotelRoom.number}</TableCell>
                <TableCell align="center">
                  {" "}
                  <IconButton
                    color="primary"
                    onClick={() => handleEditDialogOpen(hotelRoom)}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteDialogOpen(index)}
                  >
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <HotelRoomDialog
        isDialogOpen={isEditDialogOpen}
        handleDialogClose={handleEditDialogClose}
        hotelRoom={selectedHotelRoom}
        hotelRoomValueFromDialog={editHotelRoom}
        dialogTitle={`Edit: ${selectedHotelRoom.name} #${selectedHotelRoom.number}`}
      />
      <HotelRoomDialog
        isDialogOpen={isCreateDialogOpen}
        handleDialogClose={handleCreateDialogClose}
        hotelRoomValueFromDialog={createHotelRoom}
        hotelRoom={{}}
        dialogTitle={"Create new Hotel Room:"}
      />
      <CustomSnackBar
        showSnackBar={isSnackbarOpen}
        message={snackbarText}
        severity="info"
        onClick={handleSnackbarClose}
      />
      <DeleteDialog
        isDialogOpen={isDeleteDialogOpen}
        deleteMethod={handleDeleteDialogCloseAndDeleteRoom}
        closeDialog={handleDeleteDialogClose}
      />
    </>
  );
};

export default AdminDashboardHotelRooms;
