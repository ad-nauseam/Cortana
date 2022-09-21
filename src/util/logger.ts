function init(open: number) {
  return function (str: string) {
    return `\x1b[${open}m${str}\x1b[0m`;
  };
}
const Colors = {
  bold: init(1),
  underline: init(4),
  black: init(30),
  red: init(31),
  green: init(32),
  magenta: init(35),
};

export class Logger {
  colors = Colors;

  log({ content, erase }: { content: string | string[]; erase: boolean }, ...colors: (keyof typeof Colors)[]) {
    if (erase) console.clear();
    if (!Array.isArray(content)) content = [content];
    content.forEach(str =>
      console.log(`[${new Date().toLocaleTimeString()}] :: ${colors.reduce((a, c) => Colors[c](a), str)}`),
    );
  }

  success(content: string | string[], erase = false) {
    return this.log({ content, erase }, 'green');
  }

  error(content: string | string[], erase = false) {
    return this.log({ content, erase }, 'red', 'bold');
  }

  debug(content: string | string[], erase = false) {
    return this.log({ content, erase }, 'magenta');
  }
}
