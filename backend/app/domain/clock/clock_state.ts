export default class ClockState {
  private _time: string | null
  private _isRunning: boolean

  constructor(time: string | null = null, isRunning = false) {
    this._time = time
    this._isRunning = isRunning
  }

  public get time(): string | null {
    return this._time
  }

  public get isRunning(): boolean {
    return this._isRunning
  }

  public setTime(time: string | null): void {
    this._time = time
  }

  public start(): void {
    this._isRunning = true
  }

  public pause(): void {
    this._isRunning = false
  }

  public reset(): void {
    this._time = null
    this._isRunning = false
  }

  public toJSON() {
    return {
      time: this._time,
      isRunning: this._isRunning,
    }
  }
}