import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const ServiceDialog = ({
  isDialogOpen,
  handleDialogClose,
  service,
  serviceValueFromDialog,
  dialogTitle,
  serviceTypeIndex,
}) => {
  const [currentService, setCurrentService] = useState(null);
  const [isNameInputValid, setIsNameInputValid] = useState(true);

  useEffect(() => {
    setCurrentService(service);
  }, [service]);

  function onChangeServiceName(e) {
    if (e.target.value === "") {
      setIsNameInputValid(false);
      return;
    }
    setIsNameInputValid(true);
    setCurrentService({ ...currentService, name: e.target.value });
  }

  return (
    <>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth={true}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box m="auto" sx={{ width: "70%" }}>
          <TextField
            id="outlined-basic"
            label="Service Name"
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={service.name}
            error={!isNameInputValid}
            onChange={onChangeServiceName}
          />
        </Box>
        <Box mx="auto" pb={3} pt={3}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!isNameInputValid) {
                return;
              }
              serviceValueFromDialog(currentService, serviceTypeIndex);
              handleDialogClose();
            }}
          >
            Save
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default ServiceDialog;
