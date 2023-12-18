class Player {
  pocket: any
  hand: any
  deck: any
  gameStatus: any
  type: any

  constructor(type: any) {
    this.pocket = []
    this.hand = [null, null, null]
    this.deck = []
    this.gameStatus = 'selecting'
    this.type = type
  }
}

class Deck {
  gameType: string
  cards

  constructor(gameType: string) {
    this.gameType = gameType
    this.cards = []

    if (this.gameType === 'war') {
      const suits = ['C']
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
          this.cards.push(new Card(suits[i], values[j]))
        }
      }
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
  }

  resetDeck() {
    let newCards = new Deck(this.gameType)
    this.cards = newCards.cards
  }

  drawOne() {
    return this.cards.pop()
  }
}

class Card {
  suit
  rank

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

class War extends Phaser.Scene {
  // table object
  dealer
  player
  battle: any = {
    dealer: [],
    player: [],
    temp: []
  }
  gamePhase

  // phaser object
  temp: any = []
  dealerDeck: any = []
  playerDeck: any = []
  dealerHand: any = []
  playerHand: any = []
  dealerHandIndex: any
  playerHandIndex: any
  dealerCardXtemp: any
  playerCardXtemp: any
  dealerBattleCard: any = []
  playerBattleCard: any = []

  constructor() {
    super()
    this.dealer = new Player('dealer')
    this.player = new Player('player')
    this.dealer.deck = new Deck('war')
    this.player.deck = new Deck('war')
    this.gamePhase = 'wating'
    this.dealer.deck.shuffle()
    this.player.deck.shuffle()
  }

