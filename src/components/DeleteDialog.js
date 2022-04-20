import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";

export default function DeleteDialog({
  isDialogOpen,
  deleteMethod,
  closeDialog,
}) {
  const deleteEntity = () => {
    deleteMethod();
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Box mx="auto" pb={1} pt={1}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={deleteEntity}
              color="error"
            >
              Yes
            </Button>
          </Box>
          <Box mx="auto" pb={1} pt={1}>
            <Button variant="outlined" onClick={closeDialog}>
              No
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
