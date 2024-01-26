import { Controller } from '../controller/controller'
import { WarController } from '../controller/warController'
import Card from '../model/common/card'
import WarPlayer from '../model/war/warPlayer'
import Table from '../model/war/warTable'
import { BaseScene } from './common/baseScene'
import { Button } from './common/button'

const CARD_WIDTH = 64
const CARD_HEIGHT = 89

export class WarView extends BaseScene {
  private table: Table | null = null
  private user: WarPlayer | null = null
  private dealerWarCard: Phaser.GameObjects.Image | null = null
  private playerWarCard: Phaser.GameObjects.Image | null = null

  private dealerHandPos: number[] = [640, 540, 440]
  private temp: Phaser.GameObjects.Image[] = []
  private dealerDeck: Phaser.GameObjects.Image[] = []
  private playerDeck: Phaser.GameObjects.Image[] = []
  private dealerHand: (Phaser.GameObjects.Image | null)[] = []
  private playerHand: (Phaser.GameObjects.Image | null)[] = []
  private dealerHandIndex: number = 0
  private playerHandIndex: number = 0
  private dealerCardXtemp: number = 0
  private playerCardXtemp: number = 0

  /**
   * warSceneを初期化する関数
   * @param {any} data - warTableを含むデータ
   */
  public create(data: any): void {
    super.create(data)
    this.table = data.table
    this.user = this.table!.players[1]
    this.initilizeGame()
    this.add
      .text(132, 200, 'Dealer', {
        color: '#fff',
        fontSize: '20px',
        fontFamily: 'Helvetica Neue'
      })
      .setOrigin(0.5, 0)
    this.add
      .text(948, 500, data.table.user.name, {
        color: '#fff',
        fontSize: '20px',
        fontFamily: 'Helvetica Neue'
      })
      .setOrigin(0.5, 0)

    // let backButton = this.add
    //   .image(20, 20, 'back-button')
    //   .setInteractive()
    //   .setOrigin(0, 0)
    // backButton.on('pointerdown', () => {
    //   const root = document.getElementById('app')
    //   root!.innerHTML = ''
    //   Controller.renderGamePage(data.table.gameType, data.table.user.name)
    // })

    this.arrowBackButton()
  }

  /**
   * 両プレイヤーにデッキを配る関数
   *
   * @returns {void}
   */
  private assignDeck(): void {
    this.table?.players[0].deck.cards.forEach(() =>
      this.dealerDeck.push(
        this.add.sprite(CARD_WIDTH / 2 + 100, CARD_HEIGHT / 2 + 100, 'back')
      )
    )

    this.table?.players[1].deck.cards.forEach(() => {
      this.playerDeck.push(
        this.add.sprite(
          1080 - CARD_WIDTH / 2 - 100,
          720 - CARD_HEIGHT / 2 - 100,
          'back'
        )
      )
    })
  }

  /**
   * 両プレイヤーに手札を配る関数
   *
   * @returns {void}
   */
  private assignHand(): void {
    let dealerHandX = 640
    let dealerHandY = CARD_HEIGHT / 2 + 100
    let playerHandX = 440
    let playerHandY = 720 - CARD_HEIGHT / 2 - 100

    for (let i = 0; i < 3; i++) {
      this.dealerHand.push(this.dealerDeck.pop()!)
      this.playerHand.push(this.playerDeck.pop()!.setInteractive())

      this.time.delayedCall(1000 + 500 * i, () => {
        this.tweens.add({
          targets: this.dealerHand[i],
          x: dealerHandX,
          y: dealerHandY,
          duration: 300,
          ease: 'Cubic.easeIn'
        })
        dealerHandX -= 100

        this.sound.play('card-se')
      })

      this.time.delayedCall(1000 + 500 * i, () => {
        this.tweens.add({
          targets: this.playerHand[i],
          x: playerHandX,
          y: playerHandY,
          duration: 300,
          ease: 'Cubic.easeIn'
        })
        playerHandX += 100
      })
    }
  }

  /**
   * ゲームを初期化する関数
   *
   * @returns {void}
   */
  private initilizeGame(): void {
    this.assignDeck()
    this.table?.assignHand()
    this.assignHand()

    this.time.delayedCall(3000, () => {
      this.dealerSelectCard()
      this.playerSelectCard()
    })
  }

