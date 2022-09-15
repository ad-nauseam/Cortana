function init(open: number) {
  return function (str: string) {
    return `\x1b[${open}m${str}\x1b[0m`;
  };
}
const Colors = {
  bold: init(1),
  black: init(30),
  red: init(31),
  green: init(32),
  magenta: init(35),
};

export class Logger {
  log({ content, erase }: { content: string; erase: boolean }, ...colors: (keyof typeof Colors)[]) {
    if (erase) console.clear();
    return console.log(`[${new Date().toLocaleTimeString()}] ${colors.reduce((a, c) => Colors[c](a), content)}`);
  }

  success(content: string, erase = false) {
    return this.log({ content, erase }, 'green');
  }

  error(content: string, erase = false) {
    return this.log({ content, erase }, 'red', 'bold');
  }

  debug(content: string, erase = false) {
    return this.log({ content, erase }, 'magenta');
  }

  test({ content, erase = false }: { content: string; erase?: boolean }) {
    return this.log({ content, erase }, 'magenta');
  }
}
