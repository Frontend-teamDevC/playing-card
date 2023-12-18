import { Controller } from '../controller/controller'
import Card from '../model/common/card'
import SpeedTable from '../model/speed/speedTable'
import { BaseScene } from './common/baseScene'
import { Button } from './common/button'
import Text = Phaser.GameObjects.Text
import Image = Phaser.GameObjects.Image
import SpeedPlayer from '../model/speed/speedPlayer'

export class SpeedScene extends BaseScene {
  table: SpeedTable | null = null
  user: SpeedPlayer | null = null
  dealer: SpeedPlayer | null = null
  difficulty: string = ''

  #userCardsText: Text | null = null
  #dealerCardsText: Text | null = null

  #countDownText: Text | null = null

  #againButton: Button | null = null
  #backButton: Button | null = null

  #playerNameTexts: Text[] = []

  #userHandsImages: Image[] = []
  #dealerHandImages: Image[] = []
  #userDeckImage: Image | null = null
  #dealerDeckImage: Image | null = null
  #layoutCardsImages: Image[] = []

  create(data: any) {
    super.create(data)

    // reset all the scene
    this.#userHandsImages = []
    this.#dealerHandImages = []

    this.table = data.table
    this.user = this.table!.user
    this.dealer = this.table!.dealer
    this.difficulty = this.table!.difficulty

    this.renderScene()
  }

