import { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@mui/material/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import BikeScooterOutlinedIcon from "@mui/icons-material/BikeScooterOutlined";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import axios from "axios";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import CardActionArea from "@mui/material/CardActionArea";
import { useDispatch } from "react-redux";
import { handleRoom } from "../redux/roomHandler";
import { createTheme } from "@material-ui/core";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import CustomSnackBar from "../components/CustomSnackBar";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import DirectionsSubwayOutlinedIcon from "@mui/icons-material/DirectionsSubwayOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HailIcon from '@mui/icons-material/Hail';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 330,
      md: 415,
      lg: 600,
      xl: 800,
    },
  },
});

const MainMenu = () => {
  let { roomId } = useParams();
  const dispatch = useDispatch();
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [severity, setSeverity] = useState(undefined);
  const [message, setMessage] = useState(undefined);

  useEffect(() => {
    axios
      .get(`api/v1/rooms/${roomId}`)
      .then((res) => {
        const hotelRoom = res.data;
        dispatch(
          handleRoom({ roomNumber: hotelRoom.number, roomId: hotelRoom.id })
        );
      })
      .catch((error) => {
        setIsSnackBarOpen(true);
        setMessage(
          "Something went wrong. Please try scanning the qrcode again or contact our staff!"
        );
        setSeverity("error");
      });
  }, []);

  const onClickHandleSnackBar = () => {
    setIsSnackBarOpen(false);
  };

  const { t } = useTranslation();

  return (
    <>
      <Logo></Logo>
      <Grid
        theme={theme}
        container
        direction="row"
        justifyContent="center"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        mt={{ xs: "2%", sm: "8%", md: "25%", lg: "15%" }}
        mb={{ xs: "25%", sm: "25%" }}
      >
        <Grid item xs={5} align="center">
          <Link to={"/rent"} style={{ textDecoration: "none" }}>
            <Card
              elevation={1}
              variant="outlined"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                borderColor: "#3f50b5",
                height: "100%",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <BikeScooterOutlinedIcon
                    style={{ fontSize: 50, color: "#3f50b5" }}
                  ></BikeScooterOutlinedIcon>
                  <Typography gutterBottom component="div">
                    {t("mainMenuRentAction")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={5} align="center">
          <Link to={"/roomService"} style={{ textDecoration: "none" }}>
            <Card
              elevation={1}
              variant="outlined"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                borderColor: "#3f50b5",
                height: "100%",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <FastfoodOutlinedIcon
                    style={{ fontSize: 50, color: "#3f50b5" }}
                  ></FastfoodOutlinedIcon>
                  <Typography gutterBottom component="div">
                    {t("mainMenuRoomServiceAction")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={5} align="center">
          <Card
            elevation={1}
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "none",
              borderColor: "#3f50b5",
              height: "100%",
            }}
          >
            <CardActionArea
              href="https://www.aparthotel-adeo.hr/files/MENU-price.pdf"
              target="_blank"
            >
              <CardContent>
                <RestaurantMenuOutlinedIcon
                  style={{ fontSize: 50, color: "#3f50b5" }}
                ></RestaurantMenuOutlinedIcon>
                <Typography gutterBottom component="div">
                  {t("mainMenuRestaurantMenuAction")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid
          item
          xs={5}
          align="center"
          style={{ border: "none", boxShadow: "none" }}
        >
          <Link to={"/review"} style={{ textDecoration: "none" }}>
            <Card
              elevation={1}
              variant="outlined"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                borderColor: "#3f50b5",
                height: "100%",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <ThumbUpAltOutlinedIcon
                    style={{ fontSize: 50, color: "#3f50b5" }}
                  ></ThumbUpAltOutlinedIcon>
                  <Typography gutterBottom component="div">
                    {t("mainMenuReviewAction")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={5} align="center">
          <a href="tel:+38552777065" style={{ textDecoration: "none" }}>
            <Card
              elevation={1}
              variant="outlined"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                borderColor: "#3f50b5",
                height: "100%",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <AddIcCallOutlinedIcon
                    style={{ fontSize: 50, color: "#3f50b5" }}
                  ></AddIcCallOutlinedIcon>
                  <Typography gutterBottom component="div">
                    {t("mainCallReceptionistAction")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </a>
        </Grid>
        <Grid
          item
          xs={5}
          align="center"
          style={{ border: "none", boxShadow: "none" }}
        >
          <Card
            elevation={1}
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "none",
              borderColor: "#3f50b5",
              height: "100%",
            }}
          >
            <CardActionArea
              href="https://www.aparthotel-adeo.hr/files/House-rules.pdf"
              target="_blank"
            >
              <CardContent>
                <MapsHomeWorkOutlinedIcon
                  style={{ fontSize: 50, color: "#3f50b5" }}
                ></MapsHomeWorkOutlinedIcon>
                <Typography gutterBottom component="div">
                  {t("mainMenuHouseRulesAction")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid
          item
          xs={5}
          align="center"
          style={{ border: "none", boxShadow: "none" }}
        >
          <Card
            elevation={1}
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "none",
              borderColor: "#3f50b5",
              height: "100%",
            }}
          >
            <CardActionArea
              href="https://www.aparthotel-adeo.hr/files/TV.pdf"
              target="_blank"
            >
              <CardContent>
                <TvOutlinedIcon
                  style={{ fontSize: 50, color: "#3f50b5" }}
                ></TvOutlinedIcon>
                <Typography gutterBottom component="div">
                  {t("mainMenuTvAction")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid
          item
          xs={5}
          align="center"
          style={{ border: "none", boxShadow: "none" }}
        >
          <Card
            elevation={1}
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "none",
              borderColor: "#3f50b5",
              height: "100%",
            }}
          >
            <CardActionArea
              href="https://www.aparthotel-adeo.hr/files/Telephone.pdf"
              target="_blank"
            >
              <CardContent>
                <PhoneInTalkOutlinedIcon
                  style={{ fontSize: 50, color: "#3f50b5" }}
                ></PhoneInTalkOutlinedIcon>
                <Typography gutterBottom component="div">
                  {t("mainMenuPhoneManual")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={5} align="center">
          <Link to={"/maps"} style={{ textDecoration: "none" }}>
            <Card
              elevation={1}
              variant="outlined"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                borderColor: "#3f50b5",
                height: "100%",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <MapOutlinedIcon
                    style={{ fontSize: 50, color: "#3f50b5" }}
                  ></MapOutlinedIcon>
                  <Typography gutterBottom component="div">
                    {t("mainMenuMapsAction")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
        <Grid
          item
          xs={5}
          align="center"
          style={{ border: "none", boxShadow: "none" }}
        >
          <Card
            elevation={1}
            variant="outlined"
            style={{
              borderRadius: 16,
              boxShadow: "none",
              borderColor: "#3f50b5",
              height: "100%",
            }}
          >
            <CardActionArea
              href="https://www.aparthotel-adeo.hr/files/Tourist-train.pdf"
              target="_blank"
            >
              <CardContent>
                <DirectionsSubwayOutlinedIcon
                  style={{ fontSize: 50, color: "#3f50b5" }}
                ></DirectionsSubwayOutlinedIcon>
                <Typography gutterBottom component="div">
                  {t("mainMenuTouristTrainAction")}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={5} align="center">
          <a href="tel:+385994244844" style={{ textDecoration: "none" }}>
            <Card
              elevation={1}
              variant="outlined"
              style={{
                borderRadius: 16,
                boxShadow: "none",
                borderColor: "#3f50b5",
                height: "100%",
              }}
            >
              <CardActionArea>
                <CardContent>
                  <HailIcon 
                    style={{ fontSize: 50, color: "#3f50b5" }}
                  ></HailIcon >
                  <Typography gutterBottom component="div">
                    {t("mainCallTaxiAction")}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </a>
        </Grid>
        <CustomSnackBar
          showSnackBar={isSnackBarOpen}
          message={message}
          severity={severity}
          onClick={onClickHandleSnackBar}
          center={true}
        />
      </Grid>
    </>
  );
};

export default MainMenu;
