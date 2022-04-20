import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Box } from "@material-ui/core";

const StatisticCard = ({ statistic }) => {
  return (
    <div>
      <Card elevation={1}>
        <CardHeader title={statistic.title + ":"} />
        <CardContent>
          <Typography variant="h2" color="textSecondary">
            {statistic.count}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticCard;
