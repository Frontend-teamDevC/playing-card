export default class Card {
  suit: string
  rank: string

  constructor(suit: string, rank: string) {
    this.suit = suit
    this.rank = rank
  }

  getRankNumber() {
    if (this.rank == 'A') return 14
    else if (this.rank == 'K') return 13
    else if (this.rank == 'Q') return 12
    else if (this.rank == 'J') return 11
    else return Number(this.rank)
  }
}
