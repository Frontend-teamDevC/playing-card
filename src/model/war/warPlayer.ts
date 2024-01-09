import Card from './warCard'

export default class WarPlayer {
  name: string
  pocket: any
  hand: any
  deck: any
  gameStatus: any
  type: any
  warCard: Card | undefined

  constructor(name: string, type: any) {
    this.name = name
    this.pocket = []
    this.hand = [null, null, null]
    this.deck = []
    this.gameStatus = 'selecting'
    this.type = type
  }
}
