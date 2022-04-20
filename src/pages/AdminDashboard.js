import StatisticCard from "../components/StatisticCard";
import Masonry from "@mui/lab/Masonry";
import axios from 'axios'
import { useState, useEffect } from 'react'

const AdminDashboard = () => {

  const [statistics, setStatistics] = useState([])

  useEffect(() => {
    axios.get(`api/v1/statistics`).then((res) => {
      const statistics = [...res.data.statistics]
      setStatistics(statistics)
    })
  }, [])

  return (
    <Masonry columns={{ xs: 3, sm: 4 }} spacing={1}>
      {statistics.map((statistic, index) => (
        <div key={index}>
          <StatisticCard statistic={statistic} />
        </div>
      ))}
    </Masonry>
  );
};

export default AdminDashboard;
