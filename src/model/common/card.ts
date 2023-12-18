export default class Card {
  isFaceUp: boolean = false
  constructor(
    readonly suit: string,
    readonly rank: string
  ) {}

  getImageKey(): string {
    return this.isFaceUp ? `${this.rank}${this.suit}` : 'back'
  }

  getRankNumber(): number {
    switch (this.rank) {
      case 'A':
        return 1
      case 'J':
        return 11
      case 'Q':
        return 12
      case 'K':
        return 13
      default:
        return parseInt(this.rank)
    }
  }
}
