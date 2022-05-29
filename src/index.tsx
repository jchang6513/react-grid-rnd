import React, { MutableRefObject, useCallback, useMemo, useRef } from "react";
import { Rnd, Props as RndProps, RndDragCallback, RndResizeCallback, RndResizeStartCallback } from 'react-rnd';
import styled from 'styled-components'

const DRAGGING_CLASS = 'react-draggable-dragging'
const RESIZING_CLASS = 'react-rnd-resizing'
const MASK_CLASS = 'react-rnd-mask'

export const grid = (num: number) => Math.round(Number(num) / 50) * 50;

export type Props = RndProps

const useGridRnd = (maskRef: MutableRefObject<HTMLDivElement>, props: Props) => {
  const onDrag = useCallback<RndDragCallback>(
    (...args) => {
      const data = args[1];
      const { current: shadow } = maskRef;
      if (shadow) {
        const diffX = data.x - grid(data.lastX);
        const diffY = data.y - grid(data.lastY);
        shadow.style.transform = `translate(${-diffX}px, ${-diffY}px)`;
      }
      if (props.onDrag) {
        props.onDrag(...args);
      }
    },
    [maskRef, props]
  );

  const onDragStop = useCallback<RndDragCallback>(
    (_e, data) => {
      const { current: shadow } = maskRef;
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
    [maskRef, props]
  );

  const onResizeStart = useCallback<RndResizeStartCallback>(
    (...args) => {
      args[2].classList.add(RESIZING_CLASS)

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
      const { current: shadow } = maskRef;
      if (shadow) {
        shadow.style.height = `${grid(height)}px`;
        shadow.style.width = `${grid(width)}px`;
      }

      if (props.onResize) {
        props.onResize(...args);
      }
    },
    [maskRef, props]
  );

  const onResizeStop = useCallback<RndResizeCallback>(
    (...args) => {
      const [, , ref] = args
      ref.classList.remove(RESIZING_CLASS)

      const { height, width } = ref.getBoundingClientRect()
      ref.style.width = `${grid(width)}px`
      ref.style.height = `${grid(height)}px`

      if (props.onResizeStop) {
        props.onResizeStop(...args);
      }
    },
    [props]
  );

  return useMemo(() => ({
    onDrag,
    onDragStop,
    onResizeStart,
    onResize,
    onResizeStop
  }), [onDrag, onDragStop, onResizeStart, onResize, onResizeStop]);
};

const StyledRnd = styled(Rnd)`
  position: relative;

  .${MASK_CLASS} {
    display: none;
  }

  &.${DRAGGING_CLASS}, &.${RESIZING_CLASS} {
    .${MASK_CLASS} {
      content: "";
      background-color: black;
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
  const { children, ...rest } = props;
  const maskRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const gridRndCallbacks = useGridRnd(maskRef, props);

  return (
    <StyledRnd
      {...rest}
      {...gridRndCallbacks}
    >
      <div className={MASK_CLASS} ref={maskRef} />
      {children}
    </StyledRnd>
  );
};
