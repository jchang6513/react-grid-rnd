export const createGridWith = (gridSize: number) => {
  if (gridSize <= 0) {
    throw new Error('Grid Size must greater than 0');
  }
  return (num: number) => Math.round(Number(num) / gridSize) * gridSize;
};
