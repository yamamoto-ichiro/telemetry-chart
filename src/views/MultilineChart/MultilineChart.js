/** MultilineChart.js */
import React from "react";
import PropTypes from "prop-types";
import { MultiLineDataPropTypes } from "../../utils/propTypes";
import { Line, Axis, GridLine, Overlay, Tooltip, Area } from "../../components";
import useController from "./MultilineChart.controller";
import useDimensions from "../../utils/useDimensions";
import * as d3 from "d3";

const MultilineChart = ({ data = [], margin = {} }) => {
  const overlayRef = React.useRef(null);
  const [containerRef, { svgWidth, svgHeight, width, height }] = useDimensions({
    maxHeight: 400,
    margin
  });
  const controller = useController({ data, width, height });
  const {
    yTickFormat,
    xTickFormat,
    xScale,
    yScale,
    yScaleForAxis
  } = controller;

  const zoomed = () => {
    const t = d3.event.transform;
    xScale.domain(t.rescaleX(xScale).domain());
    yScale.domain(t.rescaleY(yScale).domain());
    // path.attr('d', line);
    // dots.attr('cx', (d) => {
    //     return x(toTimestamp(d.time));
    // }).attr('cy', (d) => {
    //     return y(d.value);
    // });

    d3.select('svg .axis--x')
        .call(xScale)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-0.8em')
        .attr('dy', '0.15em')
        .style(
            'transform',
            'rotate(-45deg) translateX(10px) translateY(10px)'
        );

    d3.select('svg .axis--y').call(d3.axisLeft(yScale));
  };
  const zoom = d3.zoom().scaleExtent([1, 30]).on('zoom', zoomed);

  d3.select(`svg`).call(zoom);

  return (
    <div ref={containerRef}>
      <svg width={svgWidth} height={svgHeight}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <GridLine
            type="vertical"
            scale={xScale}
            ticks={7}
            size={height}
            transform={`translate(0, ${height})`}
          />
          <GridLine
            type="horizontal"
            scale={yScaleForAxis}
            ticks={2}
            size={width}
          />
          <GridLine
            type="horizontal"
            className="baseGridLine"
            scale={yScale}
            ticks={1}
            size={width}
            disableAnimation
          />
          {data.map(({ name, items = [], color }) => (
            <Line
              key={name}
              data={items}
              xScale={xScale}
              yScale={yScale}
              color={color}
            />
          ))}
          <Area data={data[0].items} xScale={xScale} yScale={yScale} />
          <Axis
            type="left"
            scale={yScaleForAxis}
            transform="translate(-30)"
            ticks={5}
            tickFormat={yTickFormat}
          />
          <Overlay ref={overlayRef} width={width} height={height}>
            <Axis
              type="bottom"
              className="axisX"
              anchorEl={overlayRef.current}
              scale={xScale}
              transform={`translate(0, ${height})`}
              ticks={5}
              tickFormat={xTickFormat}
            />
            <Tooltip
              className="tooltip"
              anchorEl={overlayRef.current}
              width={width}
              height={height}
              margin={margin}
              xScale={xScale}
              yScale={yScale}
              data={data}
            />
          </Overlay>
        </g>
      </svg>
    </div>
  );
};

MultilineChart.propTypes = {
  data: MultiLineDataPropTypes,
  margin: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })
};

MultilineChart.defaultProps = {
  data: [],
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};

export default MultilineChart;
