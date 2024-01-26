import {
  BlackjackActionType,
  BlackjackBetDenominationType,
  BlackjackStatusType
} from '../../config/blackjackConfig'
import Player from '../common/player'
import Table from '../common/table'
import BlackjackPlayer from './blackjackPlayer'

export default class BlackjackTable extends Table {
  user: BlackjackPlayer
  betDenominations: BlackjackBetDenominationType[] = [5, 10, 20, 50, 100]
  dealer: BlackjackPlayer
  roundCount: number = 0
  difficulty: string
  maxRounds: number
  constructor(
    gameType: string,
    name: string,
    difficulty: string,
    maxRounds: number
  ) {
    super(gameType)
    this.gamePhase = 'betting'
    this.difficulty = difficulty
    this.maxRounds = maxRounds

    this.user = new BlackjackPlayer(name, 'human', gameType)
    this.dealer = new BlackjackPlayer('Dealer', 'dealer', gameType)

    const aiChips = difficulty === 'hard' ? 150 : 100
    this.players.push(this.user)
    this.players.push(
      new BlackjackPlayer(`CPU: ${difficulty}`, 'ai', gameType, aiChips)
    )
    this.players.push(
      new BlackjackPlayer(`CPU: ${difficulty}`, 'ai', gameType, aiChips)
    )
  }
  /**
   * プレイヤーに手札を配る関数
   *
   * @returns {void}
   */
  assignPlayerHands(): void {
    for (let player of this.players) {
      player.hand.push(this.deck.drawCard())
      player.hand.push(this.deck.drawCard())
    }
    this.dealer.hand.push(this.deck.drawCard())
    this.dealer.hand.push(this.deck.drawCard())
  }

  /**
   * ラウンド終了時に情報をリセットする関数
   *
   * @returns {void}
   */
  resetRoundInfo(): void {
    this.gamePhase = 'betting'
    for (let player of this.players) {
      player.hand = []
      player.bet = 0
    }
    this.dealer.hand = []
    this.dealer.bet = 0

    this.turnCounter = 0
    this.dealer.gameStatus = 'waiting'
    for (let player of this.players) {
      player.gameStatus = 'betting'
    }

    this.roundCount++
  }

  /**
   * プレイヤーの行動に応じた処理を行う関数
   *
   * @param {Player} player - プレイヤー
   * @param {number} userData - 特定のユーザーの情報
   * @returns {void}
   */
  evaluateMove(player: Player, userData?: number | BlackjackActionType): void {
    if (player.gameStatus === '') {
      player.gameStatus =
        player.getHandScore() === 21 && player.hand.length === 2
          ? 'blackjack'
          : (player.getHandScore() as number) > 21
            ? 'bust'
            : 'stand'
      return
    }

    let decision =
      player.type === 'dealer'
        ? player.promptPlayer()
        : player.promptPlayer(userData)
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
        player.gameStatus = player.type === 'human' ? 'double' : ''
        break
      case 'surrender':
        player.bet = Math.floor(player.bet / 2)
        player.chips += player.bet
        player.gameStatus = 'surrender'
        return
    }

    if (player.type === 'ai') return

