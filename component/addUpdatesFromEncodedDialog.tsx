import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Update } from "@/interfaces/all";
import { Typography, Box } from "@mui/material";
import { TextFieldShadcn } from "./TextFieldShadcn";

interface AddUpdatesFromEncodedDialogProps {
  open: boolean; // State indicating whether the dialog is open
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // State updater function for `open`
  updates: Update[]; // Array of updates to be copied to clipboard
  setUpdates: React.Dispatch<React.SetStateAction<Update[]>>;
}

const AddUpdatesFromEncodedDialog: React.FC<AddUpdatesFromEncodedDialogProps> = ({
  open,
  setOpen,
  updates,
  setUpdates,
}) => {
  const [encodedUpdates, setEncodedUpdates] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const handleClose = () => {
    // setOpen(false);
    try {
      const decodedUpdates = JSON.parse(atob(encodedUpdates));
      setUpdates(decodedUpdates);
      setEncodedUpdates("");
      setError("");
      setOpen(false);
    } catch (error) {
      console.log(error);
      setError("Invalid encoded string");
    }

  };

  React.useEffect(() => {
    const id = setTimeout(() => {
      setOpen(false);
    }, 3000); 

    return () => {
      clearTimeout(id);
    };
  }, [setOpen]);


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
          {"Paste Encoded String ( This will clear your current updates )"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText color="error" id="alert-dialog-description">
            !!!This will clear your current updates!!!!!!!.
          </DialogContentText>
          <Box
            sx={{
              mt: 2,
              maxHeight: "200px",
              overflowY: "auto", 
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              wordWrap: "break-word",
              border: "1px solid #ddd",
            }}
          >
            <TextFieldShadcn
                          id="name"
                          value={encodedUpdates}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEncodedUpdates(e.target.value)
                          }
                          // label="Name"
                          fullWidth
                          variant="standard"
                          error={error !== ""}
                          helperText={error}
                        />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleClose} variant="contained">
            Replace Updates
          </Button>
          <Button color="primary" onClick={()=>{setOpen(false)}} variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddUpdatesFromEncodedDialog;
