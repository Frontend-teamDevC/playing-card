import Card from './warCard'

export default class WarPlayer {
  pocket: any
  hand: any
  deck: any
  gameStatus: any
  type: any
  warCard: Card | undefined

  constructor(type: any) {
    this.pocket = []
    this.hand = [null, null, null]
    this.deck = []
    this.gameStatus = 'selecting'
    this.type = type
  }
}
