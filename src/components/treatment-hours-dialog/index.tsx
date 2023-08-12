import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import HourList from "./hour-list";
import { hourData } from "@/utils/hour-list";
import AlertDialog from "./alert-dialog/indext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleHoursSelected: (hours: string[]) => void;
  date: string;
  duration: number;
  unavailableDates: string[];
};

const TreatmentHoursDialog: React.FunctionComponent<Props> = ({
  open,
  setOpen,
  date,
  handleHoursSelected,
  duration,
  unavailableDates,
}) => {
  const [hours, setHours] = React.useState(hourData);
  const [showAlertDialog, setShowAlertDialog] = React.useState<{
    title: string;
    description: string;
    open: boolean;
  }>({
    title: "",
    description: "",
    open: false,
  });

  React.useEffect(() => {
    setHours(hourData);
    const data = hours.map((hour) => {
      const findUnavailableHour = unavailableDates
        ?.slice(0, -1)
        ?.includes(hour.value);

      if (findUnavailableHour) {
        return {
          ...hour,
          available: false,
        };
      }

      return {
        ...hour,
        available: true,
      };
    });

    setHours(data);
  }, [unavailableDates]);

  const selectHours = (
    hour: { value: string; available: boolean },
    index: number
  ) => {
    // Crea una copia del array original para evitar mutaciones directas
    let newData = [...hours];

    let isAvailable: any = null;

    if (duration === 1) {
      isAvailable = hours[index].available;
    }
    if (duration === 2) {
      isAvailable = hours[index].available && hours[index + 1]?.available;
    }
    if (duration === 3) {
      isAvailable =
        hours[index].available &&
        hours[index + 1]?.available &&
        hours[index + 2]?.available;
    }

    newData = newData.map((item) => ({ ...item, selected: false }));

    setHours((prev) => prev.map((item) => ({ ...item, selected: false })));
    if (isAvailable) {
      // Actualiza el estado "selected" del elemento seleccionado y los siguientes 2 elementos
      for (
        let i = index;
        i <= index + (duration - 1) && i < newData.length;
        i++
      ) {
        newData[i] = { ...newData[i], selected: true };
      }
    } else {
      setShowAlertDialog({
        title: "Hora no disponible",
        description: `El tiempo del tratamiento es de ${duration} horas`,
        open: true,
      });

      return;
    }

    // Actualiza el estado del array con los elementos actualizados
    setHours([...newData]);
  };

  const handleClose = () => {
    setOpen(false);
    setHours(hourData);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="xs"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {date}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box width="100%">
            <HourList
              treatmentHours={duration}
              hours={hours}
              selectHours={selectHours}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box padding={1} display="flex" alignItems="center">
            <Box mx={1}>
              <Button autoFocus onClick={handleClose}>
                Cerrar
              </Button>
            </Box>
            <Box mx={1}>
              <Button
                autoFocus
                onClick={() => {
                  handleHoursSelected(
                    hours
                      .filter((hour) => hour.selected)
                      .map((hour) => hour.value)
                  );

                  handleClose();
                  setHours(hourData);
                }}
                variant="contained"
                disabled={hours.filter((hour) => hour.selected).length === 0}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </BootstrapDialog>

      {showAlertDialog.open && (
        <AlertDialog
          description={showAlertDialog.description}
          open={showAlertDialog.open}
          setOpen={() =>
            setShowAlertDialog({
              title: "",
              description: "",
              open: false,
            })
          }
          title={showAlertDialog.title}
        />
      )}
    </div>
  );
};

export default TreatmentHoursDialog;
