import React, { MutableRefObject, useCallback, useRef } from "react";
import { Rnd, Props as RndProps, RndDragCallback, RndResizeCallback, RndResizeStartCallback } from 'react-rnd';
import styled from 'styled-components'

export const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

export const grid = (num: number) => Math.round(Number(num) / 50) * 50;

export type Props = RndProps

const useGridRnd = (shadowRef: MutableRefObject<HTMLDivElement>, props: Props) => {
  const onDrag = useCallback<RndDragCallback>(
    (...args) => {
      const data = args[1];
      const { current: shadow } = shadowRef;
      if (shadow) {
        const diffX = data.x - grid(data.lastX);
        const diffY = data.y - grid(data.lastY);
        shadow.style.transform = `translate(${-diffX}px, ${-diffY}px)`;
      }
      if (props.onDrag) {
        props.onDrag(...args);
      }
    },
    [shadowRef, props]
  );

  const onDragStop = useCallback<RndDragCallback>(
    (_e, data) => {
      const { current: shadow } = shadowRef;
      if (shadow) {
        shadow.style.transform = "";
      }

      if (props.onDragStop) {
        props.onDragStop(
          _e,
          {
            ...data,
            x: grid(data.x),
            y: grid(data.y)
          }
        );
      }
    },
    [shadowRef, props]
  );

  const onResizeStart = useCallback<RndResizeStartCallback>(
    (...args) => {
      args[2].className += " resizing";

      if (props.onResizeStart) {
        props.onResizeStart(...args);
      }
    },
    [props]
  );

  const onResize = useCallback<RndResizeCallback>(
    (...args) => {
      const [, , ref] = args
      const { height, width } = ref.getBoundingClientRect()
      const { current: shadow } = shadowRef;
      if (shadow) {
        shadow.style.height = `${grid(height)}px`;
        shadow.style.width = `${grid(width)}px`;
      }

      if (props.onResize) {
        props.onResize(...args);
      }
    },
    [shadowRef, props]
  );

  const onResizeStop = useCallback<RndResizeCallback>(
    (...args) => {
      const [, , ref] = args
      const { height, width } = ref.getBoundingClientRect()

      const clsName = ref.className;
      ref.className = clsName.replace(" resizing", "");
      ref.style.width = `${grid(width)}px`
      ref.style.height = `${grid(height)}px`

      if (props.onResizeStop) {
        props.onResizeStop(...args);
      }
    },
    [props]
  );

  return {
    onDrag,
    onDragStop,
    onResizeStart,
    onResize,
    onResizeStop
  };
};

const StyledRnd = styled(Rnd)`
  &.react-draggable-dragging,
  &.resizing {
    position: relative;
  }

  .shadow {
    display: none;
  }

  &.react-draggable-dragging, &.resizing {
    .shadow {
      content: "";
      background-color: red;
      position: absolute;
      display: block;
      opacity: 0.3;
      top: 0px;
      left: 0px;
      height: 100%;
      width: 100%;
    }
  }
`

export const GridRnd = (props: Props) => {
  const { bounds, size, position, children } = props;
  const shadowRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const gridRndCallbacks = useGridRnd(shadowRef, props);

  return (
    <StyledRnd
      className="my-rnd"
      bounds={bounds}
      style={style}
      size={size}
      position={position}
      {...gridRndCallbacks}
    >
      <div className="shadow" ref={shadowRef} />
      {children}
    </StyledRnd>
  );
};
