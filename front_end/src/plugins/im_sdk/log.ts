export default class Log {
    public on: boolean
    public setOn: any
    public getOn: any
    public error: any
    public warn: any
    public info: any
    public debug: any

    constructor(on: boolean = true) {
        this.on = on
        this.setOn = (onFlag: any) => {
            this.on = onFlag
        }

        this.getOn = () => {
            return this.on
        }

        this.error = (logStr: any) => {
            try {
                this.on && console.error(logStr)
            } catch (e) {}
        }
        this.warn = (logStr: any) => {
            try {
                this.on && console.warn(logStr)
            } catch (e) {}
        }
        this.info = (logStr: any) => {
            try {
                this.on && console.info(logStr)
            } catch (e) {}
        }
        this.debug = (logStr: any) => {
            try {
                this.on && console.debug(logStr)
            } catch (e) {}
        }
    }
}