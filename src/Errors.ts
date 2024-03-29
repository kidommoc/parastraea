export class CodedError extends Error {
    constructor(readonly code: number, msg: string) {
        // copied-pasted code about js inheritance
        super(msg)
        const proto = new.target.prototype
        if (Object.setPrototypeOf)
            Object.setPrototypeOf(this, proto)
        else
            (this as any).__proto__ = proto
        Error.captureStackTrace(this)
    }

    public toString(): string {
        return JSON.stringify({
            code: this.code,
            message: this.message
        })
    }
}

export default { CodedError }