  /**
   * ディーラーが場に出すカードを選択する関数
   *
   * @returns {void}
   */
  private dealerSelectCard(): void {
    let dealer = this.table!.players[0]
    let handArr = []
    for (let i = 0; i < dealer.hand.length; i++) {
      if (dealer.hand[i] != null) {
        handArr.push(i)
      }
    }

    this.dealerHandIndex = handArr[Math.floor(Math.random() * handArr.length)]
    this.dealerCardXtemp = this.dealerHandPos[this.dealerHandIndex]
    this.dealerWarCard = this.dealerHand[this.dealerHandIndex]
    this.dealerHand[this.dealerHandIndex] = null

    this.time.delayedCall(1000, () => {
      this.tweens.add({
        targets: this.dealerWarCard!.setDepth(1),
        x: 540,
        y: 360 - CARD_HEIGHT / 2 - 10,
        duration: 300,
        ease: 'Cubic.easeIn'
      })
      this.sound.play('card-se')

      dealer.warCard = dealer.hand[this.dealerHandIndex] as Card
      dealer.hand[this.dealerHandIndex] = null
      dealer.gameStatus = 'selected'

      this.evaluteWar()
    })
  }

  /**
   * プレイヤーが場に出すカードを選択する関数
   *
   * @returns {void}
   */
  private playerSelectCard(): void {
    let player = this.table!.players[1]
    let n = 0

    let yet = true
    let guideText: Phaser.GameObjects.Text | null = null
    this.time.delayedCall(3000, () => {
      if (yet) {
        guideText = this.add
          .text(540, 650, '勝負するカードを選択してください', {
            font: '20px'
          })
          .setOrigin(0.5, 0)
      }
    })

    let handArr: Phaser.GameObjects.Image[] = []
    for (let i = 0; i < this.playerHand.length; i++) {
      if (this.playerHand[i] != null) {
        handArr.push(this.playerHand[i]!)
      }
    }

    handArr.map((card: Phaser.GameObjects.Image) => {
      card!.on(
        'pointerdown',
        () => {
          if (n == 0) {
            yet = false
            if (guideText) {
              guideText.destroy()
            }
            card!.setDepth(1).removeInteractive()
            this.playerCardXtemp = card!.x
            this.playerHandIndex = this.playerHand.indexOf(card!)
            this.playerHand[this.playerHandIndex] = null
            this.playerWarCard = card

            this.tweens.add({
              targets: card,
              x: 540,
              y: 360 + CARD_HEIGHT / 2 + 10,
              duration: 300,
              ease: 'Cubic.easeIn'
            })
            this.sound.play('card-se')

            for (let i = 0; i < player.hand.length; i++) {
              if (this.playerHandIndex == i) {
                player.warCard = player.hand[i] as Card
                player.hand[i] = null
              }
            }

            player.gameStatus = 'selected'
            this.evaluteWar()
          }
          n++
        },
        this
      )
    })
  }

