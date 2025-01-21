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
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [setOpen]);

  const encodedUpdates = btoa(JSON.stringify(updates));

  // const handleCopyToClipboard = () => {
  //   navigator.clipboard.writeText(encodedUpdates);
  //   alert("Copied to clipboard!");
  // };

  return (
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
          The base64-encoded updates have been copied to your clipboard. Please
          share with the respective developer to combine it with other updates.
        </DialogContentText>
        <Box
          mt={2}
          p={2}
          border={1}
          borderColor="grey.300"
          borderRadius={1}
          sx={{
            maxHeight: 200,
            overflowY: "auto",
            backgroundColor: "grey.100",
            whiteSpace: "pre-wrap",
          }}
        >
          <Typography variant="body2">{encodedUpdates}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Okay</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
