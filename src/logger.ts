/**
 * 统一日志工具
 * 禁止在业务代码中使用 console.log，统一通过 logger 输出。
 * 生产环境可通过 LEVEL 控制输出级别。
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

// 默认 debug，便于 Demo 阶段排查；接入生产时可改为 info
const CURRENT_LEVEL: LogLevel = 'debug';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

const TAG = '[情绪旷野]';

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[CURRENT_LEVEL];
}

function format(level: LogLevel, message: string, context?: unknown): string {
  const ts = new Date().toISOString();
  const ctxStr = context !== undefined ? ` ${JSON.stringify(context)}` : '';
  return `${ts} ${TAG} ${level.toUpperCase()} ${message}${ctxStr}`;
}

export const logger = {
  debug(message: string, context?: unknown): void {
    if (shouldLog('debug')) {
      // eslint-disable-next-line no-console
      console.debug(format('debug', message, context));
    }
  },
  info(message: string, context?: unknown): void {
    if (shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(format('info', message, context));
    }
  },
  warn(message: string, context?: unknown): void {
    if (shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(format('warn', message, context));
    }
  },
  error(message: string, context?: unknown): void {
    if (shouldLog('error')) {
      // eslint-disable-next-line no-console
      console.error(format('error', message, context));
    }
  },
};
