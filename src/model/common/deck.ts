import { CardConfig } from '../../config/cardConfig'
import Card from './card'

export default class Deck {
  gameType: string
  cards: Card[] = []

  constructor(gameType: string) {
    this.gameType = gameType
    this.reset()
    this.shuffle()
  }

  /*
  reset(): void
  山札を補充する
  */
  reset(): void {
    for (const suit of CardConfig.suits) {
      for (const rank of CardConfig.ranks) {
        this.cards.push(new Card(suit, rank))
      }
    }
  }

  /*
  shuffle(): void
  山札をシャッフルする
  */
  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * i + 1)
      let temp: Card = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
  }

  /*
  drawCard(): Card
  山札からカードを１枚引く
  */
  drawCard(): Card {
    if (this.cards.length === 0) {
      this.reset()
      this.shuffle()
    }
    return this.cards.pop()!
  }
}
