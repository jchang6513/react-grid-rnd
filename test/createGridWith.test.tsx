import { createGridWith } from '../src/utils/createGridWith';

describe('Create Grid With', () => {
  it('Size greater than 0', () => {
    const grid = createGridWith(20);

    expect(grid(15)).toEqual(20);
    expect(grid(143)).toEqual(140);
  });

  it('Size less than 0', () => {
    expect(() => createGridWith(-5)).toThrow();
  });

  it('Size equal to 0', () => {
    expect(() => createGridWith(0)).toThrow();
  });
});
