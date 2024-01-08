import { Controller } from '../controller/controller'
import Card from '../model/common/card'
import SpeedTable from '../model/speed/speedTable'
import { BaseScene } from './common/baseScene'
import { Button } from './common/button'
import Text = Phaser.GameObjects.Text
import Image = Phaser.GameObjects.Image
import SpeedPlayer from '../model/speed/speedPlayer'
import { SpeedController } from '../controller/speedController'

export class SpeedScene extends BaseScene {
  table: SpeedTable | null = null
  user: SpeedPlayer | null = null
  dealer: SpeedPlayer | null = null
  difficulty: string = ''

  #userCardsText: Text | null = null
  #dealerCardsText: Text | null = null

  #playerNameTexts: Text[] = []

  #userHandsImages: Image[] = []
  #dealerHandImages: Image[] = []
  #userDeckImage: Image | null = null
  #dealerDeckImage: Image | null = null
  #layoutCardsImages: Image[] = []
  #piledLayoutCardsImages: Image[] = []

  create(data: any) {
    super.create(data)

    this.#userHandsImages = []
    this.#dealerHandImages = []

    this.table = data.table
    this.user = this.table!.user
    this.dealer = this.table!.dealer
    this.difficulty = this.table!.difficulty

    this.renderScene()
  }

