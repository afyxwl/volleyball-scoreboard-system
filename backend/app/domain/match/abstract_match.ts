import TeamState from '#domain/team/team_state'
import ClockState from '#domain/clock/clock_state'

export type TeamNumber = 1 | 2
/* */
export type BoardTheme = {
  team1Color: string
  team2Color: string
  fontFamily: string
  boardStyle: string
}

export type SetScores = {
  team1: number[]
  team2: number[]
}

export type ShotClockState = {
  seconds: number
  isRunning: boolean
  defaultSeconds: number
}
/**
 * 
 */
export default abstract class AbstractMatch {
  protected _id: number
  protected _screenId: number
  protected _sportType: string
  protected _status: string
  protected _currentSet: number
  protected _isActive: boolean
  protected _theme: BoardTheme
  protected _setScores: SetScores
  protected _shotClock: ShotClockState
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
    theme?: Partial<BoardTheme>
    setScores?: Partial<SetScores> | null
    shotClock?: Partial<ShotClockState>
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
    this._theme = {
  team1Color: params.theme?.team1Color ?? '#67e8f9',
  team2Color: params.theme?.team2Color ?? '#fda4af',
  fontFamily: params.theme?.fontFamily ?? 'system',
  boardStyle: params.theme?.boardStyle ?? 'neon',
}

this._setScores = {
  team1: [...(params.setScores?.team1 ?? [])],
  team2: [...(params.setScores?.team2 ?? [])],
}

this._shotClock = {
  seconds: params.shotClock?.seconds ?? 24,
  isRunning: params.shotClock?.isRunning ?? false,
  defaultSeconds: params.shotClock?.defaultSeconds ?? 24,
}
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

  public get theme(): BoardTheme {
  return this._theme
}

public get setScores(): SetScores {
  return this._setScores
}

public get shotClock(): ShotClockState {
  return this._shotClock
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
  if (this._sportType === 'basketball') {
  this._shotClock.isRunning = true
}
  }

  public endPeriod(): void {
    this._status = 'paused'
    this._clock.pause()
    this._shotClock.isRunning = false
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
    this._setScores = { team1: [], team2: [] }
    this._shotClock = { seconds: 24, isRunning: false, defaultSeconds: 24 }
  }


public setTheme(theme: Partial<BoardTheme>): void {
  this._theme = {
    ...this._theme,
    ...theme,
  }
}


public setSetScores(setScores: Partial<SetScores>): void {
  this._setScores = {
    team1: [...(setScores.team1 ?? this._setScores.team1)],
    team2: [...(setScores.team2 ?? this._setScores.team2)],
  }
}

public setShotClock(seconds: number, isRunning = this._shotClock.isRunning): void {
  const safeSeconds = Math.max(0, Math.min(99, Math.floor(seconds)))
  this._shotClock = {
    ...this._shotClock,
    seconds: safeSeconds,
    isRunning,
  }
}


  public abstract addPoint(team: TeamNumber): void
  public abstract removePoint(team: TeamNumber): void
  public abstract takeTimeout(team: TeamNumber): void

serializeForScreen() {
  return {
    id: this.id,
    screenId: this.screenId,
    sportType: this.sportType,
    status: this.status,
    currentSet: this.currentSet,
    isActive: this.isActive,
    clock: {
      time: this.clock.time,
      isRunning: this.clock.isRunning,
    },
    team1: {
      name: this.team1.name,
      score: this.team1.score,
      fouls: this.team1.fouls,
      timeoutsUsed: this.team1.timeoutsUsed,
    },
    team2: {
      name: this.team2.name,
      score: this.team2.score,
      fouls: this.team2.fouls,
      timeoutsUsed: this.team2.timeoutsUsed,
    },
    shotClock: {
      seconds: this.shotClock.seconds,
      isRunning: this.shotClock.isRunning,
      defaultSeconds: this.shotClock.defaultSeconds,
    },

    theme: {
      team1Color: this.theme.team1Color,
      team2Color: this.theme.team2Color,
      fontFamily: this.theme.fontFamily,
      boardStyle: this.theme.boardStyle,
    },

    setScores: {
      team1: this.setScores.team1,
      team2: this.setScores.team2,
    },
  }

  }
}