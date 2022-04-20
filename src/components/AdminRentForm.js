import {
  Container,
  Step,
  Stepper,
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

import * as apiCalls from "../api/apiCalls";
import * as rentHelper from "../helpers/rentHelper";
import CustomTimePicker from "./CustomTimePicker";
import CustomSnackBar from "../components/CustomSnackBar";

const AdminRentForm = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isWholeDay, setIsWholeDay] = useState(false);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const [isUnitsLoading, setIsUnitsLoading] = useState(false);
  const [unitsAmount, setUnitsAmount] = useState("");
  const [unitsAmountMessage, setUnitsAmountMessage] = useState("");
  const [severity, setSeverity] = useState("info");

  const [selectedRoom, setSelectedRoom] = useState({
    id: "",
    name: "",
    number: "",
  });

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
        setUnitsAmountMessage(
          "Number of available units: " + response.data.availableUnits
        );
        setUnitsAmount(response.data.availableUnits);
        setIsUnitsLoading(false);
      })
      .catch((error) => {
        setUnitsAmountMessage(
          "Something went wrong. Please try again or contact our staff!"
        );
        setIsUnitsLoading(false);
        setSeverity("error");
      });
  };

  useEffect(() => {
    if (activeStep === 7) {
      getAvailableUnitsCount(
        rentHelper.getParamsForUnitsCount(
          startAt,
          endAt,
          props.selectedServiceType.id,
          selectedDate,
          isWholeDay
        )
      );
    }
  }, [activeStep]);

  const handleNext = () => {
    if (activeStep === 4 && isWholeDay) {
      setActiveStep(7);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = (method) => {
    if (activeStep === 7 && isWholeDay) {
      setActiveStep(4);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    method();
  };

  const resetServiceType = () => {
    props.setSelectedServiceType({
      id: "",
      name: "",
    });
  };

  const resetAmount = () => {
    setAmount("");
  };

  const resetRoom = () => {
    setSelectedRoom({
      id: "",
      name: "",
      number: "",
    });
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
    resetRoom();
    resetSelectedDate();
    resetIsWholeDay(true);
    resetStartAt();
    resetEndAt();
    resetFinalStep();
  };

  const handleDialogClose = () => {
    props.setIsSuccess(false);
    handleReset();
  };

  const onChangeService = (event, value) => {
    props.setSelectedServiceType({
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

  const onChangeRoom = (event, value) => {
    setSelectedRoom({
      id: value.props.id,
      name: event.target.value,
      number: value.props.number,
    });
  };

  const handleDate = (event) => {
    setSelectedDate(event);
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

  let order = rentHelper.getParamsForUserRentSubmit(
    startAt,
    endAt,
    amount,
    props.selectedServiceType.id,
    selectedRoom.id,
    isWholeDay,
    selectedDate
  );

  return (
    <Container maxWidth="sm">
      <Box paddingTop={5}>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step key={0} expanded={activeStep === 0}>
            <StepLabel>
              {props.selectedServiceType.name === ""
                ? "Service"
                : "Service: " + props.selectedServiceType.name}
            </StepLabel>
            <StepContent>
              <Box pt={1} pb={3}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <FormControl sx={{ width: " 75%" }}>
                    <InputLabel>{"Service"}</InputLabel>
                    <Select
                      disabled={activeStep !== 0}
                      label="Service"
                      onChange={onChangeService}
                      name="ServiceType"
                      defaultValue=""
                      value={
                        props.selectedServiceType.name === null
                          ? ""
                          : props.selectedServiceType.name
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
                      disabled={props.selectedServiceType.id === ""}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>
          <Step key={1} expanded={activeStep === 1}>
            <StepLabel>
              {amount === "" ? "Amount" : "Amount: " + amount}
            </StepLabel>
            <StepContent>
              <Box pt={1} pb={3}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <TextField
                    sx={{ width: "50%" }}
                    disabled={activeStep !== 1}
                    label="Amount"
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
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={amount === ""}
                    >
                      Next
                    </Button>
                  </Box>
                )}
              </Box>
            </StepContent>
          </Step>
          <Step key={2} expanded={activeStep === 2}>
            <StepLabel>
              {selectedRoom.number === ""
                ? "Room number"
                : "Room number: " + selectedRoom.number}
            </StepLabel>
            <StepContent>
              {activeStep === 2 && (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <FormControl sx={{ width: "75%" }}>
                    <InputLabel>Room</InputLabel>
                    <Select
                      label="Service"
                      onChange={onChangeRoom}
                      name="room"
                      defaultValue=""
                      value={
                        selectedRoom.number === null ? "" : selectedRoom.number
                      }
                    >
                      {props.rooms.map((room) => (
                        <MenuItem
                          key={room.id}
                          value={room.number}
                          id={room.id}
                          number={room.number}
                        >
                          {room.number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              {activeStep === 2 && (
                <Box
                  sx={{ mb: 2, mt: 2 }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    onClick={() => handleBack(resetRoom)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={selectedRoom.id === ""}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={3} expanded={activeStep === 3}>
            <StepLabel>
              {"Date: " + selectedDate.toLocaleDateString()}
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
                    disabled={activeStep !== 3}
                    label="Date"
                    value={selectedDate}
                    onChange={handleDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </LocalizationProvider>
              {activeStep === 3 && (
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
                    Back
                  </Button>
                  <Button onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    Next
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={4} expanded={activeStep === 4}>
            <StepLabel>
              {isWholeDay
                ? "Booked for the whole day"
                : "Not Booked for the whole day"}
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
                      disabled={activeStep !== 4}
                    />
                  }
                  label="Book for the whole day"
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
                    onClick={() => handleBack(resetIsWholeDay)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                    Next
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={5} expanded={activeStep === 5}>
            <StepLabel>
              {startAt === "" ? "From" : "From: " + startAt}
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
                  label="From"
                  value={startAt}
                  onClick={() => setIsFromOpen(true)}
                />
                <CustomTimePicker
                  label="From"
                  open={isFromOpen}
                  cancelAction={cancelFrom}
                  okAction={handleFrom}
                  dateRange={rentHelper.getFromHours(selectedDate)}
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
                    onClick={() => handleBack(resetStartAt)}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={startAt === ""}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={6} expanded={activeStep === 6}>
            <StepLabel>{endAt === "" ? "To" : "To: " + endAt}</StepLabel>
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
                  label="To"
                  value={endAt}
                  onClick={() => setIsToOpen(true)}
                />
                <CustomTimePicker
                  label="To"
                  open={isToOpen}
                  cancelAction={cancelTo}
                  okAction={handleTo}
                  dateRange={rentHelper.getToHours(startAt)}
                />
              </Box>
              {activeStep === 6 && (
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
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    disabled={endAt === ""}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </StepContent>
          </Step>
          <Step key={7} expanded={activeStep === 7}>
            <StepLabel>Final Step</StepLabel>
            <StepContent>
              {activeStep === 7 && (
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
                      {severity !== "error" && <Box></Box>}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          onClick={() => handleBack(resetFinalStep)}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={props.isRentRequestLoading}
                        >
                          Back
                        </Button>
                        <LoadingButton
                          onClick={() => props.handleSubmit(order)}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={
                            unitsAmount < amount ||
                            props.isRentRequestLoading ||
                            severity === "error"
                          }
                          loading={props.isRentRequestLoading}
                        >
                          Submit
                        </LoadingButton>
                        <Button
                          onClick={handleReset}
                          sx={{ mt: 1, mr: 1 }}
                          disabled={props.isRentRequestLoading}
                        >
                          Reset
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
      <Dialog open={props.isSuccess} onClose={handleDialogClose}>
        <DialogContent>
          <DialogContentText>Rent request successfully sent!</DialogContentText>
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
            <Button onClick={handleDialogClose} autoFocus>
              Back
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <CustomSnackBar
        showSnackBar={props.isSnackBarOpen}
        message={props.message}
        severity="error"
        onClick={props.onClickHandleSnackBar}
        center={true}
      />
    </Container>
  );
};

export default AdminRentForm;
