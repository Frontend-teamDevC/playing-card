export default class Card {
  isFaceUp: boolean = false
  constructor(
    readonly suit: string,
    readonly rank: string
  ) {}

  getImageKey(): string {
    return this.isFaceUp ? `${this.rank}${this.suit}` : 'back'
  }
}
