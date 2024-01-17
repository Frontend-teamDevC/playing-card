import { CardConfig } from '../../config/cardConfig'
import Card from './warCard'

export default class Deck {
  private gameType: string
  private type: string | undefined
  public cards: Card[] = []

  constructor(gameType: string, type?: string) {
    this.gameType = gameType
    this.type = type
    this.cards = []

    if (this.gameType === 'war') {
      if (this.type === 'dealer') {
        const suits = ['H', 'D']
        for (let i = 0; i < suits.length; i++) {
          for (let j = 0; j < CardConfig.ranks.length; j++) {
            this.cards.push(new Card(suits[i], CardConfig.ranks[j]))
          }
        }
      } else {
        const suits = ['C', 'S']

        for (let i = 0; i < suits.length; i++) {
          for (let j = 0; j < CardConfig.ranks.length; j++) {
            this.cards.push(new Card(suits[i], CardConfig.ranks[j]))
          }
        }
      }
    }
  }

  public shuffle(): void {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
  }

  public resetDeck(): void {
    let newCards = new Deck(this.gameType, this.type)
    this.cards = newCards.cards
  }

  public drawOne(): Card {
    return this.cards.pop() as Card
  }
}
