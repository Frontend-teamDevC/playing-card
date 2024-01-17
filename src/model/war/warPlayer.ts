import Card from './warCard'
import Deck from './warDeck'

export default class WarPlayer {
  public name: string
  public pocket: Card[]
  public hand: (Card | null)[]
  public deck: Deck
  public gameStatus: string
  public type: string
  public warCard: Card | null

  constructor(name: string, type: any) {
    this.name = name
    this.type = type
    this.pocket = []
    this.hand = [null, null, null]
    this.warCard = null
    this.deck = new Deck('war', type)
    this.gameStatus = 'selecting'

    this.deck.shuffle()
  }
}
