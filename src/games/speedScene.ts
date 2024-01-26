import { Controller } from '../controller/controller'
import { SpeedController } from '../controller/speedController'
import Card from '../model/common/card'
import SpeedPlayer from '../model/speed/speedPlayer'
import SpeedTable from '../model/speed/speedTable'
import { BaseScene } from './common/baseScene'
import { Button } from './common/button'
import Text = Phaser.GameObjects.Text
import Image = Phaser.GameObjects.Image

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

  /**
   * SpeedSceneを初期化する関数
   *
   * @param {any} data - SpeedTableのインスタンスを含むデータ
   * @returns {void}
   */
  create(data: any): void {
    super.create(data)

    this.#userHandsImages = []
    this.#dealerHandImages = []

    this.table = data.table
    this.user = this.table!.user
    this.dealer = this.table!.dealer
    this.difficulty = this.table!.difficulty

    this.renderScene()
  }

  /**
   * SpeedSceneの描画を行う関数
   * @returns {void}
   */
  renderScene(): void {
    this.arrowBackButton()

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

  /**
   * カウントダウンテキストを表示する関数
   *
   * @returns {void}
   */
  countDown(): void {
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

  /**
   * userDeckText() : void
   * ユーザーの山札のテキストを表示する関数
   *
   * @param {void}
   * @returns {void}
   *
   */
  userDeckText(): void {
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

  /**
   * dealerDeckText() : void
   * ディーラーの山札のテキストを表示する関数
   *
   * @param {void}
   * @returns {void}
   */
  dealerDeckText(): void {
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

  /**
   * 両者の初期手札と山札を描画する関数
   * @param {void}
   * @returns {void}
   *
   */
  dealInitialHandsAndDecks(): void {
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

  /**
   *
   * @param player - 手札を出すプレイヤー
   * @param card - 場札に出すカードの情報
   * @param cardImage - 場札に出すカードの画像
   * @param layoutIndex - 場札のインデックス
   * @returns {void}
   */
  setLayoutCardImage(
    player: SpeedPlayer,
    card: Card,
    cardImage: Image,
    layoutIndex: number
  ): void {
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

  /**
   * プレイヤー側の手札をドラッグ可能にする関数
   *
   * @param cardImage - ドラッグ可能にするカードの画像
   * @param i - カードのインデックス
   * @returns {void}
   */
  onCardDrag(cardImage: Image, i: number): void {
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

    cardImage.on('dragstart', () => {
      // return if both players cannot submit
      if (
        !this.canSubmit(this.#userHandsImages) &&
        !this.canSubmit(this.#dealerHandImages)
      ) {
        this.toPrevPosition(cardImage, prevX, prevY)
        return
      }

      this.sound.play('card-flip-se')
    })
    cardImage.on('drag', (_pointer: any, dragX: number, dragY: number) => {
      // return if both players cannot submit
      if (
        (!this.canSubmit(this.#userHandsImages) &&
          !this.canSubmit(this.#dealerHandImages)) ||
        this.#layoutCardsImages.length <= 0
      ) {
        this.toPrevPosition(cardImage, prevX, prevY)
        return
      }

      cardImage.x = dragX
      cardImage.y = dragY

      cardImage.scaleX = 1.2
      cardImage.scaleY = 1.2
      // layout cardImageより前面に出す
      this.children.bringToTop(cardImage)
    })
    cardImage.on('dragend', () => {
      if (this.checkValidMove(cardImage)) {
        // get the overlapped layout
        const layout =
          this.isOverlapped(cardImage, this.#layoutCardsImages[0]) &&
          this.rankIsNextToLayout(cardImage, this.#layoutCardsImages[0])
            ? this.#layoutCardsImages[0]
            : this.#layoutCardsImages[1]
        const layoutIndex = this.#layoutCardsImages.indexOf(layout)
        this.submitCard(this.user, cardImage, layout, i, layoutIndex)
        this.children.bringToTop(cardImage)
      } else {
        this.toPrevPosition(cardImage, prevX, prevY)
      }

      if (this.user!.hand.length <= 0) {
        this.finalResults()
      }
    })
  }

  /**
   * ドラッグされたカードが場札に出せるかどうかを判定する関数
   *
   * @param cardImage - ドラッグされたカードの画像
   * @returns {boolean}
   */
  checkValidMove(cardImage: Image): boolean {
    const layout1 = this.#layoutCardsImages[0]
    const layout2 = this.#layoutCardsImages[1]

    return (
      (this.rankIsNextToLayout(cardImage, layout1) &&
        this.isOverlapped(cardImage, layout1)) ||
      (this.rankIsNextToLayout(cardImage, layout2) &&
        this.isOverlapped(cardImage, layout2))
    )
  }

  /**
   * プレイヤーが手札を出せるかどうかを判定する関数
   *
   * @param handImages - プレイヤーの手札の画像の配列
   * @returns {boolean}
   */
  canSubmit(handImages: Image[]): boolean {
    for (let handImage of handImages) {
      for (let layoutImage of this.#layoutCardsImages) {
        if (this.rankIsNextToLayout(handImage, layoutImage)) return true
      }
    }
    return false
  }

  /**
   * ディーラーの行動を決定する関数
   *
   * @param {void}
   * @returns {void}
   */
  promptDealer(): void {
    setTimeout(() => {
      if (this.canSubmit(this.#dealerHandImages)) {
        setTimeout(() => {
          this.submitCard(this.dealer)
        }, 2000)
      } else if (!this.canSubmit(this.#userHandsImages)) {
        if (this.dealer!.dividedDeck.length > 0) {
          this.#layoutCardsImages = []

          this.setLayoutCardImage(
            this.dealer!,
            this.dealer!.dividedDeck.shift()!,
            null!,
            0
          )
        } else {
          this.submitCard(this.dealer)
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
          this.submitCard(
            this.user,
            this.#userHandsImages[0],
            this.#layoutCardsImages[1],
            0,
            1
          )
        }
      }
    }, 2000)

    if (this.dealer!.hand!.length <= 0 || this.user!.hand!.length <= 0) {
      this.finalResults()
      return
    }

    setTimeout(() => {
      this.promptDealer()
    }, 3000)
  }

  /**
   * カードのランクの数値を返す関数
   *
   * @param {Image} cardImage - カードの画像
   * @returns {number}
   */
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

  /**
   * 提出されたカードのランクが場札のランクの隣かどうかを判定する関数
   *
   * @param {Image} cardImage - カードの画像
   * @param {Image} layoutImage - 場札の画像
   * @returns {boolean}
   */
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

  /**
   * ドラッグアウトされたカードが場札の上に重なっているかどうかを判定する関数
   *
   * @param cardImage - カードの画像
   * @param layoutImage - 場札の画像
   * @returns {boolean}
   */
  isOverlapped(cardImage: Image, layoutImage: Image): boolean {
    const cardBounds = cardImage.getBounds()
    const layoutBounds = layoutImage.getBounds()

    return Phaser.Geom.Intersects.RectangleToRectangle(cardBounds, layoutBounds)
  }

  /**
   * 指定されたプレイヤー側の手札を場札に出す関数
   *
   * @param player - 手札を出すプレイヤー
   * @param cardImage - 場札に出すカードの画像
   * @param layoutImage - 場札の画像
   * @param handIndex - 手札のインデックス
   * @param layoutIndex - 場札のインデックス
   * @returns {void}
   */
  submitCard(
    player: SpeedPlayer | null,
    cardImage?: Image,
    layoutImage?: Image,
    handIndex?: number,
    layoutIndex?: number
  ): void {
    if (player!.hand.length <= 0) return

    if (player!.name === 'Dealer') {
      for (let i = 0; i < this.#dealerHandImages.length; i++) {
        for (let j = 0; j < this.#layoutCardsImages.length; j++) {
          let handImage = this.#dealerHandImages[i]
          let layoutImage = this.#layoutCardsImages[j]

          // Bug: ディーラーの山札がない && 出せる手札がない場合は手札０番目を場札０番目に出すようにする
          if (
            player!.dividedDeck.length <= 0 &&
            !this.canSubmit(this.#dealerHandImages)
          ) {
            handImage = this.#dealerHandImages[0]
            layoutImage = this.#layoutCardsImages[0]
          }

          if (
            this.rankIsNextToLayout(handImage, layoutImage) ||
            (player!.dividedDeck.length <= 0 &&
              !this.canSubmit(this.#dealerHandImages))
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

  /**
   * プレイヤーの山札からカードを引いて手札に加える関数
   *
   * @param player - 山札からカードを引くプレイヤー
   * @param i - 手札のインデックス
   * @returns {void}
   */
  drawCardImageFromDeck(player: SpeedPlayer, i: number): void {
    if (player.dividedDeck.length === 0) return

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

  /**
   * ゲームの最終結果画面を表示する関数
   *
   * @returns {void}
   */
  finalResults(): void {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#userCardsText?.destroy()
    this.#dealerCardsText?.destroy()

    // desable interactive if there are user hands left
    this.#userHandsImages.forEach((cardImage: Image) => {
      cardImage.disableInteractive()
    })

    this.add.image(540, 360, 'board')

    const resultText = this.add
      .text(540, 300, '', {
        fontSize: '24px',
        color: 'black'
      })
      .setOrigin(0.5, 0)

    if (this.user!.hand.length <= 0) {
      resultText.setText(
        `🏆You Win!\nディーラーとの差: ${
          this.dealer!.hand.length + this.dealer!.dividedDeck.length
        }枚`
      )
      this.sound.play('win-se')
    } else if (this.dealer!.hand.length <= 0) {
      resultText.setText(
        `You Lose...\nディーラーとの差: ${
          this.dealer!.hand.length + this.dealer!.dividedDeck.length
        }枚`
      )
      this.sound.play('lose-se')
    }

    this.againButton()
    this.backButton()
  }

  /**
   * もう一度遊ぶボタンを表示する関数
   * @returns {Button} - もう一度遊ぶボタン
   * */
  againButton(): Button {
    return new Button(
      this,
      540,
      400,
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

  /**
   * モード選択画面に戻るボタンを表示する関数
   * @returns {Button} - モード選択画面に戻るボタン
   * */
  backButton(): Button {
    return new Button(
      this,
      540,
      550,
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
