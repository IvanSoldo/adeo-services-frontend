import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

const MapsCard = (props) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card style={{ border: "none", boxShadow: "none" }} variant="outlined">
        <CardContent>
          <Typography variant="h6" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2">
            <br />
            {props.description.includes("http") ? (
              <a
                href={props.description}
                style={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.description}
              </a>
            ) : (
              props.description
            )}
          </Typography>
          <Typography variant="body2">
            <br />
            <a
              href={"tel:+" + props.phoneNumber}
              style={{ textDecoration: "none" }}
            >
              {props.phoneNumber}
            </a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MapsCard;
