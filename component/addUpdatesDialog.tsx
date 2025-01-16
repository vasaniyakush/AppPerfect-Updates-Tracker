import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { Update, formatForTypes } from "@/interfaces/all";

interface AddUpdatesDialogProps {
  open: boolean; // State to determine if the dialog is open
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Function to update `open` state
  updates: Update[]; // Array of updates (assumed based on the name and usage)
  setUpdates: React.Dispatch<React.SetStateAction<Update[]>>; // Function to update `updates` state
  formatUpdates: (updates: Update[], formatFor: formatForTypes) => string; // Function to format updates
}

const AddUpdatesDialog: React.FC<AddUpdatesDialogProps> = ({
  open,
  setOpen,
  updates,
  setUpdates,
  formatUpdates,
}) => {
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  const [combinedUpdates, setcombinedUpdates] = React.useState(updates);
  const [encodedString, setEncodedString] = React.useState("");
  const handleClose = () => {
    setOpen(false);
  };
  const handleAccept = () => {
    setUpdates(combinedUpdates);
    handleClose();
  };

  React.useEffect(() => {
    console.log("use effect triggered");

    try {
      const newUpdatesString: string = atob(encodedString);
      const newUpdates = JSON.parse(newUpdatesString);
      console.log("updates=> ", updates);
      console.log("Newencoded udpates=>", newUpdates);
      let combined = [...updates, ...newUpdates];
      let index = 0;
      combined = combined.map((upd) => {
        upd.id = index++;
      });
      setcombinedUpdates(combined);
    } catch {}
  }, [encodedString, updates]);
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
          {"Please paste the base64encoded updates here"}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
          <TextField
            //   id={"category-name-" + update.id.toString()}
            //   label={indexToAlphabet(index)}
            onChange={(e) => setEncodedString(e.target.value)}
            value={encodedString}
            placeholder="Paste your encoded updates here"
            variant="outlined"
            fullWidth
          ></TextField>
          {/* </DialogContentText> */}
          <AceEditor
            value={formatUpdates(combinedUpdates, "email")}
            fontSize={20}
            mode="text"
            theme="github"
            name="xyz"
            width="100%"
            height="400px"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccept} color="success">
            Accept
          </Button>
          <Button onClick={handleClose} color="error">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default AddUpdatesDialog;
