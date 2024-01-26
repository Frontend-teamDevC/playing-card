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

  /**
   * プレイヤーの行動に応じた処理を行う関数
   *
   * @param {number} userData - 特定のユーザーの情報
   * @returns {void}
   */
  submitCard(card: Card): void {
    this.hand.push(card)
  }

  /**
   * プレイヤーの行動に応じた処理を行う関数
   *
   * @param {number} userData - 特定のユーザーの情報
   * @returns {GameDecision} - プレイヤーの行動
   */
  promptPlayer(userData?: number): GameDecision {
    return new GameDecision('submit', userData)
  }

  /**
   * プレイヤーの手札の合計値を返す関数
   *
   * @returns {number} - プレイヤーの手札の合計値
   */
  getHandScore(): number {
    return 0
  }
}