    let score = player.getHandScore() as number
    if (score === 21) {
      player.gameStatus = player.hand.length === 2 ? 'blackjack' : 'stand'
      return
    } else if (score > 21) {
      player.gameStatus = 'bust'
      return
    }
  }

  /**
   * ラウンド終了時の勝敗結果を返す関数
   * @returns {string} - ラウンド終了時の勝敗結果
   */
  evaluateAndGetRoundResults(): string {
    let dealerScore = this.dealer.getHandScore()
    let result = ''
    for (let player of this.players) {
      let playerScore = player.getHandScore() as number
      if (player.gameStatus === 'surrender') {
        result += `${player.name} surrendered. ${player.bet} chips returned.\n`
      } else if (player.gameStatus === 'blackjack') {
        if (this.dealer.gameStatus === 'blackjack') {
          // player.chips += player.bet
          result += `${player.name} pushed.\n`
        } else {
          player.chips += player.bet * 2.5
          result += `${player.name} won ${player.bet * 2.5} chips.\n`
        }
      } else if (this.dealer.gameStatus === 'blackjack') {
        result += `${player.name} lost ${player.bet} chips.\n`
      } else if (playerScore > 21) {
        player.gameStatus = 'bust'
        result += `${player.name} busted.\n`
      } else if (dealerScore > 21) {
        player.chips += player.bet
        result += `${player.name} won ${player.bet * 2} chips.\n`
      } else if (playerScore > dealerScore) {
        player.chips += player.bet
        result += `${player.name} won ${player.bet * 2} chips.\n`
      } else if (playerScore < dealerScore) {
        result += `${player.name} lost ${player.bet} chips.\n`
      } else {
        // player.chips += player.bet
        result += `${player.name} pushed.\n`
      }
    }

    if (this.roundCount === this.maxRounds) {
      this.evaluateAndGetFinalResults()
    }
    if (this.players[0].chips <= 0) {
      this.gamePhase = 'game over'
    }

    return result
  }

  /**
   * ゲームの最終結果を返す関数
   *
   * @returns {string} - ゲームの最終結果
   */
  evaluateAndGetFinalResults(): string {
    // rank players by chips, 1st, 2nd, 3rd
    let sortedPlayers = this.players.sort((a, b) => b.chips - a.chips)
    let result = ''

    for (let i = 0; i < sortedPlayers.length; i++) {
      result += i === 0 ? `${i + 1}st: ` : i === 1 ? `${i + 1}nd: ` : `3rd: `
      result += `${sortedPlayers[i].name} with ${sortedPlayers[i].chips} chips.\n`
    }

    return result
  }

  /**
   * 現在のプレイヤーを返す関数
   *
   * @returns {Player} - 現在のターンプレイヤー
   */
  getTurnPlayer(): Player {
    return this.players[this.turnCounter % this.players.length]
  }

  /**
   * プレイヤーのターンを進める関数
   *
   * @param {number} userData - 特定のユーザーの情報
   * @returns {void}
   */
  haveTurn(userData?: number | BlackjackActionType): void {
    if (this.gamePhase === 'dealer turn') {
      if (this.playerActionResolved(this.dealer)) {
        this.gamePhase = 'evaluating'
        this.evaluateMove(this.dealer)
      } else {
        this.evaluateMove(this.dealer)
      }
    }

    if (this.gamePhase === 'evaluating') {
      this.resultsLog.push(this.evaluateAndGetRoundResults())
      return
    }

    let player = this.getTurnPlayer()
    if (this.allPlayerActionsResolved()) {
      this.gamePhase = 'dealer turn'
      return
    } else {
      if (player.gameStatus === 'waiting') {
        player.gameStatus = 'acting'
      }
      this.evaluateMove(player, userData)
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

  /**
   *　プレイヤーがプレイヤー配列の中で最後の要素かどうかを返す関数
   *
   * @returns {boolean} - プレイヤーがプレイヤー配列の中で最後の要素かどうか
   */
  onLastPlayer(): boolean {
    return this.turnCounter === this.players.length - 1
  }

  /**
   * プレイヤーの行動が完了したかどうかを返す関数
   *
   * @param {Player} player - プレイヤー
   * @returns {boolean} - プレイヤーの行動が完了したかどうか
   */
  playerActionResolved(player: Player): boolean {
    return (
      player.gameStatus === 'double' ||
      player.gameStatus === 'bust' ||
      player.gameStatus === 'stand' ||
      player.gameStatus === 'surrender' ||
      player.gameStatus === 'blackjack'
    )
  }

  /**
   * 全プレイヤーの行動が完了したかどうかを返す関数
   *
   * @returns {boolean} - 全プレイヤーの行動が完了したかどうか
   */
  allPlayerActionsResolved(): boolean {
    for (let player of this.players) {
      if (!this.playerActionResolved(player)) {
        return false
      }
    }
    return true
  }
}
