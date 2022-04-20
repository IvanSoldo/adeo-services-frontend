import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import UserRentForm from "../components/UserRentForm";
import * as apiCalls from "../api/apiCalls";
import CustomSnackBar from "../components/CustomSnackBar";

import { useTranslation } from "react-i18next";

const UserRentPage = () => {
  const { roomId } = useSelector((state) => state.roomHandler);
  const [servicesTypes, setServicesTypes] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [message, setMessage] = useState(undefined);
  const [severity, setSeverity] = useState(undefined);
  const [isIpAddressValid, setIsIpAddressValid] = useState(false);
  const { i18n } = useTranslation("home");
  const { t } = useTranslation();
  const selectedLanguage = i18n.language.toUpperCase();

  const getServiceTypes = () => {
    apiCalls
      .getServiceTypes(selectedLanguage)
      .then((response) => {
        setServicesTypes([...response.data.servicesTypes]);
      })
      .catch((error) => {
        setIsSnackBarOpen(true);
        setMessage(t("snackBarGenericErrorMessage"));
        setSeverity("error");
      });
  };

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
    apiCalls.getServiceTypes(selectedLanguage).then((response) => {
      setServicesTypes([...response.data.servicesTypes]);
    });
  }, [selectedLanguage]);

  useEffect(() => {
    getServiceTypes();
    getIsIpAddressValid();
  }, []);

  const onClickHandleSnackBar = () => {
    setIsSnackBarOpen(false);
  };

  return (
    <Box>
      <CustomSnackBar
        showSnackBar={isSnackBarOpen}
        message={message}
        severity={severity}
        onClick={onClickHandleSnackBar}
        center={true}
      />
      <UserRentForm
        servicesTypes={servicesTypes}
        roomId={roomId}
        isIpAddressValid={isIpAddressValid}
      />
    </Box>
  );
};

export default UserRentPage;
