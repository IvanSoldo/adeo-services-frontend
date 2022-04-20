import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { emptyCart } from "../redux/cartHandler";
import * as apiCalls from "../api/apiCalls";
import CustomSnackBar from "../components/CustomSnackBar";
import UserCheckoutForm from "../components/UserCheckoutForm";
import { isWithinInterval } from "date-fns";

const UserCheckoutPage = () => {
  const { roomId } = useSelector((state) => state.roomHandler);
  const cart = useSelector((state) => state.cartHandler);
  const navigate = useNavigate();
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isIpAddressValid, setIsIpAddressValid] = useState(false);
  const dispatch = useDispatch();

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

  const getIsIpAddressValid = () => {
    apiCalls
      .getIsIpAddressValid()
      .then((response) => {
        setIsIpAddressValid(true);
      })
      .catch((error) => {
        setIsIpAddressValid(false);
      });
  };

  useEffect(() => {
    getIsIpAddressValid();
  }, []);

  useEffect(() => {
    let canPlaceOrder =
      isWithinInterval(now, {
        start: firstIntervalStartAt,
        end: firstIntervalEndAt,
      }) ||
      isWithinInterval(now, {
        start: secondIntervalStartAt,
        end: secondIntervalEndAt,
      });

    if (cart.totalQuantity === 0 || !canPlaceOrder) {
      navigate("/roomService");
    }
  }, []);

  const handleBackToMenu = () => {
    dispatch(emptyCart());
    navigate("/menu/" + roomId);
  };

  const createMenuOrder = (roomId, menuOrder) => {
    apiCalls
      .createMenuOrder(roomId, menuOrder)
      .then((response) => {
        setIsSuccess(true);
      })
      .catch((error) => {
        setIsSnackBarOpen(true);
        setMessage(t("snackBarGenericErrorMessage"));
        setSeverity("error");
      });
  };

  const onClickHandleSnackBar = () => {
    setIsSnackBarOpen(false);
  };

  return (
    <Box>
      <UserCheckoutForm
        roomId={roomId}
        cart={cart}
        createMenuOrder={createMenuOrder}
        isSuccess={isSuccess}
        handleBackToMenu={handleBackToMenu}
        isIpAddressValid={isIpAddressValid}
      />
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

export default UserCheckoutPage;
