import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Update } from "@/interfaces/all";
import { Typography, Box } from "@mui/material";

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
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    const id = setTimeout(() => {
      setOpen(false);
    }, 3000); // Extended timeout for better user experience

    return () => {
      clearTimeout(id);
    };
  }, [setOpen]);

  const encodedUpdates = btoa(JSON.stringify(updates));

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Updates Copied to Clipboard"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            The base64-encoded updates have been copied to your clipboard.
            Please share them with the respective developer to combine with
            other updates.
          </DialogContentText>
          <Box
            sx={{
              mt: 2,
              maxHeight: "200px", // Limit height for the text
              overflowY: "auto", // Enable scrolling for overflow
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              wordWrap: "break-word", // Ensure long text wraps properly
              border: "1px solid #ddd",
            }}
          >
            <Typography variant="body2" color="textSecondary" component="div">
              {encodedUpdates}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AlertDialog;
