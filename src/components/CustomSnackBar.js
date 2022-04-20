import { Alert, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CustomSnackBar = (props) => {
  let height = props.center ? "100%" : "10%";
  return (
    <Snackbar
      sx={{ height: height }}
      open={props.showSnackBar}
      onClose={props.onClick}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
    >
      <Alert
        severity={props.severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: 0.5 }}
            onClick={props.onClick}
          >
            <CloseIcon />
          </IconButton>
        }
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
