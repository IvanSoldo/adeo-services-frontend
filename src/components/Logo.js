import logo from "../assets/img/logo.jpg";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  logo: {
    width: 500,
    [theme.breakpoints.up("xs")]: {
      width: 300,
    },
    [theme.breakpoints.up("sm")]: {
      width: 600,
    },
    [theme.breakpoints.up("lg")]: {
      width: 1000,
    },
  },
}));

const Logo = () => {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <img className={classes.logo} src={logo} alt="logo" />
        </Grid>
      </Grid>
    </>
  );
};

export default Logo;
