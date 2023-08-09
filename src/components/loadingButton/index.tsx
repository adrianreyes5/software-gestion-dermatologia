import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";

type Props = {
  sx: any;
};

export default function LoadingButton({ sx }: Props) {
  return (
    <Button variant="contained" disabled color="primary" fullWidth sx={sx}>
      <CircularProgress size={24} />
    </Button>
  );
}
