import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "dayjs/locale/es";

import dayjs from "dayjs";
import TreatmentHoursDialog from "@/components/treatment-hours-dialog";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.

export default function AvailableTreatments() {
  const [openDateDialog, setOpenDateDialog] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  const handleDate = (event: any) => {
    const date = dayjs(event).format("MMMM D, YYYY");

    setSelectedDate(date);
    setOpenDateDialog(true);
  };
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <DateCalendar onChange={handleDate} />
      </LocalizationProvider>

      <TreatmentHoursDialog
        open={openDateDialog}
        setOpen={setOpenDateDialog}
        date={selectedDate}
      />
    </div>
  );
}
