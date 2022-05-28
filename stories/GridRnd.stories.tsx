import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { GridRnd, Props } from '../src';

const meta: Meta = {
  title: 'GridRnd',
  component: GridRnd,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;


const BLOCKS = {
  block1: {
    width: 200,
    height: 200,
    x: 0,
    y: 0
  },
  block2: {
    width: 200,
    height: 200,
    x: 200,
    y: 0
  },
  block3: {
    width: 200,
    height: 200,
    x: 0,
    y: 200
  },
  block4: {
    width: 200,
    height: 200,
    x: 200,
    y: 200
  },
};

const Template: Story<Props> = () => {
  const [blocks, setBlocks] = useState(BLOCKS)

  const getProps = (name): Pick<Props, 'size' | 'position' | 'onDragStop' | 'onResizeStop'> => {
    const block = blocks[name];

    return {
      size: { width: block.width, height: block.height },
      position: { x: block.x, y: block.y },
      onDragStop: (_e, data) => {
        setBlocks(org => ({ ...org, [name]: { ...data } }));
      },
      onResizeStop: (_e, _d, ref) => {
        setBlocks(
          org => ({
            ...org,
            [name]: {
              ...block,
              width: ref.getBoundingClientRect().width,
              height: ref.getBoundingClientRect().height
            }
          })
        );
      }
    };
  };

  return (
    <>
      {Object.keys(blocks).map((name) => (
        <GridRnd
          key={name}
          {...getProps(name)}
        >
          Rnd
        </GridRnd>
      ))}
    </>
  );
}

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
