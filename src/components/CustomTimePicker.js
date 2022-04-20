import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from "@mui/material";
import Picker from "react-mobile-picker-scroll";

const CustomTimePicker = ({
  label,
  open,
  cancelAction,
  okAction,
  dateRange,
}) => {
  const [valueGroups, setValueGroups] = useState({
    hours: dateRange[0],
  });

  const optionGroups = {
    hours: dateRange,
  };

  const handleChange = (name, value) => {
    setValueGroups({ ...valueGroups, [name]: value });
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle>{label}</DialogTitle>
      <DialogContent dividers style={{ height: "200px", overflow: "hidden" }}>
        <Picker
          optionGroups={optionGroups}
          valueGroups={valueGroups}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={cancelAction}>
          Cancel
        </Button>
        <Button onClick={() => okAction(valueGroups)}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomTimePicker;
