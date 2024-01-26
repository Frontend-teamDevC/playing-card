import Card from './warCard'
import Player from './warPlayer'

export default class WarTable {
  public user: Player
  public gameType: string
  public gamePhase: string
  public players: Player[] = []
  public temp: Card[] | undefined = []

  constructor(gameType: string, name: string) {
    this.user = new Player(name, 'player')
    this.gameType = gameType
    this.gamePhase = 'initialize'
    this.players.push(new Player('DEALER', 'dealer'), this.user)
  }

  /**
   * 手札を配る関数
   * @returns {void}
   */
  public assignHand(): void {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 3; j++) {
        this.players[i].hand[j] = this.players[i].deck.drawOne()
      }
    }
  }
}
