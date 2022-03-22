import React, { Component } from "react";
import ReactHighcharts from "react-highcharts/ReactHighstock.src";
import priceData from "../../assets/btcdata.json";
import moment from "moment";

const Graph = ({ data, name }) => {
  const options = { style: "currency", currency: "INR" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const configPrice = {
    yAxis: [
      {
        offset: 20,
        labels: {
          formatter: function () {
            return numberFormat.format(this.value);
          },
          x: -15,
          style: {
            color: "#000",
            position: "absolute",
          },
          align: "left",
        },
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return (
          numberFormat.format(this.y, 0) +
          "</b><br/>" +
          moment(this.x).format("MMMM Do YYYY, h:mm")
        );
      },
    },
    plotOptions: {
      series: {
        showInNavigator: true,
        gapSize: 6,
      },
    },
    chart: {
      height: 480,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    xAxis: {
      type: "date",
    },
    rangeSelector: {
      buttons: [
        {
          type: "hour",
          count: 1,
          text: "1h",
        },
        {
          type: "hour",
          count: 5,
          text: "5h",
        },
        {
          type: "hour",
          count: 12,
          text: "12h",
        },
        {
          type: "day",
          count: 1,
          text: "1d",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 4,
      inputEnabled: false,
    },
    series: [
      {
        name: "Price",
        data: priceData,
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  return (
    <div>
      <ReactHighcharts config={configPrice}></ReactHighcharts>
    </div>
  );
};

export default Graph;
