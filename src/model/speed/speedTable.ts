import Card from '../common/card'
import Table from '../common/table'
import Player from '../common/player'
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

  /*
        assignPlayerDecks(): void
        ディーラーと全プレイヤーにカードを配る
        */
  assignPlayerDecks(): void {
    while (this.deck.cards.length > 0) {
      this.user.dividedDeck.push(this.deck.cards.shift()!)
      if (this.deck.cards.length <= 0) break
      this.dealer.dividedDeck.push(this.deck.cards.shift()!)
    }
  }

  /*
    assignPlayerHands(): void
    ディーラーと全プレイヤーにカードを4枚ずつ配る
    */
  assignPlayerHands(): void {
    for (let i = 0; i < 4; i++) {
      this.user.hand.push(this.user.dividedDeck.shift()!)
      this.dealer.hand.push(this.dealer.dividedDeck.shift()!)
    }
  }

  /*
        assignLayoutCards(): void
        場札２枚を配置する
        */
  assignLayoutCards(): void {
    this.layoutCards.push(this.user.dividedDeck.shift()!)
    this.layoutCards.push(this.dealer.dividedDeck.shift()!)
  }

  /*
    evaluateMove(player: Player, userData?: number | BlackjackActionType): void
    promptPlayer()で取得したプレイヤーの行動に応じてゲームの状態を更新する
    */
  evaluateMove(player: Player): void {}

  /*
    evaluateAndGetFinalResults(): string
    全ラウンド終了後、チップの数でプレイヤーを順位付けし、結果を返す
    */
  evaluateAndGetFinalResults(): string {
    let result = ''

    return result
  }

  /*
    allPlayerActionsResolved(): boolean
    ラウンド中の全プレイヤーの行動が完了しているかどうかを返す
    */
  allPlayerActionsResolved(): boolean {
    return (
      this.user.gameStatus === 'cannot submit' &&
      this.dealer.gameStatus === 'cannot submit'
    )
  }
}
