export default class TeamState {
  private _name: string
  private _score: number
  private _timeoutsUsed: number

  constructor(name: string, score = 0, timeoutsUsed = 0) {
    this._name = name
    this._score = Math.max(0, score)
    this._timeoutsUsed = Math.max(0, timeoutsUsed)
  }

  public get name(): string {
    return this._name
  }

  public get score(): number {
    return this._score
  }

  public get timeoutsUsed(): number {
    return this._timeoutsUsed
  }

  public rename(newName: string): void {
    this._name = newName.trim()
  }

  public addPoint(points = 1): void {
    this._score += Math.max(0, points)
  }

  public removePoint(points = 1): void {
    this._score = Math.max(0, this._score - Math.max(0, points))
  }

  public takeTimeout(): void {
    this._timeoutsUsed += 1
  }

  public resetScore(): void {
    this._score = 0
  }

  public resetTimeouts(): void {
    this._timeoutsUsed = 0
  }

  public toJSON() {
    return {
      name: this._name,
      score: this._score,
      timeoutsUsed: this._timeoutsUsed,
    }
  }
}