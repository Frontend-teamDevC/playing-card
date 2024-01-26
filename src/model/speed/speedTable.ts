import Card from '../common/card'
import Player from '../common/player'
import Table from '../common/table'
import SpeedPlayer from './speedPlayer'

export default class SpeedTable extends Table {
  user: SpeedPlayer
  dealer: SpeedPlayer
  difficulty: string
  layoutCards: Card[] = []

  constructor(gameType: string, name: string, difficulty: string) {
    super(gameType)

    this.difficulty = difficulty

    this.user = new SpeedPlayer(name, 'human', gameType)
    this.dealer = new SpeedPlayer('Dealer', 'dealer', gameType)

    this.assignPlayerDecks()
    this.assignPlayerHands()
    this.assignLayoutCards()
  }

  /**
   * デッキを半分ずつ分けて各プレイヤーに配る
   * @returns {void}
   */
  assignPlayerDecks(): void {
    while (this.deck.cards.length > 0) {
      this.user.dividedDeck.push(this.deck.cards.shift()!)
      if (this.deck.cards.length <= 0) break
      this.dealer.dividedDeck.push(this.deck.cards.shift()!)
    }
  }

  /**
   * 各プレイヤーに手札を配る関数
   *
   * @returns {void}
   */
  assignPlayerHands(): void {
    for (let i = 0; i < 4; i++) {
      this.user.hand.push(this.user.dividedDeck.shift()!)
      this.dealer.hand.push(this.dealer.dividedDeck.shift()!)
    }
  }

  /**
   * 場札を配置する関数
   *
   * @returns {void}
   */
  assignLayoutCards(): void {
    this.layoutCards.push(this.user.dividedDeck.shift()!)
    this.layoutCards.push(this.dealer.dividedDeck.shift()!)
  }

  /**
   * プレイヤーの行動に応じた処理を行う関数
   *
   * @param {Player} _player - プレイヤー
   * @returns {void}
   */
  evaluateMove(_player: Player): void {}

  /**
   * ゲームの最終結果を返す関数
   *
   * @returns {string} - ゲームの最終結果
   */
  evaluateAndGetFinalResults(): string {
    let result = ''

    return result
  }

  /**
   * 両プレイヤーの行動が完了したかどうかを返す関数
   *
   * @returns {boolean} - 両プレイヤーの行動が完了したかどうか
   */
  allPlayerActionsResolved(): boolean {
    return (
      this.user.gameStatus === 'cannot submit' &&
      this.dealer.gameStatus === 'cannot submit'
    )
  }
}
