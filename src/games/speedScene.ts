import { Controller } from '../controller/controller'
import SpeedTable from '../model/speed/speedTable'
import Player from '../model/common/player'
import { BaseScene } from './common/baseScene'
import { Button } from './common/button'
import Text = Phaser.GameObjects.Text
import Image = Phaser.GameObjects.Image

export class SpeedScene extends BaseScene {
  table: SpeedTable | null = null
  user: Player | null = null
  dealer: Player | null = null
  difficulty: string = ''

  #userDeckCount: number = 0
  #dealerDeckCount: number = 0
  #userDeckText: Text | null = null
  #dealerDeckText: Text | null = null

  #countDownText: Text | null = null

  #againButton: Button | null = null
  #backButton: Button | null = null

  #playerNameTexts: Text[] = []

  #playersHandsImages: Image[] = []
  #dealerHandImages: Image[] = []

  create(data: any) {
    super.create(data)

    // reset all the scene
    this.#playersHandsImages = []
    this.#dealerHandImages = []

    // this.table = data.table
    // this.user = this.table!.players[0]
    // this.dealer = this.table!.dealer
    // this.difficulty = this.table!.difficulty

    this.renderScene()
  }

  renderScene() {
    // this.userDeckCount()
    // this.dealerDeckCount()
    // if () {
    //   this.finalResults()
    //   return
    // }
  }

  countDown() {
    let count = 3
    const countDownText = this.add.text(400, 300, count.toString(), {
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
        this.renderScene()
      }
    }, 1000)
  }

  userDeckText() {
    this.#userDeckText?.destroy()

    const userDeckText = this.add.text(100, 400, `${this.#userDeckCount}`, {
      fontSize: '30px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
    this.#userDeckText = userDeckText
  }

  dealerDeckText() {
    this.#dealerDeckText?.destroy()

    const dealerDeckText = this.add.text(100, 100, `${this.#dealerDeckCount}`, {
      fontSize: '30px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
    this.#dealerDeckText = dealerDeckText
  }

  dealInitialHandsAndDecks() {
    const dealerHands = this.table!.dealer.hand
    for (let i = 0; i < dealerHands.length; i++) {
      const card = dealerHands[i]

      // move card from the top center to the dealer's hand with sound
      const cardImage = this.add.image(400, 0, 'back')
      this.tweens.add({
        targets: cardImage,
        x: 480 + i * 25,
        y: 180,
        duration: 1000,
        ease: 'Power2',
        delay: i * 100
      })

      this.sound.play('card-se')
      this.#dealerHandImages.push(cardImage)
    }

    const userHands = this.user!.hand
    for (let i = 0; i < userHands.length; i++) {
      const card = userHands[i]

      // move card from the top center to the user's hand with sound
      const cardImage = this.add.image(400, 600, 'back')
      this.tweens.add({
        targets: cardImage,
        x: 480 + i * 25,
        y: 420,
        duration: 1000,
        ease: 'Power2',
        delay: i * 100
      })

      this.sound.play('card-se')
      this.#playersHandsImages.push(cardImage)
    }
  }

  drawCard(player: Player) {
    // if(this.table.userDeck.length === 0) return
  }

  setLayoutCards() {}

  finalResults() {
    // destroy previous texts
    this.#playerNameTexts.forEach((text: Text) => text.destroy())
    this.#userDeckText?.destroy()
    this.#dealerDeckText?.destroy()

    this.#playersHandsImages.forEach((card: Image) => card.destroy())
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
