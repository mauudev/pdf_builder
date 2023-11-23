class Logger {
  static debug(message: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  }

  static warning(message: string): void {
    console.warn(message);
  }

  static error(error: string): void {
    console.error(error);
  }
}

export default Logger;