  /**
   * 勝負の結果を評価する関数
   *
   * @returns {void}
   */
  private evaluteWar(): void {
    let dealer = this.table!.players[0]
    let player = this.table!.players[1]

    if (dealer.gameStatus == 'selected' && player.gameStatus == 'selected')
      this.table!.gamePhase = 'war'

    if (this.table!.gamePhase == 'war') {
      // 1.55 sec
      this.flip(this.dealerWarCard!, dealer.warCard as Card)
      this.flip(this.playerWarCard!, player.warCard as Card)

      let dealerRank = dealer.warCard!.getRankNumber()
      let playerRank = player.warCard!.getRankNumber()

      let warResult: Phaser.GameObjects.Text

      this.time.delayedCall(2000, () => {
        if (dealerRank < playerRank) {
          this.dealerWarCard!.setDepth(1)
          this.playerWarCard!.setDepth(100)

          this.tweens.add({
            targets: this.playerWarCard,
            x: 540,
            y: 360,
            duration: 300,
            ease: 'Cubic.easeIn'
          })

          this.time.delayedCall(500, () => {
            warResult = this.add.text(540 - 100, 480, 'WIN', {
              font: '20px',
              fixedWidth: 200,
              align: 'center'
            })
          })

          this.time.delayedCall(1500, () => {
            warResult.destroy()
            this.table!.temp!.push(dealer.warCard!, player.warCard as Card)
            this.temp.push(
              this.dealerWarCard!.setDepth(0),
              this.playerWarCard!.setDepth(0)
            )
            for (let i = 0; i < this.table!.temp!.length; i++) {
              player.pocket.push(this.table!.temp![i])

              this.tweens.add({
                targets: this.temp[i],
                x: CARD_WIDTH / 2 + 100,
                y: 720 - CARD_HEIGHT / 2 - 100,
                duration: 300,
                ease: 'Cubic.easeIn'
              })
            }
            this.table!.temp = []
            this.temp = []
          })
        } else if (dealerRank > playerRank) {
          this.dealerWarCard!.setDepth(100)
          this.playerWarCard!.setDepth(1)

          this.tweens.add({
            targets: this.dealerWarCard,
            x: 540,
            y: 360,
            duration: 300,
            ease: 'Cubic.easeIn'
          })

          this.time.delayedCall(500, () => {
            warResult = this.add.text(540 - 100, 480, 'LOSE', {
              font: '20px',
              fixedWidth: 200,
              align: 'center'
            })
          })

          this.time.delayedCall(1500, () => {
            warResult.destroy()
            this.table!.temp!.push(dealer.warCard!, player.warCard as Card)
            this.temp.push(
              this.dealerWarCard!.setDepth(0),
              this.playerWarCard!.setDepth(0)
            )
            for (let i = 0; i < this.table!.temp!.length; i++) {
              dealer.pocket.push(this.table!.temp![i])

              this.tweens.add({
                targets: this.temp[i],
                x: 1080 - CARD_WIDTH / 2 - 100,
                y: CARD_HEIGHT / 2 + 100,
                duration: 300,
                ease: 'Cubic.easeIn'
              })
            }
            this.table!.temp = []
            this.temp = []
          })
        } else {
          this.time.delayedCall(500, () => {
            warResult = this.add.text(540 - 100, 480, 'DRAW', {
              font: '20px',
              fixedWidth: 200,
              align: 'center'
            })
          })

          this.time.delayedCall(1500, () => {
            warResult.destroy()
            this.table!.temp!.push(dealer.warCard!, player.warCard as Card)
            this.temp.push(
              this.dealerWarCard!.setDepth(0),
              this.playerWarCard!.setDepth(0)
            )
          })
        }
      })

      this.time.delayedCall(3600, () => {
        dealer.warCard = null
        player.warCard = null
        this.dealerWarCard = null
        this.playerWarCard = null

        this.table!.gamePhase = 'waiting'
        this.organize()
      })
    }
  }

  /**
   * デッキを整理する関数
   *
   * @returns {void}
   */
  organize() {
    let dealer = this.table!.players[0]
    let player = this.table!.players[1]

    if (dealer.deck.cards.length != 0) {
      dealer.hand[this.dealerHandIndex] = dealer.deck.drawOne()
      this.dealerHand[this.dealerHandIndex] =
        this.dealerDeck.pop() as Phaser.GameObjects.Image

      this.tweens.add({
        targets: this.dealerHand[this.dealerHandIndex]!.setDepth(100),
        x: this.dealerCardXtemp,
        y: CARD_HEIGHT / 2 + 100,
        duration: 300,
        ease: 'Cubic.easeIn'
      })
      this.sound.play('card-se')
      this.time.delayedCall(500, () => {
        this.dealerHand[this.dealerHandIndex]!.setDepth(0)
      })

      dealer.gameStatus = 'selecting'
    } else {
      dealer.gameStatus = 'selecting'
    }

    if (player.deck.cards.length != 0) {
      player.hand[this.playerHandIndex] = player.deck.drawOne()
      this.playerHand[this.playerHandIndex] = this.playerDeck
        .pop()!
        .setInteractive()

      this.tweens.add({
        targets: this.playerHand[this.playerHandIndex]!.setDepth(100),
        x: this.playerCardXtemp,
        y: 720 - CARD_HEIGHT / 2 - 100,
        duration: 300,
        ease: 'Cubic.easeIn'
      })

      this.time.delayedCall(500, () => {
        this.playerHand[this.playerHandIndex]!.setDepth(0)
      })

      player.gameStatus = 'selecting'
    } else {
      player.gameStatus = 'selecting'
    }

    this.handCheck()

    if (this.table!.gamePhase == 'end') {
      this.time.delayedCall(1000, () => {
        this.result()
      })
    } else {
      this.time.delayedCall(500, () => {
        this.dealerSelectCard()
        this.playerSelectCard()
      })
    }
  }

