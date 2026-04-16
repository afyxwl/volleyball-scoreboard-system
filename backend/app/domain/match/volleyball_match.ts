import AbstractMatch, { TeamNumber } from '#domain/match/abstract_match'

export default class VolleyballMatch extends AbstractMatch {
  private readonly maxTimeoutsPerTeam = 2

  public addPoint(team: TeamNumber): void {
    this.getTeam(team).addPoint(1)
  }

  public removePoint(team: TeamNumber): void {
    this.getTeam(team).removePoint(1)
  }

  public takeTimeout(team: TeamNumber): void {
    const selectedTeam = this.getTeam(team)

    if (selectedTeam.timeoutsUsed >= this.maxTimeoutsPerTeam) {
      throw new Error(`Team ${team} has no timeouts left`)
    }

    selectedTeam.takeTimeout()
  }
}