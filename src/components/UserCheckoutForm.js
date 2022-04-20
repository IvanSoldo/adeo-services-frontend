import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Fab,
  Divider,
  Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Alert from "@mui/material/Alert";
import Zoom from "@material-ui/core/Zoom";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { useDispatch } from "react-redux";

import useWindowDimensions from "../hooks/useWindowDimensions";
import { addToCart, deleteFromCart } from "../redux/cartHandler";

const UserCheckoutForm = ({
  roomId,
  cart,
  createMenuOrder,
  handleBackToMenu,
  isSuccess,
  isIpAddressValid,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const selectedLanguage =
    i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();

  const handlePaymentMethod = (event) => {
    setPaymentMethod(event.target.value);
  };

  const sendOrder = () => {
    let items = [];
    for (let cartItem of cart.cartItems) {
      items.push({
        id: cartItem.item.id,
        amount: cartItem.quantity,
      });
    }
    let order = {
      menuItems: items,
      paymentOption: paymentMethod,
    };
    createMenuOrder(roomId, order);
  };

  const addItemToCart = (item, itemIndex, menuIndex) => {
    dispatch(
      addToCart({
        item: item,
        itemIndex: itemIndex,
        menuIndex: menuIndex,
        quantity: 1,
      })
    );
  };

  const backToRoomServiceForm = () => {
    navigate("/roomService");
  };

  useEffect(() => {
    if (cart.totalQuantity === 0) {
      backToRoomServiceForm();
    }
  }, [cart]);

  const removeFromCart = (itemIndex, menuIndex, price) => {
    dispatch(deleteFromCart({ itemIndex, menuIndex, price }));
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box pt={3} pb={4}>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={2} display="flex" justifyContent="flex-start">
              <IconButton
                onClick={backToRoomServiceForm}
                color="primary"
                sx={{
                  padding: 0,
                  minHeight: 0,
                  minWidth: 0,
                }}
              >
                <KeyboardArrowLeftIcon fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item xs={8} display="flex" justifyContent="center">
              <Typography variant="h5">{t("checkoutTitle")}</Typography>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={12}>
              <Box pt={2} />
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {t("checkoutYourOrderLabel")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box pt={1} pb={3}>
                <Typography variant="h6">
                  {cart.totalQuantity === 1
                    ? cart.totalQuantity + " " + t("checkoutItemLabel")
                    : cart.totalQuantity + " " + t("checkoutItemPluralLabel")}
                </Typography>
              </Box>
            </Grid>
            {cart.cartItems.map((item, index) => (
              <Grid item xs={12} key={index}>
                <Grid
                  container
                  direction="row"
                  alignItems="stretch"
                  pt={1}
                  pb={1}
                >
                  <Grid item xs={3} display="flex">
                    <Grid
                      container
                      direction="column"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Typography sx={{ fontWeight: "bold" }} pb={2}>
                        {item.quantity + "x"}
                      </Typography>

                      <IconButton
                        onClick={() =>
                          removeFromCart(
                            item.itemIndex,
                            item.menuIndex,
                            item.item.price.toFixed(2)
                          )
                        }
                        color="primary"
                        sx={{
                          padding: 0,
                          minHeight: 0,
                          minWidth: 0,
                        }}
                      >
                        <RemoveCircleTwoToneIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography pb={2} sx={{ wordWrap: "break-word" }}>
                      {item["item"]["name" + selectedLanguage]}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} display="flex">
                    <Grid
                      container
                      direction="column"
                      justifyContent="space-between"
                      alignItems="flex-end"
                    >
                      <Typography sx={{ fontWeight: "bold" }} pb={2}>
                        {"Kn " +
                          (width < 343
                            ? item.item.price.toFixed(1)
                            : item.item.price.toFixed(2))}
                      </Typography>

                      <IconButton
                        onClick={() =>
                          addItemToCart(
                            item.item,
                            item.itemIndex,
                            item.menuIndex
                          )
                        }
                        color="primary"
                        sx={{
                          padding: 0,
                          minHeight: 0,
                          minWidth: 0,
                        }}
                      >
                        <AddCircleTwoToneIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Box pt={4} pb={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t("checkoutPaymentMethod")}
            </Typography>
          </Box>
          <Box>
            <FormControl>
              <RadioGroup value={paymentMethod} onChange={handlePaymentMethod}>
                <FormControlLabel
                  value="CASH"
                  control={<Radio />}
                  label={t("checkoutPaymentMethodCash")}
                />
                <FormControlLabel
                  value="CREDIT_CARD"
                  control={<Radio />}
                  label={t("checkoutPaymentMethodCreditCard")}
                />
                <FormControlLabel
                  value="ROOM"
                  control={<Radio />}
                  label={t("checkoutPaymentMethodRoomTab")}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      </Container>
      <Divider style={{ width: "100%" }} />
      <Container maxWidth="sm">
        <Box>
          <Box pt={4} pb={2}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {t("checkoutSummaryLabel")}
            </Typography>
          </Box>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <Typography>{t("checkoutSummaryItemsLabel")}</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Typography>{"Kn " + cart.totalPrice.toFixed(2)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>{t("checkoutSummaryDeliveryLabel")}</Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Typography>{"Kn 40.00"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontWeight: "bold" }}>
                {t("checkoutSummaryTotalLabel")}
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end">
              <Typography sx={{ fontWeight: "bold" }}>
                {"Kn " + (cart.totalPrice + 40).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
          <Dialog open={isSuccess} onClose={handleBackToMenu}>
            <DialogContent>
              <DialogContentText>
                {t("roomServiceSuccessMessage")}
              </DialogContentText>
            </DialogContent>
            <DialogActions
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  m: "auto",
                  width: "fit-content",
                }}
              >
                <Button onClick={handleBackToMenu} autoFocus>
                  {t("rentBackToMenuButton")}
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
      {!isIpAddressValid && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          paddingBottom={3}
          paddingTop={3}
        >
          <Alert severity="info" variant="outlined">
            {t("invalidIpAddressMessage")}
          </Alert>
        </Box>
      )}
      <Grid
        pt={13}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Zoom
          in={isIpAddressValid}
          timeout={{ enter: 500, exit: 500 }}
          unmountOnExit
        >
          <Fab
            disabled={!isIpAddressValid}
            onClick={sendOrder}
            variant="extended"
            sx={{
              position: "fixed",
              bottom: "4rem",
            }}
            color="primary"
          >
            {t("checkoutConfirmOrderAction")}
          </Fab>
        </Zoom>
      </Grid>
    </>
  );
};

export default UserCheckoutForm;
