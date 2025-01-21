import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Update } from "@/interfaces/all";
import { Typography } from "@mui/material";
// import { TextField, Typography } from "@mui/material";

interface AlertDialogProps {
  open: boolean; // State indicating whether the dialog is open
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // State updater function for `open`
  updates: Update[]; // Array of updates to be copied to clipboard
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  setOpen,
  updates,
}) => {
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const id = setTimeout(() => {
      setOpen(false);
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [setOpen]);

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Updates Copied to clipboard"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            The base64encoded updates have been copied to your clipboard. Please
            share with respective developer to combine it with other updates
          </DialogContentText>
          {/* <DialogContentText mt={2} id="alert-dialog-description2"> */}
          <Typography
            mt={2}
            flexWrap="wrap"
            // InputProps={{ readOnly: true }}
          >
            {btoa(JSON.stringify(updates))}
          </Typography>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Okay</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AlertDialog;
