import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import HourList from "./hour-list";
import { hourData } from "@/utils/hour-list";
import AlertDialog from "./alert-dialog/indext";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LoadingButton from "../loading-button";

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

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleHoursSelected: (hours: string[]) => void;
  date: string;
  duration: number;
  unavailableDates: string[];
  handleDate: (event: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const NoLaboralDayDialog: React.FunctionComponent<Props> = ({
  open,
  setOpen,
  date,
  handleHoursSelected,
  duration,
  unavailableDates,
  handleDate,
  loading,
  setLoading,
}) => {
  const [hours, setHours] = React.useState(hourData);
  const [startDate, setStartDate] = React.useState({ index: 0, value: "" });
  const [endDate, setEndate] = React.useState({ index: 0, value: "" });
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
      const findUnavailableHour = unavailableDates?.includes(hour.value);

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

    return () => {
      setLoading(false);
    };
  }, [unavailableDates]);

  const selectHours = (
    hour: { value: string; available: boolean },
    index: number
  ) => {
    // Crea una copia del array original para evitar mutaciones directas
    let newData = [...hours];

    if (!startDate.value && hour.available) {
      setStartDate({ index, value: hour.value });
      newData.forEach((item) => {
        newData[index] = { ...newData[index], selected: true };
      });
    }
    if (startDate.value && !endDate.value && hour.available) {
      setEndate({ index, value: hour.value });

      newData.forEach((item, i) => {
        if (startDate.index <= i && i <= index) {
          newData[i] = { ...newData[i], selected: item.available };
        }

        if (startDate.index >= i && i >= index) {
          newData[i] = { ...newData[i], selected: item.available };
        }
      });
    }

    if (startDate.value && endDate.value && hour.available) {
      setEndate({ index: -1, value: "" });
      setStartDate({ index: -1, value: "" });

      newData = newData.map((item) => ({ ...item, selected: false }));
    }

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
        closeAfterTransition={false}
        disableEscapeKeyDown
        disablePortal
        maxWidth="xs"
      >
        <DialogContent dividers>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DateCalendar
                onChange={handleDate}
                minDate={dayjs(new Date())}
                defaultValue={dayjs(new Date())}
              />
            </LocalizationProvider>
          </Box>
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
              {loading ? (
                <LoadingButton sx={{ marginTop: "15px" }} />
              ) : (
                <Button
                  autoFocus
                  onClick={() => {
                    handleHoursSelected(
                      hours
                        .filter((hour) => hour.selected)
                        .map((hour) => hour.value)
                    );

                    // handleClose();
                    setHours(hourData);
                    setLoading(true);
                  }}
                  variant="contained"
                  disabled={hours.filter((hour) => hour.selected).length === 0}
                >
                  Guardar
                </Button>
              )}
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

export default NoLaboralDayDialog;
