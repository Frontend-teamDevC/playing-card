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

  promptPlayer(userData?: number | BlackjackActionType): GameDecision {
    let score = this.getHandScore()

    if (this.type === 'human') {
      return this.gameStatus === 'betting'
        ? new GameDecision('bet', userData as number)
        : new GameDecision(userData as string)
    } else {
      switch (this.gameStatus) {
        case 'betting':
          if (this.type === 'ai') {
            this.bet = Math.floor(Math.random() * this.chips)
            return new GameDecision('bet', this.bet)
          } else {
            return new GameDecision('wait')
          }
        case 'acting':
          if (score < 17) {
            return Math.random() > 0.7
              ? new GameDecision('hit')
              : new GameDecision('double')
          } else {
            return new GameDecision('stand')
          }
        default:
          return new GameDecision('stand')
      }
    }
  }

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
