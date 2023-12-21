import Card from '../model/common/card'
// import Table from '../model/war/warTable'
import { BaseScene } from './common/baseScene'
import { Controller } from '../controller/controller'

// import Phaser from 'phaser'

export class WarView extends BaseScene {
  table: any
  dealerWarCard: any
  playerWarCard: any

  // phaser object
  temp: Phaser.GameObjects.Image[] = []
  dealerDeck: any = []
  playerDeck: any = []
  dealerHand: Phaser.GameObjects.Image[] | any = []
  playerHand: Phaser.GameObjects.Image[] | any = []
  dealerHandIndex: any
  playerHandIndex: any
  dealerCardXtemp: any
  playerCardXtemp: any
  dealerBattleCard: any = []
  playerBattleCard: any = []

  constructor() {
    super()
    // this.table = new Table('war')
  }

  preload() {
    const suits = ['C', 'S', 'D', 'H']
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

    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        this.load.image(
          `${values[j]}${suits[i]}`,
          `assets/cards/${values[j]}${suits[i]}.png`
        )
      }
    }

    this.load.image('card-back', 'assets/cards/backB.png')
  }

  create(data: any) {
    super.create(data)
    this.table = data.table
    this.initilizeGame()
  }

  initilizeGame() {
    // assign deck
    let dealer = this.table.players[0]
    let player = this.table.players[1]

    for (let i = 0; i < dealer.deck.cards.length; i++) {
      this.dealerDeck.push(this.add.sprite(100, 100, 'card-back'))
    }
    for (let i = 0; i < player.deck.cards.length; i++) {
      this.playerDeck.push(this.add.sprite(700, 500, 'card-back'))
    }

    // assign hand
    let dealerHandX = 300
    let dealerHandY = 100
    let playerHandX = 500
    let playerHandY = 500

    for (let i = 0; i < 3; i++) {
      // model
      dealer.hand[i] = dealer.deck.drawOne()
      player.hand[i] = player.deck.drawOne()

      this.dealerHand.push(this.dealerDeck.pop())
      this.playerHand.push(this.playerDeck.pop().setInteractive())

      this.time.delayedCall(1000, () => {
        // dealer deck to hand
        this.tweens.add({
          targets: this.dealerHand[i],
          x: dealerHandX,
          y: dealerHandY,
          duration: 500,
          ease: 'Cubic.easeIn'
        })
        dealerHandX += 100
      })

      this.time.delayedCall(1000, () => {
        // player deck to hand
        this.tweens.add({
          targets: this.playerHand[i],
          x: playerHandX,
          y: playerHandY,
          duration: 500,
          ease: 'Cubic.easeIn'
        })
        playerHandX -= 100
      })
    }

    this.time.delayedCall(2000, () => {
      this.dealerSelectCard()
      this.playerSelectCard()
    })
  }

  dealerSelectCard() {
    let dealer = this.table.players[0]
    let handArr = []
    // dealer handのnullじゃない手札のindexを記録
    for (let i = 0; i < dealer.hand.length; i++) {
      if (dealer.hand[i] != null) {
        handArr.push(i)
      }
    }

    this.dealerHandIndex = handArr[Math.floor(Math.random() * handArr.length)]
    this.dealerCardXtemp = this.dealerHand[this.dealerHandIndex].x
    this.dealerWarCard = this.dealerHand[this.dealerHandIndex]
    this.dealerHand[this.dealerHandIndex] = null

    this.tweens.add({
      targets: this.dealerWarCard.setDepth(1),
      x: 400,
      y: 250,
      duration: 500,
      ease: 'Cubic.easeIn'
    })

    // model
    dealer.warCard = dealer.hand[this.dealerHandIndex]
    dealer.hand[this.dealerHandIndex] = null
    dealer.gameStatus = 'selected'

    this.evaluteWar()
  }

  playerSelectCard() {
    let player = this.table.players[1]
    let n = 0

    this.input.on(
      'gameobjectdown',
      (_pointer: undefined, gameObject: Phaser.GameObjects.Image) => {
        if (n == 0) {
          gameObject.setDepth(1).removeInteractive()
          this.playerCardXtemp = gameObject.x
          this.playerHandIndex = this.playerHand.indexOf(gameObject)
          this.playerHand[this.playerHandIndex] = null
          this.playerWarCard = gameObject

          this.tweens.add({
            targets: gameObject,
            x: 400,
            y: 350,
            duration: 500,
            ease: 'Cubic.easeIn'
          })

          for (let i = 0; i < player.hand.length; i++) {
            if (this.playerHandIndex == i) {
              player.warCard = player.hand[i]
              player.hand[i] = null
              console.log(player.hand)
            }
          }

          player.gameStatus = 'selected'
          this.evaluteWar()
        }
        n++
      },
      this
    )
  }

  evaluteWar() {
    let dealer = this.table.players[0]
    let player = this.table.players[1]

    if (dealer.gameStatus == 'selected' && player.gameStatus == 'selected')
      this.table.gamePhase = 'war'

    if (this.table.gamePhase == 'war') {
      // 1.55 sec
      this.flip(this.dealerWarCard, dealer.warCard)
      this.flip(this.playerWarCard, player.warCard)

      let dealerRank = dealer.warCard.getRankNumber()
      let playerRank = player.warCard.getRankNumber()

      let warResult: any

      this.time.delayedCall(2000, () => {
        if (dealerRank < playerRank) {
          this.dealerWarCard.setDepth(1)
          this.playerWarCard.setDepth(100)

          this.tweens.add({
            targets: this.playerWarCard,
            x: 400,
            y: 300,
            duration: 500,
            ease: 'Cubic.easeIn'
          })

          this.time.delayedCall(500, () => {
            warResult = this.add.text(380, 410, 'WIN', { font: '20px' })
          })

          this.time.delayedCall(1500, () => {
            warResult.destroy()
            this.table.temp.push(dealer.warCard, player.warCard)
            this.temp.push(
              this.dealerWarCard.setDepth(0),
              this.playerWarCard.setDepth(0)
            )
            for (let i = 0; i < this.table.temp.length; i++) {
              player.pocket.push(this.table.temp[i])

              this.tweens.add({
                targets: this.temp[i],
                x: 100,
                y: 500,
                duration: 500,
                ease: 'Cubic.easeIn'
              })
            }
            this.table.temp = []
            this.temp = []
          })
        } else if (dealerRank > playerRank) {
          this.dealerWarCard.setDepth(100)
          this.playerWarCard.setDepth(1)

          this.tweens.add({
            targets: this.dealerWarCard,
            x: 400,
            y: 300,
            duration: 500,
            ease: 'Cubic.easeIn'
          })

          this.time.delayedCall(500, () => {
            warResult = this.add.text(380, 410, 'LOSE', { font: '20px' })
          })

          this.time.delayedCall(1500, () => {
            warResult.destroy()
            this.table.temp.push(dealer.warCard, player.warCard)
            this.temp.push(
              this.dealerWarCard.setDepth(0),
              this.playerWarCard.setDepth(0)
            )
            for (let i = 0; i < this.table.temp.length; i++) {
              dealer.pocket.push(this.table.temp[i])

              this.tweens.add({
                targets: this.temp[i],
                x: 700,
                y: 100,
                duration: 500,
                ease: 'Cubic.easeIn'
              })
            }
            this.table.temp = []
            this.temp = []
          })
        } else {
          this.time.delayedCall(500, () => {
            warResult = this.add.text(380, 410, 'DRAW', { font: '20px' })
          })

          this.time.delayedCall(1500, () => {
            warResult.destroy()
            this.table.temp.push(dealer.warCard, player.warCard)
            this.temp.push(
              this.dealerWarCard.setDepth(0),
              this.playerWarCard.setDepth(0)
            )
          })
        }
      })

      this.time.delayedCall(5000, () => {
        dealer.warCard = null
        player.warCard = null
        this.dealerWarCard = null
        this.playerWarCard = null

        this.table.gamePhase = 'waiting'
        this.organize()
      })
    }
  }

  organize() {
    let dealer = this.table.players[0]
    let player = this.table.players[1]

    // dealer
    if (dealer.deck.cards.length != 0) {
      dealer.hand[this.dealerHandIndex] = dealer.deck.drawOne()
      this.dealerHand[this.dealerHandIndex] = this.dealerDeck.pop()

      this.tweens.add({
        targets: this.dealerHand[this.dealerHandIndex],
        x: this.dealerCardXtemp,
        y: 100,
        duration: 500,
        ease: 'Cubic.easeIn'
      })

      dealer.gameStatus = 'selecting'
    } else {
      dealer.gameStatus = 'selecting'
    }

    // player
    if (player.deck.cards.length != 0) {
      player.hand[this.playerHandIndex] = player.deck.drawOne()
      this.playerHand[this.playerHandIndex] = this.playerDeck
        .pop()
        .setInteractive()

      this.tweens.add({
        targets: this.playerHand[this.playerHandIndex],
        x: this.playerCardXtemp,
        y: 500,
        duration: 500,
        ease: 'Cubic.easeIn'
      })
      player.gameStatus = 'selecting'
    } else {
      player.gameStatus = 'selecting'
    }

    this.handCheck()
    console.log(this.table.gamePhase)

    if (this.table.gamePhase == 'end') {
      console.log('=== GAME OVER ===')
      this.result()
    } else {
      this.time.delayedCall(1000, () => {
        this.dealerSelectCard()
        this.playerSelectCard()
      })
    }
  }

  flip(target: Phaser.GameObjects.Image, card: Card) {
    const timeline = this.add.timeline([
      {
        at: 1000,
        tween: {
          targets: target,
          scaleX: 0,
          ease: 'Cubic.easeIn',
          duration: 500,
          onComplete: () => {
            target.setTexture(`${card.rank}${card.suit}`)
          }
        }
      },
      {
        at: 1500,
        tween: {
          targets: target,
          scaleX: 1,
          duration: 50
        }
      }
    ])

    timeline.play()
  }

  handCheck() {
    let dealer = this.table.players[0]
    let player = this.table.players[1]

    let playerHandNullArr = []
    for (let i = 0; i < player.hand.length; i++) {
      if (player.hand[i] == null) playerHandNullArr.push(player.hand[i])
    }

    let dealerHandNullArr = []
    for (let i = 0; i < dealer.hand.length; i++) {
      if (dealer.hand[i] == null) dealerHandNullArr.push(dealer.hand[i])
    }

    if (playerHandNullArr.length == 3 && dealerHandNullArr.length == 3) {
      this.table.gamePhase = 'end'
    }
  }

  result() {
    let dealer = this.table.players[0]
    let player = this.table.players[1]

    let dealerPocketLength = dealer.pocket.length
    let playerPocketLength = player.pocket.length

    if (dealerPocketLength > playerPocketLength) {
      console.log('PLAYER LOSE')
      this.add.text(500, 500, 'PLAYER LOSE')
    } else if (dealerPocketLength < playerPocketLength) {
      console.log('PLAYER WIN')
    } else {
      console.log('DRAW')
    }
  }
}
