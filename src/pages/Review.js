import Typography from "@material-ui/core/Typography";
import Logo from "../components/Logo";
import { Button, Rating } from "@mui/material";
import { useState } from "react";
import Box from "@mui/material/Box";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "react-share";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";

const Review = () => {
  const [renderSocialNetworkReviews, setRenderSocialNetworkReviews] =
    useState(false);
  const [
    renderReviewMessageIfBelow4Grade,
    setRenderReviewMessageIfBelow4Grade,
  ] = useState(false);
  const [grade, setGrade] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const adeolUrl = "https://www.aparthotel-adeo.hr/en/index.html";
  const socialMediaMessage = "Adeo aparthotel is amazing!";
  const adeoHashtag = "#adeoaparthotel";

  const { t } = useTranslation();

  const handleReview = (grade) => {
    setGrade(grade);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (grade >= 4) {
      setRenderReviewMessageIfBelow4Grade(false);
      setRenderSocialNetworkReviews(true);
    } else {
      setRenderSocialNetworkReviews(false);
      setRenderReviewMessageIfBelow4Grade(true);
    }
  };

  return (
    <>
      <Logo></Logo>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Typography variant="h6">{t("reviewMainMessage")}</Typography>
        </Grid>
        <Grid item paddingBottom={2}>
          <Rating
            disabled={isSubmitted}
            name="size-large"
            defaultValue={0}
            size="large"
            onChange={(event, newHover) => {
              handleReview(newHover);
            }}
          />
        </Grid>
        <Grid item paddingBottom={3}>
          <Button
            onClick={handleSubmit}
            sx={{ mt: 1, mr: 1 }}
            disabled={grade === null || isSubmitted}
          >
            {t("rentSubmitButton")}
          </Button>
        </Grid>
        {renderReviewMessageIfBelow4Grade && (
          <Box pb={2}>
            <Typography variant="h6">{t("reviewThanksMessage")}</Typography>
          </Box>
        )}
        {renderSocialNetworkReviews && (
          <>
            <Grid item>
              <Typography variant="h6">
                {t("reviewThanksAndShareMessage")}
              </Typography>
            </Grid>
            <Grid item>
              <FacebookShareButton
                url={adeolUrl}
                quote={socialMediaMessage}
                hashtag={adeoHashtag}
                style={{ marginRight: 2 }}
              >
                <FacebookIcon size={36} />
              </FacebookShareButton>

              <TwitterShareButton
                url={adeolUrl}
                title={socialMediaMessage}
                hashtag={adeoHashtag}
                style={{ marginRight: 2 }}
              >
                <TwitterIcon size={36} />
              </TwitterShareButton>

              <LinkedinShareButton url={adeolUrl}>
                <LinkedinIcon size={36} />
              </LinkedinShareButton>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Review;
