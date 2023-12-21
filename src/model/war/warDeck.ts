import Card from './warCard'

export default class Deck {
  gameType: string
  type: string | undefined
  cards: Card[] = []

  constructor(gameType: string, type?: string) {
    this.gameType = gameType
    this.type = type
    this.cards = []

    if (this.gameType === 'war') {
      const values = [
        'A',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K'
      ]

      if (this.type === 'dealer') {
        const suits = ['H', 'D']

        for (let i = 0; i < suits.length; i++) {
          for (let j = 0; j < values.length; j++) {
            this.cards.push(new Card(suits[i], values[j]))
          }
        }
      } else {
        const suits = ['C', 'S']

        for (let i = 0; i < suits.length; i++) {
          for (let j = 0; j < values.length; j++) {
            this.cards.push(new Card(suits[i], values[j]))
          }
        }
      }
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
  }

  resetDeck(): void {
    let newCards = new Deck(this.gameType, this.type)
    this.cards = newCards.cards
  }

  drawOne() {
    return this.cards.pop()
  }
}
