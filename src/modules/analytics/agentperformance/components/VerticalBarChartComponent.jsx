import { Bar, ResponsiveBar } from "@nivo/bar";
import React from "react";

export default function VerticalBarChartComponent(props) {
  const HorizontalTick = ({ textAnchor, textBaseline, value, x, y }) => {
    const MAX_LINE_LENGTH = 9;
    const MAX_LINES = 2;
    const LENGTH_OF_ELLIPSIS = 3;
    const TRIM_LENGTH = MAX_LINE_LENGTH * MAX_LINES - LENGTH_OF_ELLIPSIS;
    const trimWordsOverLength = new RegExp(`^(.{${TRIM_LENGTH}}[^\\w]*).*`);
    const groupWordsByLength = new RegExp(
      `([^\\s].{0,${MAX_LINE_LENGTH}}(?=[\\s\\W]|$))`,
      "gm"
    );
    const splitValues = value
      .replace(trimWordsOverLength, "$1...")
      .match(groupWordsByLength)
      .slice(0, 2)
      .map((val, i) => (
        <tspan
          key={val}
          dy={15 * i}
          x={-10}
          y={20}
          style={{ fontFamily: "Nunito", fontSize: "11px" }}
        >
          {val}
        </tspan>
      ));
    return (
      <g transform={`translate(${x},${y})`}>
        <text alignmentBaseline={textBaseline} textAnchor={textAnchor}>
          {splitValues}
        </text>
      </g>
    );
  };
  return (
    <div className="dash_bar_chart" style={{ height: "320px" }}>
      <ResponsiveBar
        data={props.live_chat_duration}
        height={320}
        padding={0.1}
        margin={{ top: 30, right: 30, bottom: 40, left: 40 }}
        indexBy="name"
        keys={["barChart"]}
        labelTextColor="inherit:darker(1.0)"
        colors={"#17c7ba"}
        enableGridX={false}
        // gridYValues={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
          },
        ]}
        borderColor="black"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          legend: false,
          renderTick: HorizontalTick,
        }}
        axisLeft={{
          tickSize: 5,
          format: (v) => `${v} min`,
          legend: false,
        }}
        tooltip={({ id, value, color }) => (
          <div>
            <br />
            <strong>
              {
                props.live_chat_duration.filter((x) => {
                  return x.barChart === value;
                })[0].name
              }
              : {`${value} min`}
            </strong>
          </div>
        )}
      />
    </div>
  );
}