  /**
   * カードを裏返す関数
   *
   * @param {Phaser.GameObjects.Image} target - カードの画像
   * @param {Card} card - カードの情報
   * @returns {void}
   */
  flip(target: Phaser.GameObjects.Image, card: Card): void {
    const timeline = this.add.timeline([
      {
        at: 1000,
        tween: {
          targets: target,
          scaleX: 0,
          ease: 'Cubic.easeIn',
          duration: 300,
          onComplete: () => {
            target.setTexture(`${card.rank}${card.suit}`)
          }
        }
      },
      {
        at: 1300,
        tween: {
          targets: target,
          scaleX: 1,
          duration: 50
        }
      }
    ])

    timeline.play()
    this.time.delayedCall(1100, () => this.sound.play('card-flip-se'))
  }

  handCheck() {
    let dealer = this.table!.players[0]
    let player = this.table!.players[1]

    let playerHandNullArr = []
    for (let i = 0; i < player.hand.length; i++) {
      if (player.hand[i] == null) playerHandNullArr.push(player.hand[i])
    }

    let dealerHandNullArr = []
    for (let i = 0; i < dealer.hand.length; i++) {
      if (dealer.hand[i] == null) dealerHandNullArr.push(dealer.hand[i])
    }

    if (playerHandNullArr.length == 3 && dealerHandNullArr.length == 3) {
      this.table!.gamePhase = 'end'
    }
  }

  /**
   * ゲームの最終結果を表示する関数
   *
   * @returns {void}
   */
  result(): void {
    let dealer = this.table!.players[0]
    let player = this.table!.players[1]

    this.add.image(540, 360, 'board')

    this.add
      .text(540, 300, '獲得カード枚数', { color: 'black', fontSize: '24px' })
      .setOrigin(0.5, 0)

    new Button(
      this,
      540,
      450,
      'もう一度遊ぶ',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        WarController.startGame(new Table('war', this.table!.user.name))
      }
    )

    new Button(
      this,
      540,
      550,
      '他のゲームで遊ぶ',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        Controller.renderModeSelectPage(
          ['blackjack', 'poker', 'war', 'speed'],
          this.table!.user.name
        )
      }
    )

    let dealerPocketLength = dealer.pocket.length
    let playerPocketLength = player.pocket.length

    if (dealerPocketLength > playerPocketLength) {
      this.add
        .text(
          540,
          330,
          `${
            this.table!.user.name
          }: ${playerPocketLength} / 🏆DEALER: ${dealerPocketLength}`,
          { color: 'black', fontSize: '24px' }
        )
        .setOrigin(0.5, 0)
      this.add
        .text(540, 200, 'LOSE', { color: 'black', fontSize: '40px' })
        .setOrigin(0.5, 0)
      this.sound.play('lose-se')
    } else if (dealerPocketLength < playerPocketLength) {
      this.add
        .text(
          540,
          330,
          `🏆${
            this.table!.user.name
          }: ${playerPocketLength} / DEALER: ${dealerPocketLength}`,
          { color: 'black', fontSize: '24px' }
        )
        .setOrigin(0.5, 0)
      this.add
        .text(540, 200, 'WIN', { color: 'black', fontSize: '40px' })
        .setOrigin(0.5, 0)

      this.sound.play('win-se')
    } else {
      this.add
        .text(
          540,
          330,
          `${
            this.table!.user.name
          }: ${playerPocketLength} / DEALER: ${dealerPocketLength}`,
          { color: 'black', fontSize: '24px' }
        )
        .setOrigin(0.5, 0)
      this.add
        .text(540, 200, 'DRAW', { color: 'black', fontSize: '40px' })
        .setOrigin(0.5, 0)
      this.sound.play('lose-se')
    }
  }

  arrowBackButton(): Button {
    return new Button(this, 55, 55, '', 'back-button', 'select-se', () => {
      const root = document.getElementById('app')
      root!.innerHTML = ''
      Controller.renderModeSelectPage(
        ['blackjack', 'war', 'poker', 'speed'],
        this.user!.name
      )
    })
  }
}
