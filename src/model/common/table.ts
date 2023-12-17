import Deck from './deck'
import Player from './player'

export default abstract class Table {
  gameType: string
  turnCounter: number = 0
  roundCounter: number = 0
  gamePhase: string = ''
  resultsLog: string[] = []
  deck: Deck
  players: Player[] = []

  constructor(gameType: string) {
    this.gameType = gameType

    this.deck = new Deck(this.gameType)
  }

  abstract assignPlayerHands(): void
  abstract evaluateMove(player: Player): void
  // abstract evaluateAndGetRoundResults(): string
  // abstract getTurnPlayer(): Player
  // abstract haveTurn(userData?: number | string): void
}
