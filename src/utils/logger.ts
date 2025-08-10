// Centralized development flag
export const isDevMode = import.meta.env.DEV;

// Dev Mode Only console.log's
export const devLog = (...args: any[]) => {
  if (isDevMode) console.log(...args);
};

// Dev Mode Only console.error's
export const devError = (...args: any[]) => {
  if (isDevMode) console.error(...args);
};

// Dev Mode Only console.info's
export const devWarn = (...args: any[]) => {
  if (isDevMode) console.warn(...args);
};

// Production console.error's -- Be Selective
export const prodError = (...args: any[]) => {
  console.error(...args);
};