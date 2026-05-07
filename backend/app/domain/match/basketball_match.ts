import AbstractMatch, { TeamNumber } from '#domain/match/abstract_match'

export default class BasketballMatch extends AbstractMatch {
  public addPoint(team: TeamNumber): void {
    this.getTeam(team).addPoint(1)
  }

  public removePoint(team: TeamNumber): void {
    this.getTeam(team).removePoint(1)
  }

  public takeTimeout(team: TeamNumber): void {
    this.getTeam(team).takeTimeout()
  }
}