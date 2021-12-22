export default () => {
  const visited = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (visited.has(value)) return `@${value.constructor.name}`;
      visited.add(value);
    }
    return value;
  };
};
