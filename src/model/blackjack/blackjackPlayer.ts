import {
  BlackjackActionType,
  BlackjackStatusType
} from '../../config/blackjackConfig'
import GameDecision from '../common/gameDecision'
import Player from '../common/player'

export default class BlackjackPlayer extends Player {
  gameStatus: BlackjackStatusType

  constructor(
    name: string,
    type: string,
    gameType: string,
    chips: number = 100
  ) {
    super(name, type, gameType, chips)
    this.gameStatus = this.type === 'dealer' ? 'waiting' : 'betting'
  }

  /**
   * プレイヤーの行動に応じた処理を行う関数
   *
   * @param userData  - 特定のユーザーの情報
   * @returns
   */
  promptPlayer(userData?: number | BlackjackActionType): GameDecision {
    let score = this.getHandScore()
    if (this.type === 'human') {
      return this.gameStatus === 'betting'
        ? new GameDecision('bet', userData as number)
        : new GameDecision(userData as BlackjackActionType, this.bet)
    } else {
      switch (this.gameStatus) {
        case 'betting':
          // if (this.type === 'ai') {
          // 掛け金は５刻みでランダムに決定
          return new GameDecision(
            'bet',
            Math.floor((Math.random() * this.chips) / 10 + 1) * 5
          )
        // }
        // else {
        //   return new GameDecision('wait')
        // }
        case 'acting':
          const rand = Math.random()

          switch (this.name) {
            case 'CPU: easy':
              return new GameDecision('stand')

            case 'CPU: normal':
              return rand > 0.5
                ? new GameDecision('hit')
                : new GameDecision('stand')
            case 'CPU: hard':
              if (score < 18) {
                return rand > 0.9 && this.chips > this.bet
                  ? new GameDecision('double', this.bet)
                  : new GameDecision('hit')
              } else {
                return new GameDecision('stand')
              }
            default:
              if (score < 17) {
                return new GameDecision('hit')
              } else {
                return new GameDecision('stand')
              }
          }
      }
    }
    return new GameDecision('stand')
  }

  /**
   * プレイヤーの手札の合計値を返す関数
   *
   * @returns {number} - プレイヤーの手札の合計値
   */
  getHandScore(): number {
    let score = 0
    let aceCount = 0
    for (let card of this.hand) {
      if (card.rank === 'A') {
        aceCount++
        score += 11
      } else if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') {
        score += 10
      } else {
        score += parseInt(card.rank)
      }
    }
    while (score > 21 && aceCount > 0) {
      score -= 10
      aceCount--
    }
    return score
  }
}