  renderScene() {
    this.dealInitialHandsAndDecks()
    setTimeout(() => {
      this.setLayoutCardImage(
        this.dealer!,
        this.table!.layoutCards[0],
        null!,
        0
      )
      this.setLayoutCardImage(this.user!, this.table!.layoutCards[1], null!, 1)
    }, 4000)

    setTimeout(() => {
      this.countDown()
    }, 6000)

    setTimeout(() => {
      this.userDeckText()
      this.dealerDeckText()

      // dealer's action
      this.promptDealer()

      // user's action
      this.#userHandsImages.forEach((cardImage: Image, i: number) => {
        this.onCardDrag(cardImage, i)
      })
    }, 10000)
  }

  countDown() {
    let count = 3
    const countDownText = this.add.text(500, 300, count.toString(), {
      fontSize: '100px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
    const countDownInterval = setInterval(() => {
      count--
      countDownText.setText(count.toString())
      if (count === 0) {
        clearInterval(countDownInterval)
        countDownText.destroy()
        const startText = this.add.text(400, 300, 'Start!', {
          fontSize: '100px',
          color: 'orange',
          fontFamily: 'pixel'
        })
        setTimeout(() => {
          startText.destroy()
        }, 1000)
      }
    }, 1000)
  }

  userDeckText() {
    this.#userCardsText?.destroy()

    const totalCount = this.user!.dividedDeck.length + this.user!.hand.length
    const userDeckText = this.add.text(
      this.#userDeckImage!.x + 50,
      this.#userDeckImage!.y - 50,
      `${this.user!.name}\nノコリ${totalCount}マイ`,
      {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'pixel'
      }
    )
    this.#userCardsText = userDeckText
  }

  dealerDeckText() {
    this.#dealerCardsText?.destroy()

    const totalCount =
      this.dealer!.dividedDeck.length + this.dealer!.hand.length
    const dealerDeckText = this.add.text(
      this.#dealerDeckImage!.x - 200,
      this.#dealerDeckImage!.y - 50,
      `${this.dealer!.name}\nノコリ${totalCount}マイ`,
      {
        fontSize: '30px',
        color: '#ffffff',
        fontFamily: 'pixel'
      }
    )
    this.#dealerCardsText = dealerDeckText
  }

  dealInitialHandsAndDecks() {
    // dealer's cards
    const dealerDeckImage = this.add.image(300, 150, 'back')
    this.#dealerDeckImage = dealerDeckImage

    const dealerHands = this.table!.dealer.hand
    for (let i = 0; i < dealerHands.length; i++) {
      const card = dealerHands[i]

      const cardImage = this.add.image(
        dealerDeckImage.x,
        dealerDeckImage.y,
        'back'
      )

      setTimeout(() => {
        this.tweens.add({
          targets: cardImage,
          x: dealerDeckImage.x + 100 + i * 100,
          y: dealerDeckImage.y,
          duration: 250,
          ease: 'Power2',
          delay: i * 500
        })
      }, 500)

      setTimeout(() => {
        // flip card
        this.add.tween({
          targets: cardImage,
          scaleX: 0,
          ease: 'Power2',
          duration: 250,
          delay: 500,
          onComplete: () => {
            cardImage.setTexture(`${card.rank}${card.suit}`)
            this.add.tween({
              targets: cardImage,
              scaleX: 1,
              ease: 'Power2',
              duration: 250,
              delay: 500
            })
          }
        })
      }, 3000)

      this.#dealerHandImages.push(cardImage)
    }

    // user's cards
    const userDeckImage = this.add.image(800, 450, 'back')
    this.#userDeckImage = userDeckImage

    const userHands = this.user!.hand
    for (let i = 0; i < userHands.length; i++) {
      const card = userHands[i]
      const cardImage = this.add.image(userDeckImage.x, userDeckImage.y, 'back')

      setTimeout(() => {
        this.tweens.add({
          targets: cardImage,
          x: userDeckImage.x - 100 - i * 100,
          y: userDeckImage.y,
          duration: 250,
          ease: 'Power2',
          delay: i * 500,
          // play sound when the card starts moving
          onStart: () => {
            this.sound.play('card-se')
          }
        })
      }, 500)

      setTimeout(() => {
        this.add.tween({
          targets: cardImage,
          scaleX: 0,
          ease: 'Power2',
          duration: 250,
          delay: 500,
          onComplete: () => {
            cardImage.setTexture(`${card.rank}${card.suit}`)
            this.add.tween({
              targets: cardImage,
              scaleX: 1,
              ease: 'Power2',
              duration: 250,
              delay: 500
            })
          }
        })
        this.sound.play('card-flip-se')
      }, 3000)

      this.#userHandsImages.push(cardImage)
    }
  }

  setLayoutCardImage(
    player: SpeedPlayer,
    card: Card,
    cardImage: Image,
    layoutIndex: number
  ) {
    const deckImage =
      player.name === 'Dealer' ? this.#dealerDeckImage : this.#userDeckImage

    if (deckImage === null) return

    if (player.dividedDeck.length <= 0) {
      if (player.name === 'Dealer' && this.#dealerDeckImage !== null) {
        this.#dealerDeckImage?.destroy()
      } else if (this.#userDeckImage !== null) {
        this.#userDeckImage?.destroy()
      }
    }

    const newLayoutImage =
      this.#layoutCardsImages[layoutIndex] === undefined
        ? this.add.image(deckImage!.x, deckImage!.y, 'back')
        : cardImage

    const xPos =
      layoutIndex === 0
        ? this.#dealerDeckImage!.x + 150
        : this.#userDeckImage!.x - 150
    const yPos =
      layoutIndex === 0
        ? this.#dealerDeckImage!.y + 150
        : this.#userDeckImage!.y - 150

    this.table!.layoutCards[layoutIndex] = card
    if (newLayoutImage.texture.key !== 'back') {
      this.#layoutCardsImages[layoutIndex] = newLayoutImage!

      this.tweens.add({
        targets: newLayoutImage,
        x: xPos,
        y: yPos,
        duration: 250,
        ease: 'Power2',
        delay: 500,
        onStart: () => {
          this.userDeckText()
          this.dealerDeckText()
          this.sound.play('card-se')
        }
      })
      return
    }

    // setTimeout(() => {
    this.tweens.add({
      targets: newLayoutImage,
      x: xPos,
      y: yPos,
      duration: 250,
      ease: 'Power2',
      delay: 500,
      onStart: () => {
        this.userDeckText()
        this.dealerDeckText()
        this.sound.play('card-se')
      }
    })
    // }, 4000)

    setTimeout(() => {
      this.add.tween({
        targets: newLayoutImage,
        scaleX: 0,
        ease: 'Power2',
        duration: 500,
        delay: 500,
        onComplete: () => {
          this.#piledLayoutCardsImages.push(newLayoutImage!)
          newLayoutImage!.setTexture(`${card.rank}${card.suit}`)
          this.#layoutCardsImages.push(newLayoutImage!)
          this.add.tween({
            targets: newLayoutImage,
            scaleX: 1,
            ease: 'Power2',
            duration: 500,
            delay: 500
          })
        }
      })
      this.sound.play('card-flip-se')
    }, 1000)
  }

  onCardDrag(cardImage: Image, i: number) {
    const prevX = cardImage.x
    const prevY = cardImage.y

    cardImage.setInteractive()

    this.input.setDraggable(cardImage)

    cardImage.on('pointerover', () => {
      cardImage.scaleX = 1.2
      cardImage.scaleY = 1.2
    })
    cardImage.on('pointerout', () => {
      cardImage.scaleX = 1
      cardImage.scaleY = 1
    })

    cardImage.on('dragstart', (pointer: any, dragX: number, dragY: number) => {
      this.sound.play('card-flip-se')

      // layout cardImageより前面に出す
      this.children.bringToTop(cardImage)
    })
    cardImage.on('drag', (pointer: any, dragX: number, dragY: number) => {
      cardImage.x = dragX
      cardImage.y = dragY
      // extend and shrink repeatedly
      cardImage.scaleX = 1.2
      cardImage.scaleY = 1.2
    })
    cardImage.on('dragend', (pointer: any, dragX: number, dragY: number) => {
      if (this.checkValidMove(cardImage)) {
        // get the overlapped layout
        const layout =
          this.isOverlapped(cardImage, this.#layoutCardsImages[0]) &&
          this.rankIsNextToLayout(cardImage, this.#layoutCardsImages[0])
            ? this.#layoutCardsImages[0]
            : this.#layoutCardsImages[1]
        const layoutIndex = this.#layoutCardsImages.indexOf(layout)
        this.submitCard(this.user, cardImage, layout, i, layoutIndex)
      } else {
        this.toPrevPosition(cardImage, prevX, prevY)
      }

      if (this.user!.hand.length <= 0) {
        // setTimeout(() => {
        this.finalResults()
        // }, 3000)
      }
    })
  }

  checkValidMove(cardImage: Image): boolean {
    // if (!this.table.canSubmit(user) && !this.table.canSubmit(dealer)) return false
    const layout1 = this.#layoutCardsImages[0]
    const layout2 = this.#layoutCardsImages[1]

    return (
      (this.rankIsNextToLayout(cardImage, layout1) &&
        this.isOverlapped(cardImage, layout1)) ||
      (this.rankIsNextToLayout(cardImage, layout2) &&
        this.isOverlapped(cardImage, layout2))
    )
  }

  canSubmit(player: SpeedPlayer | null, handImages: Image[]): boolean {
    for (let handImage of handImages) {
      for (let layoutImage of this.#layoutCardsImages) {
        if (this.rankIsNextToLayout(handImage, layoutImage)) return true
      }
    }
    return false
  }

  promptDealer() {
    setTimeout(() => {
      if (this.canSubmit(this.dealer, this.#dealerHandImages)) {
        setTimeout(() => {
          this.submitCard(this.dealer)
        }, 2000)
      }
      // else if (this.canSubmit(this.user, this.#userHandsImages)) {
      //   return
      // }
      else if (!this.canSubmit(this.user, this.#userHandsImages)) {
        // else {
        // this.#layoutCardsImages = []
        if (this.dealer!.dividedDeck.length > 0) {
          this.#layoutCardsImages = []

          this.setLayoutCardImage(
            this.dealer!,
            this.dealer!.dividedDeck.shift()!,
            null!,
            0
          )
        } else {
          console.log('ディーラーよ、カードを出すのだ')
          this.submitCard(this.dealer)
          // return
        }

        if (this.user!.dividedDeck.length > 0) {
          this.#layoutCardsImages = []

          this.setLayoutCardImage(
            this.user!,
            this.user!.dividedDeck.shift()!,
            null!,
            1
          )
        } else {
          console.log('プレイヤーよ、カードを出すのだ')
          console.log('user first hand: ' + this.user!.hand[0])
          this.submitCard(
            this.user,
            this.#userHandsImages[0],
            this.#layoutCardsImages[1],
            0,
            1
          )
          // return
        }
      }
    }, 2000)

    if (this.dealer!.hand!.length <= 0 || this.user!.hand!.length <= 0) {
      // setTimeout(() => {
      this.finalResults()
      // }, 500)
      return
    }

    setTimeout(() => {
      this.promptDealer()
    }, 3000)
  }

  getRank(cardImage: Image): number {
    if (cardImage.texture.key.substring(0, 2) === '10') return 10

    switch (cardImage.texture.key[0]) {
      case 'A':
        return 1
      case 'J':
        return 11
      case 'Q':
        return 12
      case 'K':
        return 13
      default:
        return parseInt(cardImage.texture.key[0])
    }
  }

  rankIsNextToLayout(cardImage: Image, layoutImage: Image): boolean {
    const cardRank = this.getRank(cardImage)
    const layoutRank = this.getRank(layoutImage)

    return (
      cardRank === layoutRank + 1 ||
      cardRank === layoutRank - 1 ||
      (cardRank === 1 && layoutRank === 13) ||
      (cardRank === 13 && layoutRank === 1)
    )
  }

  isOverlapped(cardImage: Image, layoutImage: Image): boolean {
    const cardBounds = cardImage.getBounds()
    const layoutBounds = layoutImage.getBounds()

    return Phaser.Geom.Intersects.RectangleToRectangle(cardBounds, layoutBounds)
  }

  submitCard(
    player: SpeedPlayer | null,
    cardImage?: Image,
    layoutImage?: Image,
    handIndex?: number,
    layoutIndex?: number
  ) {
    if (player!.hand.length <= 0) return

    if (player!.name === 'Dealer') {
      for (let i = 0; i < this.#dealerHandImages.length; i++) {
        for (let j = 0; j < this.#layoutCardsImages.length; j++) {
          let handImage = this.#dealerHandImages[i]
          let layoutImage = this.#layoutCardsImages[j]

          // ディーラーの山札がない && 出せる手札がない場合は手札０番目を場札０番目に出す
          if (
            player!.dividedDeck.length <= 0 &&
            !this.canSubmit(player, this.#dealerHandImages)
          ) {
            handImage = this.#dealerHandImages[0]
            layoutImage = this.#layoutCardsImages[0]
          }

          if (
            this.rankIsNextToLayout(handImage, layoutImage) ||
            (player!.dividedDeck.length <= 0 &&
              !this.canSubmit(player, this.#dealerHandImages))
          ) {
            this.children.bringToTop(handImage)

            this.add.tween({
              targets: handImage,
              x: layoutImage.x,
              y: layoutImage.y,
              duration: 250,
              ease: 'Power2',
              delay: 500,
              onStart: () => {
                this.sound.play('card-se')
              }
            })

            const card = player!.hand[i]
            const cardIndex = player!.hand.indexOf(card)

            player!.hand.splice(cardIndex, 1)
            this.#dealerHandImages.splice(i, 1)

            handImage!.scaleX = 1
            handImage!.scaleY = 1
            handImage!.disableInteractive()
            handImage!.x = layoutImage!.x

            // this.#userHandsImages.splice(i, 1)
            this.userDeckText()
            this.dealerDeckText()
            this.setLayoutCardImage(this.user!, card, handImage, j)

            if (player!.dividedDeck.length <= 0) return

            this.drawCardImageFromDeck(player!, i)
            return
          }
        }
      }
      return
    }

    handIndex = !handIndex!
      ? this.#userHandsImages.indexOf(cardImage!)
      : handIndex

    const card = player!.hand[handIndex!]
    const cardIndex = player!.hand.indexOf(card)

    player!.hand.splice(cardIndex, 1)
    this.#userHandsImages.splice(handIndex!, 1)

    cardImage!.scaleX = 1
    cardImage!.scaleY = 1
    cardImage!.disableInteractive()
    cardImage!.x = layoutImage!.x

    this.userDeckText()
    this.dealerDeckText()
    this.setLayoutCardImage(this.user!, card, cardImage!, layoutIndex!)
    if (player!.dividedDeck.length <= 0) return

    this.drawCardImageFromDeck(player!, handIndex!)
  }

  drawCardImageFromDeck(player: SpeedPlayer, i: number) {
    // if (this.table!.canSubmit(player)) return
    if (player.dividedDeck.length === 0) return

    // インデックスが-1になることがある
    console.log('draw card index: ' + i)
    i = i === -1 ? 0 : i

    const card = player.dividedDeck.shift()!
    const deckImage =
      player.name === 'Dealer' ? this.#dealerDeckImage : this.#userDeckImage
    const xPos =
      player.name === 'Dealer'
        ? deckImage!.x + 100 + i * 100
        : deckImage!.x - 100 - i * 100
    let cardImage = this.add.image(deckImage!.x, deckImage!.y, 'back')

    this.tweens.add({
      targets: cardImage,
      x: xPos,
      y: deckImage!.y,
      duration: 150,
      ease: 'Power2'
    })

    // setTimeout(() => {
    this.tweens.add({
      targets: cardImage,
      scaleX: 0,
      ease: 'Power2',
      duration: 250,
      delay: 500,
      onComplete: () => {
        cardImage.setTexture(`${card.rank}${card.suit}`)
        this.add.tween({
          targets: cardImage,
          scaleX: 1,
          ease: 'Power2',
          duration: 250,
          delay: 500
        })
      }
    })
    this.sound.play('card-flip-se')
    // }, 200)
    cardImage = this.add.image(xPos, deckImage!.y, `${card.rank}${card.suit}`)

    if (player.name === 'Dealer') {
      this.#dealerHandImages.splice(i, 0, cardImage)
      this.dealer!.hand.splice(i, 0, card)
      cardImage.x = deckImage!.x + 100 + i * 100
    } else {
      this.#userHandsImages.splice(i, 0, cardImage)
      this.user!.hand.splice(i, 0, card)
      cardImage.x = deckImage!.x - 100 - i * 100
      this.onCardDrag(cardImage, i)
    }
  }
  toPrevPosition(gameObject: Image, prevX: number, prevY: number) {
    this.tweens.add({
      targets: gameObject,
      x: prevX,
      y: prevY,
      ease: 'Power2',
      duration: 100
    })
  }

  finalResults() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#userCardsText?.destroy()
    this.#dealerCardsText?.destroy()

    // this.#userHandsImages.forEach((card: Image) => card.destroy())
    // this.#dealerHandImages.forEach((card: Image) => card.destroy())
    // this.#piledLayoutCardsImages.forEach((card: Image) => card.destroy())

    const resultText = this.add.text(400, 50, '', {
      fontSize: '30px',
      color: 'orange',
      fontFamily: 'pixel'
    })

    if (this.user!.hand.length <= 0) {
      resultText.setText(
        `🏆You Win!\nディーラートノ差: ${
          this.dealer!.hand.length + this.dealer!.dividedDeck.length
        }マイ`
      )
      this.sound.play('win-se')
    } else if (this.dealer!.hand.length <= 0) {
      resultText.setText(
        `You Lose...\nディーラートノ差: ${
          this.dealer!.hand.length + this.dealer!.dividedDeck.length
        }マイ`
      )
      this.sound.play('lose-se')
    }

    this.againButton()
    this.backButton()
  }

  againButton() {
    return new Button(
      this,
      500,
      500,
      'Again',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        this.table = new SpeedTable('speed', this.user!.name, this.difficulty)

        SpeedController.startGame(this.table!)
      }
    )
  }

  backButton() {
    return new Button(
      this,
      500,
      600,
      'Back',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        Controller.renderModeSelectPage(
          ['blackjack', 'war', 'poker', 'speed'],
          this.user!.name
        )
      }
    )
  }
  static createTutorialView() {}
}
