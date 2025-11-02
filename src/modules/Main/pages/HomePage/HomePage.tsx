import { BreakpointsContext } from "@/contexts/breakpoints";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useContext, useState } from "react";

function HomePage() {
  const { mdAndUp } = useContext(BreakpointsContext);
  const [allUnitsRaw, setAllUnitsRaw] = useState<string>("");
  const [taskedUnitsRaw, setTaskedUnitsRaw] = useState<string>("");
  const [offUnitChecksRaw, setOffUnitChecksRaw] = useState<string>("");
  const allUnits = allUnitsRaw
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
  const taskedUnits = taskedUnitsRaw
    .split(/\r?\n/)
    .filter(Boolean);
  const notExistingTaskedUnits = taskedUnits.filter((unit) => !allUnits.includes(unit))
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique
  const offUnitChecks = offUnitChecksRaw
    .trim()
    .split(/\r?\n/);
  const offUnits = allUnits.filter((unit, index) => offUnitChecks[index] === "X" || offUnitChecks[index] === "XX");
  const notExistingOffUnits = offUnits.filter((unit) => !allUnits.includes(unit))
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique
  const duplicatedUnits = allUnits
    .filter((unit, index, self) => ![index, -1].includes(self.indexOf(unit, index + 1)))// find duplicates
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique
  const duplicatedTaskedUnits = taskedUnits
    .filter((unit, index, self) => ![index, -1].includes(self.indexOf(unit, index + 1)))// find duplicates
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique
  const duplicatedOffUnits = offUnits
    .filter((unit, index, self) => ![index, -1].includes(self.indexOf(unit, index + 1)))// find duplicates
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique
  const offAndTaskedUnits = offUnits.filter((unit) => taskedUnits.includes(unit))
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique
  const availableUnits = allUnits
    .filter((unit) => !taskedUnits.includes(unit) && !offUnits.includes(unit))
    .filter((unit, index, self) => self.indexOf(unit) === index);// make unique;
  const availableUnitsString = availableUnits.join("\n");
  const taskedUnitsHelperText = notExistingTaskedUnits.length > 0
    ? "Lính không tồn tại!"
    : (offAndTaskedUnits.length > 0
      ? "Đang giao việc cho lính ca off!"
      : (duplicatedTaskedUnits.length > 0 ? "Có lính được giao nhiều hơn 1 ca!" : undefined));
  const offUnitsHelperText = notExistingOffUnits.length > 0
    ? "Lính không tồn tại!"
    : (duplicatedOffUnits.length > 0 ? "Tên bị trùng!" : undefined);

  const copyAvailableUnitsToClipboard = () => {
    navigator.clipboard.writeText(availableUnitsString);
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{
        display: "flex",
        gap: 2,
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}>
        <Box sx={{
          flex: 1,
        }}>
          <TextField
            multiline
            label="Toàn bộ lính"
            fullWidth
            margin="normal"
            value={allUnitsRaw}
            error={duplicatedUnits.length > 0}
            helperText={duplicatedUnits.length > 0 ? "Tên bị trùng!" : undefined}
            onChange={(e) => setAllUnitsRaw(e.target.value)}
          />
          <TextField
            multiline
            label="Lính được giao việc"
            fullWidth
            margin="normal"
            value={taskedUnitsRaw}
            error={!!taskedUnitsHelperText}
            helperText={taskedUnitsHelperText}
            onChange={(e) => setTaskedUnitsRaw(e.target.value)}
          />
          <TextField
            multiline
            label="Đánh dấu ca off"
            fullWidth
            margin="normal"
            value={offUnitChecksRaw}
            error={!!offUnitsHelperText}
            helperText={offUnitsHelperText}
            onChange={(e) => setOffUnitChecksRaw(e.target.value)}
          />
        </Box>
        <Divider orientation={mdAndUp ? "vertical" : "horizontal"} flexItem={mdAndUp} />
        <Box sx={{
          flex: 1,
        }}>
          <TextField
            multiline
            variant="filled"
            fullWidth
            margin="normal"
            label="Lính chưa được giao việc"
            value={availableUnitsString}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="copy" edge="end" onClick={copyAvailableUnitsToClipboard}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          {duplicatedUnits.length > 0 && (
            <Alert severity="error" sx={{ my: 2 }}>
              <AlertTitle>Tên Bị Trùng</AlertTitle>
              {duplicatedUnits.map((unit) => <p key={unit}>{unit}</p>)}
            </Alert>
          )}
          {notExistingTaskedUnits.length > 0 && (
            <Alert severity="error" sx={{ my: 2 }}>
              <AlertTitle>Giao Việc Cho Lính Không Tồn Tại</AlertTitle>
              {notExistingTaskedUnits.map((unit) => <p key={unit}>{unit}</p>)}
            </Alert>
          )}
          {notExistingOffUnits.length > 0 && (
            <Alert severity="error" sx={{ my: 2 }}>
              <AlertTitle>Lính Ca Off Không Tồn Tại</AlertTitle>
              {notExistingOffUnits.map((unit) => <p key={unit}>{unit}</p>)}
            </Alert>
          )}
          {duplicatedTaskedUnits.length > 0 && (
            <Alert severity="warning" sx={{ my: 2 }}>
              <AlertTitle>Lính Được Giao Nhiều Hơn 1 Ca</AlertTitle>
              {duplicatedTaskedUnits.map((unit) => <p key={unit}>{unit}</p>)}
            </Alert>
          )}
          {duplicatedOffUnits.length > 0 && (
            <Alert severity="warning" sx={{ my: 2 }}>
              <AlertTitle>Tên Trong Ca Off Bị Trùng</AlertTitle>
              {duplicatedOffUnits.map((unit) => <p key={unit}>{unit}</p>)}
            </Alert>
          )}
          {offAndTaskedUnits.length > 0 && (
            <Alert severity="warning" sx={{ my: 2 }}>
              <AlertTitle>Ca Off Mà Có Ca</AlertTitle>
              {offAndTaskedUnits.map((unit) => <p key={unit}>{unit}</p>)}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
