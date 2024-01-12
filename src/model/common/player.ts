import {
  BlackjackActionType,
  BlackjackStatusType
} from '../../config/blackjackConfig'
import { PokerActionType, PokerStatusType } from '../../config/pokerConfig'
import { SpeedStatusType } from '../../config/speedConfig'
import pokerPlayer from '../poker/pokerPlayer'
import Card from './card'
import GameDecision from './gameDecision'

export default abstract class Player {
  name: string
  type: string
  gameType: string
  gameStatus: BlackjackStatusType | PokerStatusType | SpeedStatusType = ''
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

  /*
  promptPlayer(userData?: number | BlackjackActionType): GameDecision
  プレイヤーのゲーム内での行動を返す
  */
  abstract promptPlayer(
    userData?: number | BlackjackActionType | PokerActionType
  ): GameDecision

  /*
  getHandScore(): number
  手札の合計スコアを計算して返す
  */
  abstract getHandScore(player? : pokerPlayer): number
}
