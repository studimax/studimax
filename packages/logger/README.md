# @studimax/logger
A logger system with configurable transporters.

## Installation
```bash
npm install @studimax/logger
# or
yarn add @studimax/logger
```

## Description
The logger system is a simple and flexible logging system.
It is designed to be used in a modular way, so that you can easily add new transports.

```txt
2021-12-22 13:23:58.47	<error>	Logger.spec.ts:5	(Object.<anonymous>)    log1 {"hello":"world"}
```

## Usage
```ts
import Logger from '@studimax/logger';

const logger = Logger({
    transports: [Logger.TRANSPORTS.CONSOLE_LOG(), Logger.TRANSPORTS.DATED_LOG()],
    levels: {
        extra: {
            color: '#ff0000',
            level: 1,
        },
    },
});
logger.info('Hello World!');
logger.extra('Extra!');
```
## Logger default options
```ts
import Logger from '@studimax/logger';
Logger({
    format: '{timestamp}\t<{level.name}>\t{file}:{line}\t({method})\t{message} {metadata}', //see format docs
    dateFormat: 'YYYY-MM-DD HH:mm:ss.SS', // use fecha to format date
    logFolder: 'logs',
    logHistory: 100, // keep 100 logs
    transports: [], // by default, no transports
    transportTimeout: 1000, // timeout for transports
    levels: {}, // by default, use default levels but can be overridden
})
```
### Default Levels
The color is used to display the level name in the console.

| Description | Level | Tag   | Color                                                                     |
|:------------|:------|:------|:--------------------------------------------------------------------------|
| Trace       | 0     | trace | ![#0099ff](https://via.placeholder.com/15/0099ff/000000?text=+) `#0099ff` |
| Debug       | 1     | debug | ![#00cc99](https://via.placeholder.com/15/00cc99/000000?text=+) `#00cc99` |
| Info        | 2     | info  | ![#00cc30](https://via.placeholder.com/15/00cc30/000000?text=+) `#00cc30` |
| Warn        | 3     | warn  | ![#ffcc00](https://via.placeholder.com/15/ffcc00/000000?text=+) `#ffcc00` |
| Error       | 4     | error | ![#ff0000](https://via.placeholder.com/15/ff0000/000000?text=+) `#ff0000` |
| Fatal       | 5     | fatal | ![#a70000](https://via.placeholder.com/15/a70000/000000?text=+) `#a70000` |

### Custom Levels
```ts
const levels = {
    myCustomTag: {
        color: '#ff0000',
        level: 1
    }
}
```

### Custom Format
Format is a string that can contain the following placeholders:
- `{timestamp}`: the timestamp of the log formatted with the `dateFormat` option
- `{level}`: level object containing `name`, `level` and `color`
- `{file}`: the file where the log was called
- `{line}`: the line where the log was called
- `{method}`: the method where the log was called
- `{message}`: the message of the log
- `{metadata}`: the metadata object passed to the log

You can use the dot notation `.` to access nested properties. For example, `{metadata.foo}` will access the `foo` property of the `metadata` object.
See [@studimax/ts](https://www.npmjs.com/package/@studimax/ts) package for more information.

## Transporters
This package provides the following transporters:
### CONSOLE_LOG
This transporter logs to the console.
### DATED_LOG
This transporter logs to a file with a date prefix. The file is created if it doesn't exist.
This transporter implements the FIFO strategy, first log is the first to be written.
### NAMED_LOG
This transporter logs to a file with a name prefix.
### Custom Transporter
You can create your own transporters by creating an async function.
```ts
async function MyCustomTransporter(data: Data, options: TransportOptions) {
    if(await options.transportReady){
        // do something when the same previous logs transport has been resolved.
        console.log(data.message);
    }
}
```
`TransportOptions` extends `LoggerOptions` ans add more properties:
- `ready`: a promise that is resolved when all previous logs transports have been resolved.
- `transportReady`: a promise that is resolved when the same previous logs transport has been resolved.
