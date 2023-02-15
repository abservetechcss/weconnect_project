import React from "react";
import { ResponsiveLine } from "@nivo/line";
export default function IndicatorLineChart(props) {
  const DashedSolidLine = ({ series, lineGenerator, xScale, yScale }) => {
    return series.map(({ id, data, color }, index) => (
      <path
        key={id}
        d={lineGenerator(
          data.map((d) => ({
            x: xScale(d.data.x),
            y: yScale(d.data.y),
          }))
        )}
        fill="none"
        stroke={color}
        style={
          index % 2 === 0
            ? {
                // simulate line will dash stroke when index is even
                strokeDasharray: "3, 4",
                strokeWidth: 2,
              }
            : {
                // simulate line with solid stroke
                strokeWidth: 2,
              }
        }
      />
    ));
  };

  return (
    <div style={{ height: "340px" }}>
      <ResponsiveLine
        data={[
          {
            id: "Total Conversation",
            color: "#4889f5",
            data: props.chartData,
          },

          {
            id: "New Conversation",
            color: "hsl(67, 70%, 50%)",
            data: props.chartData1,
          },
        ]}
        margin={{ top: 20, right: 40, bottom: 100, left: 10 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day"
        }}
        colors={"#17c7ba"}
        layers={[
          "grid",
          "markers",
          "axes",
          "areas",
          "crosshair",
          "line",
          "slices",
          "points",
          "mesh",
          "legends",
          DashedSolidLine, // add the custome layer here
        ]}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        maxValue={100}
        yFormat=" >-.2f"
        xFormat="time:%Y-%m-%d"
        axisTop={null}       
        axisRight={{
          orient: "right",
          tickSize: 0,
          tickPadding: 9,
          tickRotation: 0,
          legend: "",
          legendOffset: 0,
        }}
        axisLeft={null}
        axisBottom={{ 
          tickRotation: -90,
          format: "%b %d",
          tickValues: props.tickValues,
         }}
        enableGridX={false}
        lineWidth={1}
        enablePoints={false}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        areaOpacity={0}
        useMesh={true}
        legends={[]}
        enableSlices="x"
        sliceTooltip={({ slice }) => {
          return (
            <div
              style={{
                background: "white",
                padding: "9px 12px",
                border: "1px solid #ccc",
              }}
            >
              {/* <div>x: {slice.id}</div> */}
              {slice.points.map((point, key) => (
                <div
                  key={point.id}
                  style={{
                    color: point.serieColor,
                    padding: "3px 0",
                  }}
                >
                  <div className="legends_line_charts">
                    <div
                      className={key !== 0 ? "legends_total" : "legends_new"}
                    >
                      <div></div>
                      <span style={{ color: "#333" }}>
                        {point.serieId} :{point.data.yFormatted}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
}
