import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const ServiceTypeDialog = ({
  isDialogOpen,
  handleDialogClose,
  serviceType,
  serviceTypeValueFromDialog,
  dialogTitle,
  dialogLabel,
}) => {
  const [currentServiceType, setCurrentServiceType] = useState(null);
  const [isNameInputValid, setIsNameInputValid] = useState(true);

  useEffect(() => {
    setCurrentServiceType(serviceType);
  }, [serviceType]);

  function onChangeServiceTypeNameEn(e) {
    if (e.target.value === "") {
      setIsNameInputValid(false);
      return;
    }
    setIsNameInputValid(true);
    setCurrentServiceType({ ...currentServiceType, nameEn: e.target.value });
  }
  function onChangeServiceTypeNameHr(e) {
    if (e.target.value === "") {
      setIsNameInputValid(false);
      return;
    }
    setIsNameInputValid(true);
    setCurrentServiceType({ ...currentServiceType, nameHr: e.target.value });
  }
  function onChangeServiceTypeNameDe(e) {
    if (e.target.value === "") {
      setIsNameInputValid(false);
      return;
    }
    setIsNameInputValid(true);
    setCurrentServiceType({ ...currentServiceType, nameDe: e.target.value });
  }
  function onChangeServiceTypeNameIt(e) {
    if (e.target.value === "") {
      setIsNameInputValid(false);
      return;
    }
    setIsNameInputValid(true);
    setCurrentServiceType({ ...currentServiceType, nameIt: e.target.value });
  }

  return (
    <>
      <Dialog open={isDialogOpen} onClose={handleDialogClose} fullWidth={true}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <Box m="auto" sx={{ width: "70%" }}>
          <TextField
            id="outlined-basic"
            label={dialogLabel + ' English Name'}
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={serviceType.nameEn}
            error={!isNameInputValid}
            onChange={onChangeServiceTypeNameEn}
          />
        </Box>
        <Box m="auto" sx={{ width: "70%" }}>
          <TextField
            id="outlined-basic"
            label={dialogLabel + ' Croatian Name'}
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={serviceType.nameHr}
            error={!isNameInputValid}
            onChange={onChangeServiceTypeNameHr}
          />
        </Box>
        <Box m="auto" sx={{ width: "70%" }}>
          <TextField
            id="outlined-basic"
            label={dialogLabel + ' German Name'}
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={serviceType.nameDe}
            error={!isNameInputValid}
            onChange={onChangeServiceTypeNameDe}
          />
        </Box>
        <Box m="auto" sx={{ width: "70%" }}>
          <TextField
            id="outlined-basic"
            label={dialogLabel + ' Italian Name'}
            variant="outlined"
            margin="dense"
            fullWidth={true}
            defaultValue={serviceType.nameIt}
            error={!isNameInputValid}
            onChange={onChangeServiceTypeNameIt}
          />
        </Box>
        <Box mx="auto" pb={3} pt={3}>
          <Button
            variant="outlined"
            onClick={() => {
              if (!isNameInputValid) {
                return;
              }
              serviceTypeValueFromDialog(currentServiceType);
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

export default ServiceTypeDialog;
