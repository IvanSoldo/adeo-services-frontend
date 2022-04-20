import { useState, useEffect } from "react";

import * as Highcharts from "highcharts";
import * as Xrange from "highcharts/modules/xrange";
import * as Draggable from "highcharts/modules/draggable-points";
import HighchartsReact from "highcharts-react-official";

import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import addDays from "date-fns/addDays";
import { areIntervalsOverlapping } from "date-fns";

import * as apiCalls from "../api/apiCalls";
import * as chartHelper from "../helpers/chartHelper";
import useInterval from "../hooks/useInterval";

require("highcharts/modules/exporting")(Highcharts);

Highcharts.setOptions({
  time: {
    useUTC: false,
  },
});

Xrange(Highcharts);
Draggable(Highcharts);

const TimelineChart = (props) => {
  const [servicesTypes, setServiceTypes] = useState([]);
  const [services, setServices] = useState(undefined);
  const [orders, setOrders] = useState(undefined);
  const [date, setDate] = useState(new Date());
  const [plusDate, setPlusDate] = useState(addDays(date, 1));

  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [orderToMove, setOrderToMove] = useState({});
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isServicesLoaded, setIsServicesLoaded] = useState(false);

  const plotLineValue = new Date();
  plotLineValue.setMinutes(0, 0, 0);

  const options = {
    chart: {
      type: "xrange",
      height: 800,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      plotLines: [
        {
          color: "blue",
          width: 3,
          value: plotLineValue,
        },
      ],
      type: "datetime",
      tickInterval: 3600 * 1000,
      gridLineWidth: 1,
      min: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      ).getTime(),
      max: new Date(
        plusDate.getFullYear(),
        plusDate.getMonth(),
        plusDate.getDate()
      ).getTime(),
    },
    yAxis: {
      type: "category",
      labels: {
        style: {
          fontSize: "14",
        },
        step: 1,
      },
      title: {
        text: "",
      },
      categories: categories,
      reversed: true,
      min: 0,
      max: categories.length - 1,
    },
    tooltip: {
      padding: 15,
      formatter: function () {
        return (
          chartHelper.unixToTimeString(this.x) +
          " - " +
          chartHelper.unixToTimeString(this.x2) +
          "<br />" +
          this.key +
          "<br />" +
          "Order Id: " +
          this.point.options.orderId
        );
      },
    },
    plotOptions: {
      series: {
        dragDrop: {
          draggableX: true,
          draggableY: true,
          liveRedraw: false,
        },
        point: {
          events: {
            drop: function (e) {
              let movedOrder = e.target.options;
              let isOnSameCategory = false;
              let isOverLapping = false;
              let oldService = chartHelper
                .getCategories(services, orders)
                .find((category, index) => index === movedOrder.y);
              let newService = chartHelper
                .getCategories(services, orders)
                .find((category, index) => index === e.newPoint.y);
              let isSuccess = false;

              for (let order of series) {
                isOnSameCategory = e.newPoint.y === order.y;
                isOverLapping = areIntervalsOverlapping(
                  { start: movedOrder.x, end: movedOrder.x2 },
                  { start: order.x, end: order.x2 }
                );
                if (isOnSameCategory && isOverLapping) {
                  isSuccess = false;
                  e.preventDefault();
                  break;
                } else if (newService === undefined) {
                  isSuccess = false;
                  e.preventDefault();
                } else if (oldService === newService) {
                  isSuccess = false;
                  e.preventDefault();
                } else {
                  isSuccess = true;
                }
              }
              if (isSuccess) {
                setOrderToMove({
                  orderId: movedOrder.orderId,
                  serviceToRemove: oldService,
                  serviceToAdd: newService,
                  selectedServiceType: props.selectedServiceType.id,
                });
              }
            },
          },
        },
      },
    },
    series: [
      {
        name: "",
        cursor: "move",
        maxPointWidth: 100,
        data: series,
        dataLabels: {
          enabled: true,
        },
      },
    ],
    exporting: {
      chartOptions: {
        chart: {
          width: 1273,
          height: 900,
        },
      },
      menuItemDefinitions: {
        downloadPDF: {
          onclick: function () {
            this.exportChart({
              type: "application/pdf",
            });
          },
          text: "Download PDF",
        },
      },
      buttons: {
        contextButton: {
          menuItems: ["viewFullscreen", "separator", "downloadPDF"],
        },
      },
    },
  };

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(function () {
      if (!isApiLoading) {
        setIsLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    const isEmpty = Object.keys(orderToMove).length === 0;
    if (!isEmpty) {
      apiCalls
        .updateOrder(orderToMove.orderId, orderToMove)
        .then(() => {
          getOrdersByDate(date, props.selectedServiceType.id);
        })
        .catch((e) => {
          getServicesByServiceType(props.selectedServiceType.id);
          getOrdersByDate(date, props.selectedServiceType.id);
          props.setIsSnackBarOpen(true);
          props.setMessage(
            "Something went wrong. There might be new unloaded orders."
          );
          props.setSeverity("error");
        });
    }
  }, [orderToMove]);

  const getServicesByServiceType = (id) => {
    setIsApiLoading(true);
    apiCalls
      .getServicesByServiceType(id)
      .then((response) => {
        setIsServicesLoaded(true);
        let isServicesEqual = chartHelper.isEqual(
          services,
          response.data.services
        );
        setIsApiLoading(false);
        if (isServicesEqual) {
          return;
        }

        if (services !== undefined) {
          handleLoading();
        }
        setServices(response.data.services);
      })
      .catch((error) => {
        setIsApiLoading(false);
        props.setIsSnackBarOpen(true);
        props.setMessage("Failed to load services. Please try again!");
        props.setSeverity("error");
      });
  };

  const getOrdersByDate = (date, id) => {
    setIsApiLoading(true);
    apiCalls
      .getAllOrdersByDate(chartHelper.formatDateForChart(date), id)
      .then((response) => {
        let isOrdersEqual = chartHelper.isEqual(orders, response.data.orders);
        setIsApiLoading(false);
        if (isOrdersEqual) {
          return;
        }
        if (orders !== undefined) {
          handleLoading();
        }

        setOrders(response.data.orders);
      })
      .catch((error) => {
        setIsApiLoading(false);
        props.setIsSnackBarOpen(true);
        props.setMessage("Failed to load orders. Please try again!");
        props.setSeverity("error");
      });
  };

  useEffect(() => {
    if (isServicesLoaded && props.selectedServiceType.id !== "") {
      getOrdersByDate(date, props.selectedServiceType.id);
      setIsServicesLoaded(false);
    }
  }, [isServicesLoaded, props.selectedServiceType]);

  useEffect(() => {
    apiCalls
      .getServiceTypes("EN")
      .then((response) => {
        setServiceTypes([...response.data.servicesTypes]);
        if (response.data.servicesTypes.length < 1) {
          props.setIsSnackBarOpen(true);
          props.setMessage("Make sure there are service types available!");
          props.setSeverity("error");
          return;
        }
        props.setSelectedServiceType({
          id: response.data.servicesTypes[0].id,
          name: response.data.servicesTypes[0].name,
        });
        getServicesByServiceType(response.data.servicesTypes[0].id);
      })
      .catch((e) => {
        props.setIsSnackBarOpen(true);
        props.setMessage("Failed to load service types. Please try again.");
        props.setSeverity("error");
      });
  }, []);

  const onChangeUpdateCategories = () => {
    if (services !== undefined) {
      const newCategories = chartHelper.getCategories(services);
      if (newCategories.toString() === categories.toString()) {
        return;
      }
      setCategories(newCategories);
    }
  };

  useEffect(() => {
    onChangeUpdateCategories();
  }, [services]);

  const onChangeUpdateSeries = () => {
    if (orders === undefined) {
      return;
    }
    if (services === undefined) {
      return;
    }
    const data = chartHelper.getData(services, orders);
    if (data.toString() === series.toString()) {
      return;
    }
    setSeries(data);
  };

  useEffect(() => {
    onChangeUpdateSeries();
  }, [orders]);

  useEffect(() => {
    if (props.newOrder !== undefined) {
      let orderToAdd = chartHelper.updateSeries(services, props.newOrder);
      if (props.orderServiceType.id === props.selectedServiceType.id) {
        setSeries([...series, ...orderToAdd]);
      }
    }
  }, [props.newOrder]);

  const onChangeService = (event, value) => {
    props.setSelectedServiceType({
      id: value.props.id,
      name: event.target.value,
      services: value.props.services,
    });
    getServicesByServiceType(value.props.id);
    getOrdersByDate(date, value.props.id);
  };

  const handleDate = (newValue) => {
    setDate(newValue);
    setPlusDate(addDays(newValue, 1));
    getOrdersByDate(newValue, props.selectedServiceType.id);
  };

  useInterval(() => {
    getServicesByServiceType(props.selectedServiceType.id);
    getOrdersByDate(date, props.selectedServiceType.id);
  }, 60000);

  return (
    <>
      <Grid
        pt={5}
        container
        spacing={5}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Service</InputLabel>
            <Select
              disabled={isLoading}
              label="Service"
              onChange={onChangeService}
              name="ServiceType"
              value={
                props.selectedServiceType.name === null
                  ? ""
                  : props.selectedServiceType.name
              }
            >
              {servicesTypes.map((serviceType) => (
                <MenuItem
                  key={serviceType.id}
                  value={serviceType.name}
                  services={serviceType.services}
                  id={serviceType.id}
                >
                  {serviceType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              disabled={isLoading}
              label="Select date"
              value={date}
              onChange={handleDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {isLoading ? (
        <Grid marginBottom={10} marginTop={10}>
          <LinearProgress />
        </Grid>
      ) : (
        <Grid marginBottom={10} marginTop={5}>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Grid>
      )}
    </>
  );
};

export default TimelineChart;
