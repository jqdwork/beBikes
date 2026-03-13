import { Snackbar, Alert } from "@mui/material";

const Notify = ({ message, onClose, severity = "info" }) => (
  <Snackbar
    open={!!message}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <Alert severity={severity} variant="filled" onClose={onClose}>
      {message}
    </Alert>
  </Snackbar>
);

export default Notify;
