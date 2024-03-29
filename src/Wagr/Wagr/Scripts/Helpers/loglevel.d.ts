﻿declare module loglevel {
    export interface LogLevel {
        TRACE: 0;
        DEBUG: 1;
        INFO: 2;
        WARN: 3;
        ERROR: 4;
        SILENT: 5;
    }

    type LogLevelNumbers = LogLevel[keyof LogLevel];

    type LogLevelDesc = LogLevelNumbers
        | 'trace'
        | 'debug'
        | 'info'
        | 'warn'
        | 'error'
        | 'silent'
        | keyof LogLevel;

    type LoggingMethod = (...message: any[]) => void;

    type MethodFactory = (methodName: string, level: LogLevelNumbers, loggerName: string | symbol) => LoggingMethod;

    export interface Logger {
        /**
         * Available log levels.
         */
        readonly levels: LogLevel;

        /**
         * Plugin API entry point. This will be called for each enabled method each time the level is set
         * (including initially), and should return a MethodFactory to be used for the given log method, at the given level,
         * for a logger with the given name. If you'd like to retain all the reliability and features of loglevel, it's
         * recommended that this wraps the initially provided value of log.methodFactory
         */
        methodFactory: MethodFactory;

        /**
         * Output trace message to console.
         * This will also include a full stack trace
         *
         * @param msg any data to log to the console
         */
        trace(...msg: any[]): void;

        /**
         * Output debug message to console including appropriate icons
         *
         * @param msg any data to log to the console
         */
        debug(...msg: any[]): void;

        /**
         * Output debug message to console including appropriate icons
         *
         * @param msg any data to log to the console
         */
        log(...msg: any[]): void;

        /**
         * Output info message to console including appropriate icons
         *
         * @param msg any data to log to the console
         */
        info(...msg: any[]): void;

        /**
         * Output warn message to console including appropriate icons
         *
         * @param msg any data to log to the console
         */
        warn(...msg: any[]): void;

        /**
         * Output error message to console including appropriate icons
         *
         * @param msg any data to log to the console
         */
        error(...msg: any[]): void;

        /**
         * This disables all logging below the given level, so that after a log.setLevel("warn") call log.warn("something")
         * or log.error("something") will output messages, but log.info("something") will not.
         *
         * @param level as a string, like 'error' (case-insensitive) or as a number from 0 to 5 (or as log.levels. values)
         * @param persist Where possible the log level will be persisted. LocalStorage will be used if available, falling
         *     back to cookies if not. If neither is available in the current environment (i.e. in Node), or if you pass
         *     false as the optional 'persist' second argument, persistence will be skipped.
         */
        setLevel(level: LogLevelDesc, persist?: boolean): void;

        /**
         * Returns the current logging level, as a value from LogLevel.
         * It's very unlikely you'll need to use this for normal application logging; it's provided partly to help plugin
         * development, and partly to let you optimize logging code as below, where debug data is only generated if the
         * level is set such that it'll actually be logged. This probably doesn't affect you, unless you've run profiling
         * on your code and you have hard numbers telling you that your log data generation is a real performance problem.
         */
        getLevel(): LogLevel[keyof LogLevel];

        /**
         * This sets the current log level only if one has not been persisted and can’t be loaded. This is useful when
         * initializing scripts; if a developer or user has previously called setLevel(), this won’t alter their settings.
         * For example, your application might set the log level to error in a production environment, but when debugging
         * an issue, you might call setLevel("trace") on the console to see all the logs. If that error setting was set
         * using setDefaultLevel(), it will still say as trace on subsequent page loads and refreshes instead of resetting
         * to error.
         *
         * The level argument takes is the same values that you might pass to setLevel(). Levels set using
         * setDefaultLevel() never persist to subsequent page loads.
         *
         * @param level as a string, like 'error' (case-insensitive) or as a number from 0 to 5 (or as log.levels. values)
         */
        setDefaultLevel(level: LogLevelDesc): void;

        /**
         * This resets the current log level to the default level (or `warn` if no explicit default was set) and clears
         * the persisted level if one was previously persisted.
         */
        resetLevel(): void;

        /**
         * This enables all log messages, and is equivalent to log.setLevel("trace").
         *
         * @param persist Where possible the log level will be persisted. LocalStorage will be used if available, falling
         *     back to cookies if not. If neither is available in the current environment (i.e. in Node), or if you pass
         *     false as the optional 'persist' second argument, persistence will be skipped.
         */
        enableAll(persist?: boolean): void;

        /**
         * This disables all log messages, and is equivalent to log.setLevel("silent").
         *
         * @param persist Where possible the log level will be persisted. LocalStorage will be used if available, falling
         *     back to cookies if not. If neither is available in the current environment (i.e. in Node), or if you pass
         *     false as the optional 'persist' second argument, persistence will be skipped.
         */
        disableAll(persist?: boolean): void;
    }
}