  renderScene() {
    // this.userDeckCount()
    // this.dealerDeckCount()
    if (
      this.dealer!.dividedDeck!.length === 0 ||
      this.user!.dividedDeck!.length === 0
    ) {
      setTimeout(() => {
        this.finalResults()
      }, 5000)
      this.finalResults()
      return
    }

    this.dealInitialHandsAndDecks()
    this.setLayoutCardImage(this.table!.layoutCards[0])
    this.setLayoutCardImage(this.table!.layoutCards[1])
    setTimeout(() => {
      this.countDown()
    }, 6000)

    setTimeout(() => {
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
    this.#countDownText = countDownText
    const countDownInterval = setInterval(() => {
      count--
      countDownText.setText(count.toString())
      if (count === 0) {
        clearInterval(countDownInterval)
        countDownText.destroy()
        // start text for 1 second
        const startText = this.add.text(400, 300, 'Start!', {
          fontSize: '100px',
          color: '#ffffff',
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
    const dealerDeckImage = this.add.image(300, 150, 'back')
    this.#dealerDeckImage = dealerDeckImage
    this.dealerDeckText()
    const dealerHands = this.table!.dealer.hand
    for (let i = 0; i < dealerHands.length; i++) {
      const card = dealerHands[i]

      // move card from the top center to the dealer's hand with sound
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

    const userDeckImage = this.add.image(800, 450, 'back')
    this.#userDeckImage = userDeckImage
    this.userDeckText()
    const userHands = this.user!.hand
    for (let i = 0; i < userHands.length; i++) {
      const card = userHands[i]
      // move card from the top center to the user's hand with sound
      const cardImage = this.add.image(userDeckImage.x, userDeckImage.y, 'back')

      // play sound for each card

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

  setLayoutCardImage(card: Card, cardImage?: Image) {
    const i = this.table!.layoutCards.indexOf(card)
    const xPos =
      i === 0 ? this.#dealerDeckImage!.x + 150 : this.#userDeckImage!.x - 150
    const yPos =
      i === 0 ? this.#dealerDeckImage!.y + 150 : this.#userDeckImage!.y - 150
    if (cardImage) {
      console.log(cardImage)
      this.tweens.add({
        targets: cardImage,
        x: xPos,
        y: yPos,
        duration: 250,
        ease: 'Power2',
        delay: 500,
        onStart: () => {
          this.sound.play('card-se')
        }
      })

      this.#layoutCardsImages.splice(i, 1, cardImage)
      console.log(this.#layoutCardsImages)
      return
    }

    const deckImage = i === 0 ? this.#dealerDeckImage : this.#userDeckImage
    const layoutImage = this.add.image(deckImage!.x, deckImage!.y, 'back')

    this.#layoutCardsImages.push(layoutImage!)

    setTimeout(() => {
      this.tweens.add({
        targets: layoutImage,
        x: xPos,
        y: yPos,
        duration: 250,
        ease: 'Power2',
        delay: 500,
        onStart: () => {
          this.sound.play('card-se')
        }
      })
    }, 4000)

    setTimeout(() => {
      this.add.tween({
        targets: layoutImage,
        scaleX: 0,
        ease: 'Power2',
        duration: 500,
        delay: 500,
        onComplete: () => {
          layoutImage.setTexture(`${card.rank}${card.suit}`)
          this.add.tween({
            targets: layoutImage,
            scaleX: 1,
            ease: 'Power2',
            duration: 500,
            delay: 500
          })
        }
      })
      this.sound.play('card-flip-se')
    }, 5000)
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
      console.log(this.#layoutCardsImages[0].texture.key[0])
      console.log(this.#layoutCardsImages[1].texture.key[0])

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
        this.submitCard(this.user, cardImage, layout, i)
      } else {
        this.toPrevPosition(cardImage, prevX, prevY)
      }
    })
  }

  checkValidMove(cardImage: Image): boolean {
    // if (!this.table.canSubmit(user) && !this.table.canSubmit(dealer)) return false
    const layout1 = this.#layoutCardsImages[0]
    const layout2 = this.#layoutCardsImages[1]

    // when dragging the card to overrap the layout's position, if the card is valid, return true

    return (
      (this.rankIsNextToLayout(cardImage, layout1) &&
        this.isOverlapped(cardImage, layout1)) ||
      (this.rankIsNextToLayout(cardImage, layout2) &&
        this.isOverlapped(cardImage, layout2))
    )
  }

  getRank(cardImage: Image): number {
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
        return parseInt(cardImage.texture.key)
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
    cardImage: Image,
    layoutImage: Image,
    i: number
  ) {
    if (player!.hand.length === 0) return
    const card = player!.hand[i]
    const cardIndex = player!.hand.indexOf(card)
    const layoutIndex = this.table!.layoutCards.indexOf(
      this.table!.layoutCards.find(
        (card: Card) =>
          card.rank === layoutImage.texture.key[0] &&
          card.suit === layoutImage.texture.key[1]
      )!
    )
    console.log(layoutIndex)

    player!.hand.splice(cardIndex, 1)
    // remove the layout card and insert the card to the layout
    this.table!.layoutCards.splice(layoutIndex, 1, card)

    cardImage.scaleX = 1
    cardImage.scaleY = 1
    cardImage.disableInteractive()
    // card's position is set to the layout's position
    cardImage.x = layoutImage.x

    this.#userHandsImages.splice(i, 1)
    this.userDeckText()
    this.dealerDeckText()
    this.drawCardImageFromDeck(player!, i)

    this.setLayoutCardImage(card, cardImage)
  }

  drawCardImageFromDeck(player: SpeedPlayer, i: number) {
    // if (this.table!.canSubmit(player)) return
    if (player.dividedDeck.length === 0) return

    const card = player.dividedDeck.shift()!
    const cardImage = this.add.image(
      this.#userDeckImage!.x,
      this.#userDeckImage!.y,
      'back'
    )
    this.#userHandsImages.push(cardImage)
    this.user!.hand.push(card)

    setTimeout(() => {
      this.tweens.add({
        targets: cardImage,
        x: this.#userDeckImage!.x - 100 - i * 100,
        y: this.#userDeckImage!.y,
        duration: 150,
        ease: 'Power2'
      })
    }, 100)

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
            duration: 150,
            delay: 500
          })
        }
      })
      this.sound.play('card-flip-se')
    }, 200)

    cardImage.x = this.#userDeckImage!.x - 100 - i * 100
    this.onCardDrag(cardImage, i)

    if (player.name === 'Dealer') {
      this.#dealerHandImages.splice(i, 1, cardImage)
    } else {
      this.#userHandsImages.splice(i, 1, cardImage)
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

    this.#userHandsImages.forEach((card: Image) => card.destroy())
    this.#dealerHandImages.forEach((card: Image) => card.destroy())

    this.againButton()
    this.backButton()
  }

  againButton() {
    const againButton = new Button(
      this,
      500,
      500,
      'Again',
      'orange-button',
      'select-se',
      () => {
        this.table = new SpeedTable(
          'blackjack',
          this.user!.name,
          this.difficulty
        )
        this.user = this.table.user
        this.dealer = this.table.dealer
        this.create({ table: this.table })
      }
    )
    this.#againButton = againButton
  }

  backButton() {
    const backButton = new Button(
      this,
      500,
      600,
      'Back',
      'orange-button',
      'select-se',
      () => {
        const root = document.getElementById('app')
        root!.innerHTML = ''
        Controller.renderModeSelectPage(['blackjack', 'war'], 'player')
      }
    )
    this.#backButton = backButton
  }
  static createTutorialView() {}
}
