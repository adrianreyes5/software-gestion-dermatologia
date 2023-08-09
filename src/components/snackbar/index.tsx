import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { MessageResponse } from "@/utils/types";

interface State extends SnackbarOrigin {
  open: boolean;
}

type Props = {
  snackbarState: MessageResponse;
  setSnackbarState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar({ snackbarState, setSnackbarState }: Props) {
  const [state, setState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal } = state;

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        onClose={() => setSnackbarState(false)}
        open={snackbarState.open}
        autoHideDuration={6000}
        key={vertical + horizontal}
      >
        <Alert
          onClose={() => setSnackbarState(false)}
          severity={snackbarState.type}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
