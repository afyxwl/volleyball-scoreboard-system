import TeamState from '#domain/team/team_state'
import ClockState from '#domain/clock/clock_state'

export type TeamNumber = 1 | 2

export default abstract class AbstractMatch {
  protected _id: number
  protected _screenId: number
  protected _sportType: string
  protected _status: string
  protected _currentSet: number
  protected _isActive: boolean

  protected _team1: TeamState
  protected _team2: TeamState
  protected _clock: ClockState

  constructor(params: {
    id: number
    screenId: number
    sportType: string
    status: string
    currentSet: number
    isActive: boolean
    team1: TeamState
    team2: TeamState
    clock: ClockState
  }) {
    this._id = params.id
    this._screenId = params.screenId
    this._sportType = params.sportType
    this._status = params.status
    this._currentSet = params.currentSet
    this._isActive = params.isActive
    this._team1 = params.team1
    this._team2 = params.team2
    this._clock = params.clock
  }

  public get id(): number {
    return this._id
  }

  public get screenId(): number {
    return this._screenId
  }

  public get sportType(): string {
    return this._sportType
  }

  public get status(): string {
    return this._status
  }

  public get currentSet(): number {
    return this._currentSet
  }

  public get isActive(): boolean {
    return this._isActive
  }

  public get team1(): TeamState {
    return this._team1
  }

  public get team2(): TeamState {
    return this._team2
  }

  public get clock(): ClockState {
    return this._clock
  }

  protected getTeam(team: TeamNumber): TeamState {
    return team === 1 ? this._team1 : this._team2
  }

  public renameTeam(team: TeamNumber, newName: string): void {
    this.getTeam(team).rename(newName)
  }

  public setClockTime(time: string | null): void {
    this._clock.setTime(time)
  }

  public startPeriod(): void {
    this._status = 'live'
    this._isActive = true
    this._clock.start()
  }

  public endPeriod(): void {
    this._status = 'paused'
    this._clock.pause()
  }

  public nextSet(): void {
    this._currentSet += 1
  }

  public resetMatch(): void {
    this._team1.resetScore()
    this._team2.resetScore()
    this._team1.resetTimeouts()
    this._team2.resetTimeouts()
    this._currentSet = 1
    this._status = 'draft'
    this._isActive = false
    this._clock.reset()
  }

  public abstract addPoint(team: TeamNumber): void
  public abstract removePoint(team: TeamNumber): void
  public abstract takeTimeout(team: TeamNumber): void

  public serializeForScreen() {
    return {
      id: this._id,
      screenId: this._screenId,
      sportType: this._sportType,
      status: this._status,
      currentSet: this._currentSet,
      isActive: this._isActive,
      clock: this._clock.toJSON(),
      team1: this._team1.toJSON(),
      team2: this._team2.toJSON(),
    }
  }
}