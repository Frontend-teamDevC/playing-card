import Card from './warCard'
import Deck from './warDeck'
import Player from './warPlayer'

export default class WarTable {
  user: Player
  gameType: string
  gamePhase: string
  players: Player[] = []
  temp: Card[] = []

  constructor(gameType: string, name: string) {
    this.user = new Player(name, 'player')
    this.gameType = gameType
    this.gamePhase = 'initialize'
    this.players.push(new Player('DEALER', 'dealer'), this.user)

    this.assignDeck()
    this.assignHand()
  }

  assignDeck() {
    // 各プレイヤーに山札をセット
    this.players[0].deck = new Deck('war', 'dealer')
    this.players[1].deck = new Deck('war', 'player')
    // 各プレイヤーの山札をシャッフル
    this.players[0].deck.shuffle()
    this.players[1].deck.shuffle()
  }

  assignHand() {
    // プレイヤーの山札からカードを3枚引き、手札に追加する
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 3; j++) {
        this.players[i].hand[j] = this.players[i].deck.drawOne()
      }
    }
  }
}
