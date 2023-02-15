import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    legend: {
      display: false, //This will do the task
    },
    title: {
      display: false,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function VerticalBarChartComponent(props) {
  const data = {
    labels: props.labels || labels,
    datasets: [
      {
        label: props.title1 || "Dataset 1",
        data: props.dataSet1,
        backgroundColor: "#8be7c9",
      },
      {
        label: props.title2 || "Dataset 2",
        data: props.dataSet2,
        backgroundColor: "#17c7ba",
      },
      {
        label: "Dataset 3",
        data: props.dataSet3,
        backgroundColor: "#17c7ba",
      },
      // {
      //   label: "Dataset 4",
      //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      //   backgroundColor: "#A0C2F9"
      // }
    ],
  };
  return <Bar options={options} data={data} />;
}
