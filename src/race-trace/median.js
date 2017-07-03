
function median(values) {
  if (values.length === 0) {
    return undefined;
  }
  if (values.length % 2 === 1) {
    return values[(values.length - 1) / 2];
  }
  return (values[values.length / 2] + values[(values.length / 2) - 1]) / 2;
}

export default median;
