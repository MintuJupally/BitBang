import { useEffect, useRef } from "react";
import ReactHighcharts from "react-highcharts/ReactHighstock.src";
import { showPrice } from "../../utils";

const pad = (arr) => {
  let fin = [];
  if (arr) fin = [...arr];

  while (fin.length < 90) fin.push([fin.length, null]);

  return fin;
};

const minimum = (arr) => {
  if (!arr || arr.length === 0) return null;

  let min = arr[0][1];
  arr.forEach((el) => {
    if (el[1] < min) min = el[1];
  });

  return min;
};

const maximum = (arr) => {
  if (!arr || arr.length === 0) return null;

  let max = 0;
  arr.forEach((el) => {
    if (el[1] > max) max = el[1];
  });

  return max;
};

const latestDay = (arr) => {
  if (!arr || arr.length === 0) return null;

  return parseInt(arr[arr.length - 1][0] / 10);
};

const Graph = ({ data, name }) => {
  const chart = useRef(null);

  const options = { style: "currency", currency: "INR" };
  const numberFormat = new Intl.NumberFormat("en-US", options);
  const configPrice = {
    yAxis: {
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
      min: minimum(data),
      max: maximum(data),
      startOnTick: false,
      endOnTick: false,
    },
    xAxis: {
      offset: 20,
      labels: {
        formatter: function () {
          const day = parseInt(this.value / 10);
          const time = this.value % 10;

          if (time === 0) return `Day ${day}`;

          return `D${day} H${time}`;
        },
      },
      startOnTick: false,
      endOnTick: false,
      min: latestDay(data) * 10,
      max: latestDay(data) * 10 + 10,
    },
    tooltip: {
      shared: true,
      formatter: function () {
        const day = parseInt(this.x / 10);
        const time = this.x % 10;

        if (time === 0)
          return `<b>${showPrice(this.y, 2)}</b> <br/> Day ${day}`;

        return `<b>${showPrice(this.y, 2)}</b><br/> Day ${day} Hour ${time}`;
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
    rangeSelector: {
      buttons: [
        {
          type: "millisecond",
          count: 5,
          text: "5h",
        },
        {
          type: "millisecond",
          count: 10,
          text: "1d",
        },
        {
          type: "millisecond",
          count: 20,
          text: "2d",
        },
        {
          type: "millisecond",
          count: 40,
          text: "4d",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      selected: 1,
      inputEnabled: false,
    },
    series: [
      {
        name: "Price",
        data: pad(data),
        tooltip: {
          valueDecimals: 2,
        },
      },
    ],
  };

  // useEffect(() => {
  //   updateFocus();
  // }, [data]);

  return (
    <div
      style={{ margin: "0px 10px" }}
      onClick={() => {
        console.log(chart.current);
      }}
    >
      <ReactHighcharts config={configPrice} ref={chart}></ReactHighcharts>
    </div>
  );
};

export default Graph;
