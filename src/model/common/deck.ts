import { CardConfig } from '../../config/cardConfig'
import Card from './card'

export default class Deck {
  gameType: string
  cards: Card[] = []

  constructor(gameType: string) {
    this.gameType = gameType
    this.reset(this.gameType)
    this.shuffle()
  }

  reset(gameType: string): void {
    const deck: Card[] = []

    const suits: string[] = CardConfig.suits
    const ranks: string[] = CardConfig.ranks

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(new Card(suit, rank))
        if (gameType === 'blackjack') {
          deck.push(new Card(suit, rank))
        }
      }
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i + 1)
      let temp: Card = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
  }

  drawCard(): Card {
    return this.cards.shift()!
  }
}
