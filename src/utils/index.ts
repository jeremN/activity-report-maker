export const isFunction = (functionToCheck: (...args: any) => unknown): boolean =>
	functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
