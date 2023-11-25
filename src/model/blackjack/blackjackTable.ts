import {
  BlackjackBetDenominationType,
  BlackjackStatusType
} from '../../config/blackjackConfig'
import Player from '../common/player'
import Table from '../common/table'
import BlackjackPlayer from './blackjackPlayer'

export default class BlackjackTable extends Table {
  betDenominations: BlackjackBetDenominationType[] = [5, 10, 20, 50, 100]
  dealer: BlackjackPlayer
  constructor(gameType: string) {
    super(gameType)
    this.dealer = new BlackjackPlayer('Dealer', 'dealer', gameType)
    this.players.push(new BlackjackPlayer('Player', 'human', gameType))
    this.players.push(new BlackjackPlayer('AI', 'ai', gameType))
    this.players.push(new BlackjackPlayer('AI', 'ai', gameType))
  }

  assignPlayerHands(): void {
    for (let player of this.players) {
      player.hand.push(this.deck.drawCard())
      player.hand.push(this.deck.drawCard())
    }
    this.dealer.hand.push(this.deck.drawCard())
    this.dealer.hand.push(this.deck.drawCard())
  }

  clearPlayerHandsAndBets(): void {
    for (let player of this.players) {
      player.hand = []
      player.bet = 0
    }
    this.dealer.hand = []
    this.dealer.bet = 0
  }

  evaluateMove(player: Player): void {
    let decision =
      player.type === 'dealer'
        ? player.promptPlayer(-1)
        : player.promptPlayer(0)
    switch (decision.action) {
      case 'wait':
        player.gameStatus = 'waiting'
        break
      case 'bet':
        player.bet += decision.amount!
        player.chips -= decision.amount!
        player.gameStatus = 'waiting'
        break
      case 'hit':
        player.hand.push(this.deck.drawCard())
        break
      case 'stand':
        player.gameStatus = 'stand'
        return
      case 'double':
        player.bet += decision.amount!
        player.chips -= decision.amount!
        player.hand.push(this.deck.drawCard())
        player.gameStatus = 'stand'
        break
      case 'surrender':
        player.gameStatus = 'surrender'
        return
    }

    let score = player.getHandScore()
    if (score === 21) {
      player.gameStatus = player.hand.length === 2 ? 'blackjack' : 'stand'
    } else if (score > 21) {
      player.gameStatus = 'bust'
    } else {
      this.evaluateMove(player)
    }
  }

  evaluateAndGetRoundResults(): string {
    let dealerScore = this.dealer.getHandScore()
    let result = ''
    for (let player of this.players) {
      let playerScore = player.getHandScore()
      if (player.gameStatus === 'surrender') {
        player.chips += player.bet / 2
        result += `${player.name} surrendered. ${
          player.bet / 2
        } chips returned.\n`
      } else if (player.gameStatus === 'blackjack') {
        if (this.dealer.gameStatus === 'blackjack') {
          player.chips += player.bet
          result += `${player.name} pushed.\n`
        } else {
          player.chips += player.bet * 2.5
          result += `${player.name} won ${player.bet * 2.5} chips.\n`
        }
      } else if (this.dealer.gameStatus === 'blackjack') {
        player.chips -= player.bet
        result += `${player.name} lost ${player.bet} chips.\n`
      } else if (playerScore > 21) {
        player.gameStatus = 'bust'
        result += `${player.name} busted.\n`
      } else if (dealerScore > 21) {
        player.chips += player.bet * 2
        result += `${player.name} won ${player.bet * 2} chips.\n`
      } else if (playerScore > dealerScore) {
        player.chips += player.bet * 2
        result += `${player.name} won ${player.bet * 2} chips.\n`
      } else if (playerScore < dealerScore) {
        result += `${player.name} lost ${player.bet} chips.\n`
      } else {
        player.chips += player.bet
        result += `${player.name} pushed.\n`
      }
    }
    return result
  }

  getTurnPlayer(): Player {
    return this.players[this.turnCounter % this.players.length]
  }

  haveTurn(): void {
    if (this.players[0].chips <= 0) {
      this.gamePhase = 'game over'
      return
    } else if (this.gamePhase === 'evaluating') {
      this.gamePhase = 'round over'
      return
    }

    if (this.gamePhase === 'dealer turn') {
      this.dealer.gameStatus = 'acting'
      this.evaluateMove(this.dealer)

      this.gamePhase = 'evaluating'
      this.resultsLog.push(this.evaluateAndGetRoundResults())
      this.clearPlayerHandsAndBets()
      this.turnCounter = 0
      this.gamePhase = 'betting'
      return
    }

    let player = this.getTurnPlayer()
    if (this.isAllPlayerActionsResolved()) {
      this.gamePhase = 'dealer turn'
      this.evaluateMove(this.dealer)
      return
    } else {
      if (player.gameStatus === 'waiting') {
        player.gameStatus = 'acting'
      }
      this.evaluateMove(player)
    }

    if (
      this.onLastPlayer() &&
      player.gameStatus === ('waiting' as BlackjackStatusType)
    ) {
      this.gamePhase = 'acting'
      this.assignPlayerHands()
    }

    this.turnCounter++
  }

  onLastPlayer(): boolean {
    return this.turnCounter === this.players.length - 1
  }

  onFirstPlayer(): boolean {
    return this.turnCounter === 0
  }

  isAllPlayerActionsResolved(): boolean {
    let statusList = ['stand', 'bust', 'surrender', 'blackjack']
    for (let player of this.players) {
      if (!statusList.includes(player.gameStatus)) {
        return false
      }
    }
    return true
  }
}
