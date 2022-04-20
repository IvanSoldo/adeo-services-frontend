import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import isWithinInterval from "date-fns/isWithinInterval";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as apiCalls from "../api/apiCalls";
import CustomSnackBar from "../components/CustomSnackBar";
import UserRoomServiceForm from "../components/UserRoomServiceForm";

const UserRoomServicePage = () => {
  const [menu, setMenu] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const { t } = useTranslation();
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  const { roomId } = useSelector((state) => state.roomHandler);
  const navigate = useNavigate();

  const now = new Date();
  now.setSeconds(0, 0);
  const firstIntervalStartAt = new Date();
  firstIntervalStartAt.setHours(12, 0, 0, 0);
  const firstIntervalEndAt = new Date();
  firstIntervalEndAt.setHours(17, 45, 0, 0);
  const secondIntervalStartAt = new Date();
  secondIntervalStartAt.setHours(21, 0, 0, 0);
  const secondIntervalEndAt = new Date();
  secondIntervalEndAt.setHours(22, 45, 0, 0);

  useEffect(() => {
    let isWithinFirstInterval = isWithinInterval(now, {
      start: firstIntervalStartAt,
      end: firstIntervalEndAt,
    });

    let isWithinSecondInterval = isWithinInterval(now, {
      start: secondIntervalStartAt,
      end: secondIntervalEndAt,
    });

    if (!isWithinFirstInterval && !isWithinSecondInterval) {
      setShouldDisplayForm(false);
    } else {
      setShouldDisplayForm(true);
    }
  }, []);

  const handleBackToMenu = () => {
    navigate("/menu/" + roomId);
  };

  const onClickHandleSnackBar = () => {
    setIsSnackBarOpen(false);
  };

  const getMenu = () => {
    apiCalls
      .getAllMenus()
      .then((response) => {
        setMenu(response.data.menus);
      })
      .catch((e) => {
        setIsSnackBarOpen(true);
        setMessage(t("snackBarGenericErrorMessage"));
        setSeverity("error");
      });
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <Box>
      {shouldDisplayForm && <UserRoomServiceForm menu={menu} />}
      <Dialog open={!shouldDisplayForm} onClose={handleBackToMenu}>
        <DialogContent>
          <DialogContentText>
            {t("roomServiceNotAvailableMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <Button onClick={handleBackToMenu} autoFocus>
              {t("rentBackToMenuButton")}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <CustomSnackBar
        showSnackBar={isSnackBarOpen}
        message={message}
        severity={severity}
        onClick={onClickHandleSnackBar}
        center={true}
      />
    </Box>
  );
};

export default UserRoomServicePage;
