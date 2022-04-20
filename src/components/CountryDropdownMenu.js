import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Germany from "../assets/img/flags/de.png";
import English from "../assets/img/flags/gb.png";
import Italy from "../assets/img/flags/it.png";
import Croatia from "../assets/img/flags/hr.png";
import { useTranslation } from "react-i18next";
import { Box } from "@material-ui/core";

const countries = [
  {
    label: "English",
    src: English,
    suffix: "en",
  },
  {
    label: "Germany",
    src: Germany,
    suffix: "de",
  },
  {
    label: "Italy",
    src: Italy,
    suffix: "it",
  },
  {
    label: "Croatia",
    src: Croatia,
    suffix: "hr",
  },
];

export default function CountryDropdownMenu() {
  const [country, setCountry] = React.useState(English);
  const [open, setOpen] = React.useState(false);

  const { i18n } = useTranslation();

  function changeLanguage(countrySuffix) {
    i18n.changeLanguage(countrySuffix);
  }

  const handleChange = (event) => {
    setCountry(event.target.value);
    let country = countries.find((c) => c.src === event.target.value);
    changeLanguage(country.suffix);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <form autoComplete="off">
      <FormControl pl={5}>
        <InputLabel htmlFor="open-select" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Select
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={country}
            name={"country"}
            onChange={handleChange}
            inputProps={{
              id: "open-select",
            }}
            disableUnderline
          >
            {countries.map((option, key) => (
              <MenuItem value={option.src} key={key}>
                <img src={option.src} alt={option.label} />
                {""}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </FormControl>
    </form>
  );
}
