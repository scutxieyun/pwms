import winston from 'winston'
let logger = winston.createLogger({
  level: 'silly',
  format: winston.format.simple(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console()
  ]

})
export function getLogger() {
  return logger
}