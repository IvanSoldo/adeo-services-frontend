import {
  Container,
  Step,
  Stepper,
  Typography,
  StepContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  StepLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useState, useEffect } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { DatePicker } from "@mui/lab";
import { add, addDays, isWithinInterval } from "date-fns";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import * as apiCalls from "../api/apiCalls";
import * as rentHelper from "../helpers/rentHelper";
import CustomTimePicker from "./CustomTimePicker";
import CustomSnackBar from "../components/CustomSnackBar";

const UserRentForm = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServiceType, setSelectedServiceType] = useState({
    id: "",
    name: "",
  });
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isWholeDay, setIsWholeDay] = useState(false);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [isDateError, setIsDateError] = useState(false);

  const [isUnitsLoading, setIsUnitsLoading] = useState(false);
  const [unitsAmount, setUnitsAmount] = useState("");
  const [unitsAmountMessage, setUnitsAmountMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const [isRentRequestLoading, setIsRentRequestIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [message, setMessage] = useState(undefined);

  const navigate = useNavigate();

  const { t } = useTranslation();

  const getAvailableUnitsCount = (params) => {
    setIsUnitsLoading(true);
    apiCalls
      .getAvailableUnitsCount(params)
      .then((response) => {
        if (response.data.availableUnits < amount) {
          setSeverity("error");
        } else {
          setSeverity("info");
        }
        setUnitsAmountMessage(t("rentUnitsAmountMessage"));
        setUnitsAmount(response.data.availableUnits);
        setIsUnitsLoading(false);
      })
      .catch((error) => {
        setUnitsAmountMessage(t("snackBarGenericErrorMessage"));
        setIsUnitsLoading(false);
        setSeverity("error");
      });
  };

  useEffect(() => {
    if (selectedServiceType.id !== "") {
      const serviceTypeToAdd = props.servicesTypes.find(
        (x) => x.id === selectedServiceType.id
      );
      setSelectedServiceType(serviceTypeToAdd);
    }
  }, [props.servicesTypes]);

  useEffect(() => {
    if (activeStep === 6) {
      getAvailableUnitsCount(
        rentHelper.getParamsForUnitsCount(
          startAt,
          endAt,
          selectedServiceType.id,
          selectedDate,
          isWholeDay
        )
      );
    }
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep === 3 && isWholeDay) {
      setActiveStep(6);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = (method) => {
    if (activeStep === 6 && isWholeDay) {
      setActiveStep(3);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    method();
  };

  const resetServiceType = () => {
    setSelectedServiceType({
      id: "",
      name: "",
    });
  };

  const resetAmount = () => {
    setAmount("");
  };

  const resetSelectedDate = () => {
    setSelectedDate(new Date());
  };

  const resetIsWholeDay = () => {
    setIsWholeDay(false);
  };

  const resetStartAt = () => {
    setStartAt("");
  };

  const resetEndAt = () => {
    setEndAt("");
  };

  const resetFinalStep = () => {
    setUnitsAmountMessage("");
    setIsUnitsLoading(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    resetServiceType();
    resetAmount();
    resetSelectedDate();
    resetIsWholeDay();
    resetStartAt();
    resetEndAt();
    resetFinalStep();
  };

  const onChangeService = (event, value) => {
    setSelectedServiceType({
      id: value.props.id,
      name: event.target.value,
    });
    setAmount("");
  };

  const onChangeHandleAmount = (event) => {
    let number = String(event.target.value).slice(-1);

    if (number > 4) {
      setAmount(4);
      return;
    }

    if (number < 1) {
      setAmount(1);
      return;
    }

    setAmount(number);
  };

  const handleDate = (event) => {
    event.setHours(0, 0, 0, 0);
    let minDate = new Date();
    let maxDate = addDays(new Date(), 1);
    minDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);

    let isWithinAllowedRange = isWithinInterval(event, {
      start: minDate,
      end: maxDate,
    });

    if (!isWithinAllowedRange) {
      setIsDateError(true);
      setSelectedDate(event);
    } else {
      setSelectedDate(event);
      setIsDateError(false);
    }
  };

  const handleSwitch = (event) => {
    setIsWholeDay(event.target.checked);
  };

  const cancelFrom = () => {
    setStartAt("");
    setIsFromOpen(false);
  };

  const cancelTo = () => {
    setEndAt("");
    setIsToOpen(false);
  };

  const handleFrom = (value) => {
    setStartAt(value.hours);
    setIsFromOpen(false);
  };

  const handleTo = (value) => {
    setEndAt(value.hours);
    setIsToOpen(false);
  };

  const handleBackToMenu = () => {
    navigate("/menu/" + props.roomId);
  };

  const handleSubmit = () => {
    setIsRentRequestIsLoading(true);

    let order = rentHelper.getParamsForUserRentSubmit(
      startAt,
      endAt,
      amount,
      selectedServiceType.id,
      props.roomId,
      isWholeDay,
      selectedDate
    );

    apiCalls
      .createNewOrder(order)
      .then((response) => {
        setIsRentRequestIsLoading(false);
        setIsSuccess(true);
      })
      .catch((error) => {
        setIsRentRequestIsLoading(false);
        setIsSnackBarOpen(true);
        setMessage(t("rentUnitsAmountMessage"));
      });
  };

  const onClickHandleSnackBar = () => {
    setIsSnackBarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box pt={3} pb={3}>
        <Typography variant="h5" align="center">
          {t("rentPageTitle")}
        </Typography>
        <br />
        <Typography variant="body2" align="center">
          {t("rentScooterPriceLabel")}
        </Typography>
        <Typography variant="body2" align="center">
          {t("rentBikePriceLabel")}
        </Typography>
      </Box>
      <Box>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step key={0} expanded={activeStep === 0}>
            <StepLabel>
              {selectedServiceType.name === ""
                ? t("rentServiceLabel")
                : t("rentServiceLabel") + ": " + selectedServiceType.name}
            </StepLabel>
            <StepContent>
              <Box pt={1} pb={3}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <FormControl sx={{ width: " 75%" }}>
                    <InputLabel>{t("rentServiceLabel")}</InputLabel>
                    <Select
                      disabled={activeStep !== 0}
                      label="Service"
                      onChange={onChangeService}
                      name="ServiceType"
                      defaultValue=""
                      value={
                        selectedServiceType.name === null
                          ? ""
                          : selectedServiceType.name
                      }
                    >
                      {props.servicesTypes.map((serviceType) => (
                        <MenuItem
                          key={serviceType.id}
                          value={serviceType.name}
                          id={serviceType.id}
                        >
                          {serviceType.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {activeStep === 0 && (
                  <Box
                    sx={{ mb: 2, pt: 1 }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={selectedServiceType.id === ""}
                    >
                      {t("rentNextButton")}
                    </Button>
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>
          <Step key={1} expanded={activeStep === 1}>
            <StepLabel>
              {amount === ""
                ? t("rentAmountLabel")
                : t("rentAmountLabel") + ": " + amount}
            </StepLabel>
            <StepContent>
              <Box pt={1} pb={3}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <TextField
                    sx={{ width: "50%" }}
                    disabled={activeStep !== 1}
                    label={t("rentAmountLabel")}
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={onChangeHandleAmount}
                    InputProps={{ inputProps: { min: 1, max: 4 } }}
                    onKeyPress={(event) => {
                      if (!event?.key.match("[0-9]")) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Box>
                {activeStep === 1 && (
                  <Box
                    sx={{ mb: 2, pt: 1 }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      onClick={() => handleBack(resetAmount)}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {t("rentBackButton")}
                    </Button>
                    <Button
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={amount === ""}
                    >
                      {t("rentNextButton")}
                    </Button>
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>
          <Step key={2} expanded={activeStep === 2}>
            <StepLabel>
              {t("rentDateLabel") + ": " + selectedDate.toLocaleDateString()}
            </StepLabel>
            <StepContent>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
                  pt={1}
                  pb={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <DatePicker
                    disabled={activeStep !== 2}
                    label={t("rentDateLabel")}
                    value={selectedDate}
                    minDate={new Date()}
                    maxDate={add(new Date(), { days: 1 })}
                    onChange={handleDate}
                    onError={() => setIsDateError(true)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </LocalizationProvider>
              {activeStep === 2 && (
                <Box
                  sx={{ mb: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    onClick={() => handleBack(resetSelectedDate)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {t("rentBackButton")}
                  </Button>
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={isDateError}
                  >
                    {t("rentNextButton")}
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={3} expanded={activeStep === 3}>
            <StepLabel>
              {isWholeDay ? t("rentBookedLabel") : t("rentBookedLabelForHour")}
            </StepLabel>
            <StepContent>
              <Box
                pt={1}
                pb={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isWholeDay}
                      onChange={handleSwitch}
                      disabled={activeStep !== 3}
                    />
                  }
                  label={t("rentSwitchLabel")}
                />
              </Box>
              {activeStep === 3 && (
                <Box
                  sx={{ mb: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    onClick={() => handleBack(resetIsWholeDay)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {t("rentBackButton")}
                  </Button>
                  <Button onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    {t("rentNextButton")}
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={4} expanded={activeStep === 4}>
            <StepLabel>
              {startAt === ""
                ? t("rentFromLabel")
                : t("rentFromLabel") + ": " + startAt}
            </StepLabel>
            <StepContent>
              <Box
                pt={1}
                pb={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <TextField
                  variant="outlined"
                  label={t("rentFromLabel")}
                  value={startAt}
                  onClick={() => setIsFromOpen(true)}
                />
                <CustomTimePicker
                  label={t("rentFromLabel")}
                  open={isFromOpen}
                  cancelAction={cancelFrom}
                  okAction={handleFrom}
                  dateRange={rentHelper.getFromHours(selectedDate)}
                />
              </Box>
              {activeStep === 4 && (
                <Box
                  sx={{ mb: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    onClick={() => handleBack(resetStartAt)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {t("rentBackButton")}
                  </Button>
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={startAt === ""}
                  >
                    {t("rentNextButton")}
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={5} expanded={activeStep === 5}>
            <StepLabel>
              {endAt === ""
                ? t("rentToLabel")
                : t("rentToLabel") + ": " + endAt}
            </StepLabel>
            <StepContent>
              <Box
                pt={1}
                pb={3}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <TextField
                  variant="outlined"
                  label={t("rentToLabel")}
                  value={endAt}
                  onClick={() => setIsToOpen(true)}
                />
                <CustomTimePicker
                  label={t("rentToLabel")}
                  open={isToOpen}
                  cancelAction={cancelTo}
                  okAction={handleTo}
                  dateRange={rentHelper.getToHours(startAt)}
                />
              </Box>
              {activeStep === 5 && (
                <Box
                  sx={{ mb: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    onClick={() => handleBack(resetEndAt)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {t("rentBackButton")}
                  </Button>
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={endAt === ""}
                  >
                    {t("rentNextButton")}
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={6} expanded={activeStep === 6} sx={{ marginBottom: 10 }}>
            <StepLabel>{t("rentFinalStepLabel")}</StepLabel>
            <StepContent>
              {activeStep === 6 && (
                <Box sx={{ mb: 2 }}>
                  {isUnitsLoading && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      paddingTop={3}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                  {!isUnitsLoading && (
                    <>
                      {amount > unitsAmount && props.isIpAddressValid && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          paddingBottom={3}
                          paddingTop={3}
                        >
                          <Alert severity={severity} variant="outlined">
                            {unitsAmountMessage}
                          </Alert>
                        </Box>
                      )}
                      {!props.isIpAddressValid && (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          paddingBottom={3}
                          paddingTop={3}
                        >
                          <Alert severity="info" variant="outlined">
                            {t("invalidIpAddressMessage")}
                          </Alert>
                        </Box>
                      )}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          onClick={() => handleBack(resetFinalStep)}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={isRentRequestLoading}
                        >
                          {t("rentBackButton")}
                        </Button>
                        <LoadingButton
                          onClick={handleSubmit}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={
                            !props.isIpAddressValid ||
                            unitsAmount < amount ||
                            isRentRequestLoading ||
                            severity === "error"
                          }
                          loading={isRentRequestLoading}
                        >
                          {t("rentSubmitButton")}
                        </LoadingButton>
                        <Button
                          onClick={handleReset}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={isRentRequestLoading}
                        >
                          {t("rentResetButton")}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </StepContent>
          </Step>
        </Stepper>
      </Box>
      <Dialog open={isSuccess} onClose={handleBackToMenu}>
        <DialogContent>
          <DialogContentText>
            {t("rentRequestSuccessMessage")}
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
        severity="error"
        onClick={onClickHandleSnackBar}
        center={true}
      />
    </Container>
  );
};

export default UserRentForm;
