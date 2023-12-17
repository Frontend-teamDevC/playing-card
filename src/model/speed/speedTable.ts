import Table from '../common/table'
import Player from '../common/player'
import SpeedPlayer from './speedPlayer'

export default class SpeedTable extends Table {
  user: SpeedPlayer
  dealer: SpeedPlayer
  difficulty: string
  constructor(gameType: string, name: string, difficulty: string) {
    super(gameType)

    this.difficulty = difficulty

    this.user = new SpeedPlayer(name, 'human', gameType)
    this.dealer = new SpeedPlayer('Dealer', 'dealer', gameType)
  }

  assignPlayerDecks(): void {
    this.user.dividedDeck = this.deck.cards.slice(0, 26)
    this.dealer.dividedDeck = this.deck.cards.slice(26, 52)
  }

  /*
    assignPlayerHands(): void
    ディーラーと全プレイヤーにカードを4枚ずつ配る
    */
  assignPlayerHands(): void {
    this.assignPlayerDecks()
    this.user.hand = this.user.dividedDeck.slice(0, 4)
    this.dealer.hand = this.dealer.dividedDeck.slice(0, 4)
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
