import { SpeedPlayerType, SpeedStatusType } from '../../config/speedConfig'
import Card from '../common/card'
import GameDecision from '../common/gameDecision'
import Player from '../common/player'

export default class SpeedPlayer extends Player {
  gameStatus: SpeedStatusType
  dividedDeck: Card[] = []

  constructor(name: string, type: SpeedPlayerType, gameType: string) {
    super(name, type, gameType)
    this.gameStatus = 'cannot submit'
  }

  submitCard(card: Card): void {
    this.hand.push(card)
  }

  promptPlayer(userData?: number): GameDecision {
    return new GameDecision('submit', userData)
  }

  getHandScore(): number {
    return 0
  }
}
