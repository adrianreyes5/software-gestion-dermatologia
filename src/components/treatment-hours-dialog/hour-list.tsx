import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

type Props = {
  treatmentHours: number;
  hours: { value: string; available: boolean; selected: boolean }[];
  selectHours: (hour: any, index: number) => void;
};

const HourList: React.FunctionComponent<Props> = ({ hours, selectHours }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <List>
        {hours.map((hour, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Divider />}
            <ListItem disablePadding>
              <ListItemButton
                style={{
                  backgroundColor:
                    !hour.selected && hour.available
                      ? "#fff"
                      : !hour.available
                      ? theme.palette.primary.light
                      : theme.palette.primary.main,
                }}
                disabled={!hour.available}
                onClick={() => selectHours(hour, index)}
              >
                <ListItemText
                  primary={dayjs(hour.value, "HH:mm").format("hh:mm a")}
                />
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default HourList;
