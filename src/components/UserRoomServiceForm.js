import {
  Container,
  Typography,
  Divider,
  Grid,
  IconButton,
  Fab,
} from "@mui/material";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import Zoom from "@material-ui/core/Zoom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import useWindowDimensions from "../hooks/useWindowDimensions";
import { addToCart, deleteFromCart } from "../redux/cartHandler";

const UserRoomServiceForm = ({ menu }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartHandler);
  const selectedLanguage =
    i18n.language.charAt(0).toUpperCase() + i18n.language.slice(1);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

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

  const removeFromCart = (itemIndex, menuIndex, price) => {
    dispatch(deleteFromCart({ itemIndex, menuIndex, price }));
  };

  const isInCart = (itemIndex, menuIndex) => {
    const exist = cart.cartItems.find(
      (x) => x.itemIndex === itemIndex && x.menuIndex === menuIndex
    );
    if (exist) {
      return true;
    }
    return false;
  };

  const getQuantity = (itemIndex, menuIndex) => {
    const exist = cart.cartItems.find(
      (x) => x.itemIndex === itemIndex && x.menuIndex === menuIndex
    );

    if (exist) {
      return exist.quantity;
    }
  };

  const goToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container maxWidth="sm">
      <Box pt={3} pb={5}>
        <Typography variant="h5" align="center">
          {t("mainMenuRoomServiceAction")}
        </Typography>
        <Box pb={10}>
          {menu.map((element, menuIndex) => (
            <Box pt={5} key={menuIndex}>
              <Typography variant="h6" gutterBottom align="center">
                {element["name" + selectedLanguage]}
              </Typography>

              {element.menuItems.map((item, itemIndex) => (
                <>
                  <Box pt={1}>
                    <Divider key={itemIndex} />
                  </Box>
                  <Grid container>
                    <Grid item xs={3} display="flex">
                      <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        {isInCart(itemIndex, menuIndex) && (
                          <>
                            <Typography sx={{ fontWeight: "bold" }} pt={1}>
                              {getQuantity(itemIndex, menuIndex) + "x"}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                removeFromCart(
                                  itemIndex,
                                  menuIndex,
                                  item.price.toFixed(2)
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
                          </>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        sx={{ fontWeight: "bold", wordWrap: "break-word" }}
                        pb={3}
                        pt={1}
                      >
                        {item["name" + selectedLanguage]}
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        {item["description" + selectedLanguage]}
                      </Typography>
                      <Typography pt={1} variant="body2" color="text.disabled">
                        {item.normative === null || item.normative === ""
                          ? ""
                          : "(" + item.normative + ")"}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} display="flex">
                      <Grid
                        container
                        direction="column"
                        justifyContent="space-between"
                        alignItems="flex-end"
                      >
                        <Typography sx={{ fontWeight: "bold" }} pt={1}>
                          {"Kn " +
                            (width < 343
                              ? item.price.toFixed(1)
                              : item.price.toFixed(2))}
                        </Typography>

                        <IconButton
                          onClick={() =>
                            addItemToCart(item, itemIndex, menuIndex)
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
                </>
              ))}
              <Box pt={1}>
                <Divider />
              </Box>
            </Box>
          ))}
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Zoom
              in={cart.totalQuantity > 0}
              timeout={{ enter: 500, exit: 500 }}
              unmountOnExit
            >
              <Fab
                onClick={goToCheckout}
                variant="extended"
                sx={{
                  position: "fixed",
                  bottom: "4rem",
                }}
                color="primary"
              >
                {cart.totalQuantity > 0
                  ? t("roomServiceOrderLabel") +
                    " " +
                    cart.totalQuantity +
                    "x " +
                    t("roomServiceButtonLabel") +
                    " Kn " +
                    cart.totalPrice.toFixed(2)
                  : " "}
              </Fab>
            </Zoom>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default UserRoomServiceForm;
