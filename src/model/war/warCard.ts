export default class Card {
  public suit: string
  public rank: string

  constructor(suit: string, rank: string) {
    this.suit = suit
    this.rank = rank
  }

  /**
   * カードのランクの数値を返す関数
   *
   * @returns {string} - カードランクの数値
   */
  public getRankNumber(): number {
    let num: number
    switch (this.rank) {
      case 'A':
        num = 14
        break
      case 'K':
        num = 13
        break
      case 'Q':
        num = 12
        break
      case 'J':
        num = 11
        break
      default:
        num = +this.rank
    }

    return num
  }
}
