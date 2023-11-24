import {
  BlackjackActionType,
  BlackjackStatusType
} from '../../config/blackjackConfig'
import { PokerActionType, PokerStatusType } from '../../config/pokerConfig'
import Card from './card'
import GameDecision from './gameDecision'

export default abstract class Player {
  name: string
  type: string
  gameType: string
  gameStatus: BlackjackStatusType | PokerStatusType = ''
  chips: number
  bet: number = 0
  winAmount: number = 0
  hand: Card[] = []

  constructor(
    name: string,
    type: string,
    gameType: string,
    chips: number = 100
  ) {
    this.name = name
    this.type = type
    this.gameType = gameType
    this.chips = chips
  }

  abstract promptPlayer(
    userData?: number | BlackjackActionType | PokerActionType
  ): GameDecision

  abstract getHandScore(): number
}