  preload() {
    this.load.image('table-back', 'assets/table-back.jpg')

    const suits = ['C']
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
          `${suits[i]}${values[j]}`,
          `assets/${values[j]}${suits[i]}.png`
        )
      }
    }

    this.load.image('card-back', 'assets/backB.png')
  }

  create() {
    this.add.image(400, 300, 'table-back').setScale(1.8).setDepth(-100)
    this.assignDeck()
  }

  assignDeck() {
    let dealerDeckX = 100
    let dealerDeckY = 100
    let playerDeckX = 700
    let playerDeckY = 500

    // dealer
    for (let i = 0; i < this.dealer.deck.cards.length; i++) {
      this.dealerDeck.push(
        this.add.sprite(dealerDeckX, dealerDeckY, 'card-back')
      )
    }

    // player
    for (let i = 0; i < this.player.deck.cards.length; i++) {
      this.playerDeck.push(
        this.add.sprite(playerDeckX, playerDeckY, 'card-back')
      )
    }

    this.assignHand()
  }

  assignHand() {
    let dealerX = 300
    let dealerY = 100
    let playerX = 500
    let playerY = 500

    for (let i = 0; i < 3; i++) {
      // phaser obj
      this.dealerHand.push(this.dealerDeck.pop())
      this.playerHand.push(this.playerDeck.pop())

      // table obj
      this.dealer.hand[i] = this.dealer.deck.drawOne()
      this.player.hand[i] = this.player.deck.drawOne()
    }

    this.time.delayedCall(1000, () => {
      // dealer
      for (let i = 0; i < this.dealerHand.length; i++) {
        this.tweens.add({
          targets: this.dealerHand[i],
          x: dealerX,
          y: dealerY,
          duration: 500,
          ease: 'Cubic.easeIn'
        })
        dealerX += 100
      }

      // player
      for (let i = 0; i < this.player.hand.length; i++) {
        this.playerHand[i].setInteractive()
        this.tweens.add({
          targets: this.playerHand[i],
          x: playerX,
          y: playerY,
          duration: 500,
          ease: 'Cubic.easeIn'
        })
        playerX -= 100
      }
    })

    this.time.delayedCall(2000, () => {
      this.dealerSetBattle()
      this.playerSetBattle()
    })
  }

  dealerSetBattle() {
    let handArr = []
    for (let i = 0; i < this.dealer.hand.length; i++) {
      if (this.dealer.hand[i] != null) {
        handArr.push(i)
      }
    }
    this.dealerHandIndex = handArr[Math.floor(Math.random() * handArr.length)]
    this.dealerCardXtemp = this.dealerHand[this.dealerHandIndex].x
    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: this.dealerHand[this.dealerHandIndex].setDepth(1),
        x: 400,
        y: 250,
        duration: 500,
        ease: 'Cubic.easeIn'
      })
      let temp = this.dealer.hand[this.dealerHandIndex]
      this.dealer.hand[this.dealerHandIndex] = null
      this.battle.dealer.push(temp)

      this.temp.push(this.dealerHand[this.dealerHandIndex])
      this.dealerBattleCard = this.dealerHand[this.dealerHandIndex]

      this.dealer.gameStatus = 'selected'
      console.log('DEALER SELECTED: ' + this.battle.dealer[0].getRankNumber())
      this.evaluteBattle()
    })
  }

  playerSetBattle() {
    let n = 0
    this.input.on(
      'gameobjectdown',
      (_pointer: any, gameObject: any) => {
        if (n == 0) {
          // phaser obj
          gameObject.removeInteractive()
          gameObject.setDepth(1)
          this.playerCardXtemp = gameObject.x
          this.playerHandIndex = this.playerHand.indexOf(gameObject)
          this.playerHand[this.playerHandIndex] = null
          this.playerBattleCard = gameObject
          this.temp.push(gameObject)

          // table obj
          this.tweens.add({
            targets: gameObject,
            x: 400,
            y: 350,
            duration: 500,
            ease: 'Cubic.easeIn'
          })

          for (let i = 0; i < this.player.hand.length; i++) {
            if (this.playerHandIndex == i) {
              let temp = this.player.hand[i]
              this.player.hand[i] = null
              this.battle.player.push(temp)
            }
          }
          this.player.gameStatus = 'selected'

          // next method
          console.log(
            'PLAYER SELECTED: ' + this.battle.player[0].getRankNumber()
          )
          this.evaluteBattle()
        }
        n++
      },
      this
    )
  }

  changePhase() {
    if (
      this.dealer.gameStatus == 'selected' &&
      this.player.gameStatus == 'selected'
    ) {
      this.gamePhase = 'battle'
    }
  }

  evaluteBattle() {
    this.changePhase()
    if (this.gamePhase == 'battle') {
      // flip
      this.flip(this.dealerBattleCard, this.battle.dealer[0])
      this.flip(this.playerBattleCard, this.battle.player[0])

      let dealerRank = this.battle.dealer[0].getRankNumber()
      let playerRank = this.battle.player[0].getRankNumber()

      this.dealerBattleCard = []
      this.playerBattleCard = []

      // table obj
      this.battle.temp.push(this.battle.dealer[0], this.battle.player[0])
      this.battle.dealer = []
      this.battle.player = []

      if (dealerRank > playerRank) {
        console.log('--> LOSE')
        for (let i = 0; i < this.battle.temp.length; i++) {
          this.dealer.pocket.push(this.battle.temp[i])
        }

        this.time.delayedCall(2000, () => {
          for (let i = 0; i < this.temp.length; i++) {
            this.tweens.add({
              targets: this.temp[i],
              x: 700,
              y: 100,
              duration: 500,
              ease: 'Cubic.easeIn'
            })
          }

          this.battle.temp = []
          this.temp = []
        })
      } else if (dealerRank < playerRank) {
        console.log('--> WIN')
        for (let i = 0; i < this.battle.temp.length; i++) {
          this.player.pocket.push(this.battle.temp[i])
        }

        this.time.delayedCall(2000, () => {
          for (let i = 0; i < this.temp.length; i++) {
            this.tweens.add({
              targets: this.temp[i],
              x: 100,
              y: 500,
              duration: 500,
              ease: 'Cubic.easeIn'
            })
          }

          this.battle.temp = []
          this.temp = []
        })
      } else {
        console.log('--> DRAW')
        for (let i = 0; i < this.temp.length; i++) {
          this.temp[i].setDepth(-1)
        }
      }
      this.gamePhase = 'waiting'
      // next method
      this.organize()
    }
  }

  flip(card: any, cardd: any) {
    const timeline = this.add.timeline([
      {
        at: 1000,
        tween: {
          targets: card,
          scaleX: 0,
          ease: 'Cubic.easeIn',
          duration: 500,
          onComplete: () => {
            card.setTexture(`${cardd.suit}${cardd.rank}`)
          }
        }
      },
      {
        at: 1500,
        tween: {
          targets: card,
          scaleX: 1,
          duration: 50
        }
      }
    ])

    timeline.play()
  }

  organize() {
    // dealer
    if (this.dealer.deck.cards.length != 0) {
      this.dealer.hand[this.dealerHandIndex] = this.dealer.deck.drawOne()
      this.dealerHand[this.dealerHandIndex] = this.dealerDeck.pop()

      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: this.dealerHand[this.dealerHandIndex],
          x: this.dealerCardXtemp,
          y: 100,
          duration: 500,
          ease: 'Cubic.easeIn'
        })
        this.dealer.gameStatus = 'selecting'
      })
    } else {
      this.time.delayedCall(2000, () => {
        this.dealer.gameStatus = 'selecting'
      })
    }

    // player
    if (this.player.deck.cards.length != 0) {
      this.player.hand[this.playerHandIndex] = this.player.deck.drawOne()
      this.playerHand[this.playerHandIndex] = this.playerDeck
        .pop()
        .setInteractive()

      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: this.playerHand[this.playerHandIndex],
          x: this.playerCardXtemp,
          y: 500,
          duration: 500,
          ease: 'Cubic.easeIn'
        })
        this.player.gameStatus = 'selecting'
      })
    } else {
      this.player.gameStatus = 'selecting'
    }

    this.handCheck()

    if (this.gamePhase == 'end') {
      console.log('=== GAME OVER ===')
      this.result()
    } else {
      this.time.delayedCall(3000, () => {
        this.playerSetBattle()
        this.dealerSetBattle()
      })
    }
  }

  handCheck() {
    let playerHandNullArr = []
    for (let i = 0; i < this.player.hand.length; i++) {
      if (this.player.hand[i] == null)
        playerHandNullArr.push(this.player.hand[i])
    }

    let dealerHandNullArr = []
    for (let i = 0; i < this.dealer.hand.length; i++) {
      if (this.dealer.hand[i] == null)
        dealerHandNullArr.push(this.dealer.hand[i])
    }

    if (playerHandNullArr.length == 3 && dealerHandNullArr.length == 3) {
      this.gamePhase = 'end'
    }
  }

  result() {
    let dealerPocketLength = this.dealer.pocket.length
    let playerPocketLength = this.player.pocket.length

    console.log('DEALER: ' + this.dealer.pocket.length)
    console.log('PLAYER: ' + this.player.pocket.length)

    if (dealerPocketLength > playerPocketLength) {
      console.log('PLAYER LOSE')
    } else if (dealerPocketLength < playerPocketLength) {
      console.log('PLAYER WIN')
    } else {
      console.log('DRAW')
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: War
}

const game = new Phaser.Game(config)
