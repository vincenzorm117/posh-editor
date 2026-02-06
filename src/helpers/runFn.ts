const runFn = (fn: unknown, ...args: any[]): any => {
  if (typeof fn === 'function') {
    return fn(...args);
  }
  return undefined;
};

export default runFn;
