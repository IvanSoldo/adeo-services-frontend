import { useState, useEffect } from "react";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { loadCSS } from "fg-loadcss";
import ItemMenuDialog from "../components/ItemMenuDialog";
import axios from "axios";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import DeleteDialog from "../components/DeleteDialog";
import ServiceTypeDialog from "../components/ServiceTypeDialog";

import CustomSnackBar from "../components/CustomSnackBar";

const AdminDashboardMenu = () => {
  const [menuType, setMenuType] = useState([]);
  const [isEditMenuTypeDialogOpen, setIsEditMenuTypeDialogOpen] =
    useState(false);
  const [selectedMenuType, setSelectedMenuType] = useState({});
  const [isCreateMenuTypeDialogOpen, setIsCreateMenuTypeDialogOpen] =
    useState(false);

  const [isEditMenuItemDialogOpen, setIsEditMenuItemDialogOpen] =
    useState(false);
  const [menuItemSelectedService, setSelectedMenuItem] = useState({});
  const [isCreateMenuItemDialogOpen, setIsCreateMenuItemDialogOpen] =
    useState(false);
  const [menuTypeIndex, setMenuTypeIndex] = useState({});

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const [open, setOpen] = React.useState({});

  const [menuTypeIndexDelete, setMenuTypeIndexDelete] = React.useState({});

  const [event, setEvent] = React.useState({});
  const [isDeleteDialogOpenMenuType, setIsDeleteDialogOpenMenuType] =
    useState(false);

  const [menuItemIndexDelete, setMenuItemIndexDelete] = React.useState({});

  const [menuTypeIndexForDelete, setMenuTypeIndexForDelete] = React.useState(
    {}
  );

  const [isDeleteDialogOpenMenuItem, setIsDeleteDialogOpenMenuItem] =
    useState(false);

  React.useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.14.0/css/all.css",
      // Inject before JSS
      document.querySelector("#font-awesome-css") || document.head.firstChild
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);

  useEffect(() => {
    axios.get(`api/v1/menu/menu-item`).then((res) => {
      const menuType = [...res.data.menus];
      setMenuType(menuType);
    });
  }, []);

  const editMenuItem = (menuItem, menuTypeIndex) => {
    let copyMenuType = [...menuType];

    let indexOfEditingMenuType = copyMenuType[
      menuTypeIndex
    ].menuItems.findIndex((st) => st.id == menuItem.id);

    copyMenuType[menuTypeIndex].menuItems[
      indexOfEditingMenuType
    ].descriptionDe = menuItem.descriptionDe;
    copyMenuType[menuTypeIndex].menuItems[
      indexOfEditingMenuType
    ].descriptionEn = menuItem.descriptionEn;
    copyMenuType[menuTypeIndex].menuItems[
      indexOfEditingMenuType
    ].descriptionHr = menuItem.descriptionHr;
    copyMenuType[menuTypeIndex].menuItems[
      indexOfEditingMenuType
    ].descriptionIt = menuItem.descriptionIt;
    copyMenuType[menuTypeIndex].menuItems[indexOfEditingMenuType].nameDe =
      menuItem.nameDe;
    copyMenuType[menuTypeIndex].menuItems[indexOfEditingMenuType].nameEn =
      menuItem.nameEn;
    copyMenuType[menuTypeIndex].menuItems[indexOfEditingMenuType].nameHr =
      menuItem.nameHr;
    copyMenuType[menuTypeIndex].menuItems[indexOfEditingMenuType].nameIt =
      menuItem.nameIt;
    copyMenuType[menuTypeIndex].menuItems[indexOfEditingMenuType].normative =
      menuItem.normative;
    copyMenuType[menuTypeIndex].menuItems[indexOfEditingMenuType].price =
      menuItem.price;

    axios
      .patch(`api/v1/menu-item/${menuItem.id}`, {
        nameHr: menuItem.nameHr,
        nameDe: menuItem.nameDe,
        nameIt: menuItem.nameIt,
        nameEn: menuItem.nameEn,
        descriptionDe: menuItem.descriptionDe,
        descriptionEn: menuItem.descriptionEn,
        descriptionHr: menuItem.descriptionHr,
        descriptionIt: menuItem.descriptionIt,
        normative: menuItem.normative,
        price: menuItem.price,
      })
      .then((res) => {
        setIsSnackbarOpen(true);
        setSnackbarText(menuItem.nameEn + " succesfully edited");
        setMenuType(copyMenuType);
      });
  };

  const deleteMenuItem = (menuTypeIndex, menuItemIndex) => {
    let menuItemState = [...menuType];

    let menuItem = menuItemState[menuTypeIndex].menuItems[menuItemIndex];

    menuItemState[menuTypeIndex].menuItems.splice(menuItemIndex, 1);

    axios.delete(`api/v1/menu-item/${menuItem.id}`).then((res) => {
      setMenuType(menuItemState);
      setIsSnackbarOpen(true);
      setSnackbarText("Service succesfully deleted");
    });
  };

  const createMenuItem = (menuItemObject, menuTypeIndex) => {
    var menuTypeCopy = [...menuType];
    var menuTypeId = menuTypeCopy[menuTypeIndex].id;
    axios
      .post(`api/v1/menu/${menuTypeId}/menu-item`, {
        nameHr: menuItemObject.nameHr,
        nameDe: menuItemObject.nameDe,
        nameIt: menuItemObject.nameIt,
        nameEn: menuItemObject.nameEn,
        descriptionDe: menuItemObject.descriptionDe,
        descriptionEn: menuItemObject.descriptionEn,
        descriptionHr: menuItemObject.descriptionHr,
        descriptionIt: menuItemObject.descriptionIt,
        normative: menuItemObject.normative,
        price: menuItemObject.price,
      })
      .then((res) => {
        menuItemObject.id = res.data.id;

        menuTypeCopy[menuTypeIndex].menuItems.push(menuItemObject);
        setMenuType(menuTypeCopy);
        setIsSnackbarOpen(true);
        setSnackbarText("Service succesfully created");
      });
  };

  const editMenuType = (menuTypeObject) => {
    let copyMenuType = [...menuType];

    let indexOfEditingMenuType = copyMenuType.findIndex(
      (st) => st.id == menuTypeObject.id
    );
    copyMenuType[indexOfEditingMenuType].nameEn = menuTypeObject.nameEn;
    copyMenuType[indexOfEditingMenuType].nameHr = menuTypeObject.nameHr;
    copyMenuType[indexOfEditingMenuType].nameDe = menuTypeObject.nameDe;
    copyMenuType[indexOfEditingMenuType].nameIt = menuTypeObject.nameIt;

    axios
      .patch(`api/v1/menu/${menuTypeObject.id}`, {
        nameHr: menuTypeObject.nameHr,
        nameDe: menuTypeObject.nameDe,
        nameIt: menuTypeObject.nameIt,
        nameEn: menuTypeObject.nameEn,
      })
      .then((res) => {
        setMenuType(copyMenuType);
        setIsSnackbarOpen(true);
        setSnackbarText(menuTypeObject.nameEn + " succesfully edited");
      });
  };

  const deleteMenuType = (menuTypeIndex, e) => {
    e.stopPropagation();
    let menuState = [...menuType];

    let menuTypeObject = menuState[menuTypeIndex];

    menuState.splice(menuTypeIndex, 1);

    axios.delete(`api/v1/menu/${menuTypeObject.id}`).then((res) => {
      setMenuType(menuState);
      setIsSnackbarOpen(true);
      setSnackbarText("Service Type succesfully deleted");
    });
  };

  const createMenuType = (menuTypeObject) => {
    axios
      .post(`api/v1/menu`, {
        nameHr: menuTypeObject.nameHr,
        nameDe: menuTypeObject.nameDe,
        nameIt: menuTypeObject.nameIt,
        nameEn: menuTypeObject.nameEn,
      })
      .then((res) => {
        menuTypeObject.menuItems = [];
        menuTypeObject.id = res.data.id;
        setMenuType([...menuType, menuTypeObject]);
        setIsSnackbarOpen(true);
        setSnackbarText(menuTypeObject.nameEn + " succesfully created");
      });
  };

  const handleMenuTypeEditDialogOpen = (menuType, e) => {
    e.stopPropagation();
    setSelectedMenuType(menuType);
    setIsEditMenuTypeDialogOpen(true);
  };

  const handleEditMenuTypeDialogClose = () => {
    setIsEditMenuTypeDialogOpen(false);
  };

  const handleCreateMenuTypeDialogOpen = () => {
    setIsCreateMenuTypeDialogOpen(true);
  };

  const handleCreateMenuTypeDialogClose = () => {
    setIsCreateMenuTypeDialogOpen(false);
  };

  const handleMenuItemEditDialogOpen = (menuItem, e, menuTypeIndexFromRow) => {
    e.stopPropagation();
    setSelectedMenuItem(menuItem);
    setIsEditMenuItemDialogOpen(true);
    setMenuTypeIndex(menuTypeIndexFromRow);
  };

  const handleEditMenuItemDialogClose = () => {
    setIsEditMenuItemDialogOpen(false);
  };

  const handleCreateMenuItemDialogOpen = (menuTypeIndexFromRow) => {
    setIsCreateMenuItemDialogOpen(true);
    setMenuTypeIndex(menuTypeIndexFromRow);
  };

  const handleCreateMenuItemDialogClose = () => {
    setIsCreateMenuItemDialogOpen(false);
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const handleDeleteDialogCloseMenuType = () => {
    setIsDeleteDialogOpenMenuType(false);
  };

  const handleDeleteDialogOpenMenuType = (menuTypeIndex, event) => {
    setMenuTypeIndexDelete(menuTypeIndex);

    setEvent(event);
    setIsDeleteDialogOpenMenuType(true);
  };

  const handleDeleteDialogCloseAndDeleteMenuType = () => {
    deleteMenuType(menuTypeIndexDelete, event);
    setIsDeleteDialogOpenMenuType(false);
  };

  const handleDeleteDialogCloseMenuItem = () => {
    setIsDeleteDialogOpenMenuItem(false);
  };

  const handleDeleteDialogOpenMenuItem = (menuTypeIndex, menuItemIndex) => {
    setMenuTypeIndexForDelete(menuTypeIndex);
    setMenuItemIndexDelete(menuItemIndex);
    setIsDeleteDialogOpenMenuItem(true);
  };

  const handleDeleteDialogCloseAndDeleteMenuItem = () => {
    deleteMenuItem(menuTypeIndexForDelete, menuItemIndexDelete);
    setIsDeleteDialogOpenMenuItem(false);
  };

  function Row(props) {
    const { row, menuTypeIndex } = props;
    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
              }
            >
              {open[row.id] ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="center">
            {row.id}
          </TableCell>
          <TableCell align="center">{row.nameEn}</TableCell>
          <TableCell align="center">
            <IconButton
              color="primary"
              onClick={(event) => handleMenuTypeEditDialogOpen(row, event)}
            >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={(event) =>
                handleDeleteDialogOpenMenuType(menuTypeIndex, event)
              }
            >
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open[row.id]} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Button
                  color="primary"
                  size="small"
                  onClick={() => handleCreateMenuItemDialogOpen(menuTypeIndex)}
                >
                  Create New
                </Button>
                <Table aria-label="roomServices">
                  <TableHead>
                    <TableRow>
                      <TableCell>Id</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Normative</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.menuItems.map((menuItem, menuItemIndex) => (
                      <TableRow key={menuItem.id}>
                        <TableCell component="th" scope="row">
                          {menuItem.id}
                        </TableCell>
                        <TableCell align="center">{menuItem.nameEn}</TableCell>
                        <TableCell align="center">
                          {menuItem.normative}
                        </TableCell>
                        <TableCell align="center">{menuItem.price}kn</TableCell>

                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={(event) =>
                              handleMenuItemEditDialogOpen(
                                menuItem,
                                event,
                                menuTypeIndex
                              )
                            }
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleDeleteDialogOpenMenuItem(
                                menuTypeIndex,
                                menuItemIndex
                              )
                            }
                          >
                            <DeleteForeverOutlinedIcon />
                          </IconButton>
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
  }

  return (
    <div>
      <Box sx={{ mb: 2, mt: 2 }}>
        <Button
          color="primary"
          onClick={() => handleCreateMenuTypeDialogOpen()}
        >
          Create New
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="center">Menu Type Id</TableCell>
              <TableCell align="center">Menu Type Name</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuType.map((type, menuTypeIndex) => (
              <Row key={type.id} row={type} menuTypeIndex={menuTypeIndex} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ServiceTypeDialog
        isDialogOpen={isEditMenuTypeDialogOpen}
        handleDialogClose={handleEditMenuTypeDialogClose}
        serviceType={selectedMenuType}
        serviceTypeValueFromDialog={editMenuType}
        dialogTitle={`Edit: ${selectedMenuType.nameEn}`}
        dialogLabel={"Menu"}
      />
      <ServiceTypeDialog
        isDialogOpen={isCreateMenuTypeDialogOpen}
        handleDialogClose={handleCreateMenuTypeDialogClose}
        serviceTypeValueFromDialog={createMenuType}
        serviceType={{}}
        dialogTitle={"Create new Menu Type:"}
        dialogLabel={"Menu"}
      />
      <ItemMenuDialog
        isDialogOpen={isEditMenuItemDialogOpen}
        handleDialogClose={handleEditMenuItemDialogClose}
        itemMenu={menuItemSelectedService}
        itemMenuValueFromDialog={editMenuItem}
        dialogTitle={`Edit: ${menuItemSelectedService.nameEn}`}
        itemMenuTypeIndex={menuTypeIndex}
      />
      <ItemMenuDialog
        isDialogOpen={isCreateMenuItemDialogOpen}
        handleDialogClose={handleCreateMenuItemDialogClose}
        itemMenuValueFromDialog={createMenuItem}
        itemMenu={{}}
        dialogTitle={"Create new Menu Item :"}
        itemMenuTypeIndex={menuTypeIndex}
      />
      <CustomSnackBar
        showSnackBar={isSnackbarOpen}
        message={snackbarText}
        severity={"info"}
        onClick={handleSnackbarClose}
      />
      <DeleteDialog
        isDialogOpen={isDeleteDialogOpenMenuType}
        deleteMethod={handleDeleteDialogCloseAndDeleteMenuType}
        closeDialog={handleDeleteDialogCloseMenuType}
      />
      <DeleteDialog
        isDialogOpen={isDeleteDialogOpenMenuItem}
        deleteMethod={handleDeleteDialogCloseAndDeleteMenuItem}
        closeDialog={handleDeleteDialogCloseMenuItem}
      />
    </div>
  );
};

export default AdminDashboardMenu;
