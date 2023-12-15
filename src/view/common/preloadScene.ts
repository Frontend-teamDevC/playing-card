import Phaser from 'phaser'
import { CardConfig } from '../../config/cardConfig'

export class PreloadScene extends Phaser.Scene {
  #progressBox: Phaser.GameObjects.Graphics | null = null
  #progressBar: Phaser.GameObjects.Graphics | null = null
  #loadText: Phaser.GameObjects.Text | null = null
  #percenage: Phaser.GameObjects.Text | null = null

  preload() {
    const { width, height } = this.cameras.main

    // 背景
    this.#progressBox = this.add.graphics()
    this.#progressBox.fillStyle(0x222222, 0.8)
    this.#progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

    // プログレスバー
    this.#progressBar = this.add.graphics()

    // プログレスバーのテキスト
    this.#loadText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace'
      }
    })
    this.#loadText.setOrigin(0.5, 0.5)

    // ロード中
    this.load.on('progress', (value: number) => {
      if (this.#percenage && this.#progressBar) {
        this.#percenage.setText(`${Math.floor(value * 100)}%`)
        this.#progressBar.clear()
        this.#progressBar.fillStyle(0xffffff, 1)
        this.#progressBar.fillRect(
          width / 2 - 150,
          height / 2 - 15,
          300 * value,
          30
        )
      }
    })

    // アセットのロード
    // カード画像
    const suits = CardConfig.suits
    const ranks = CardConfig.ranks
    suits.forEach((suit: string) => {
      ranks.forEach((rank: string) => {
        this.load.image(`${rank}${suit}`, `assets/cards/${rank}${suit}.png`)
      })
    })

    this.load.image('back', 'assets/cards/backB.png')

    // ボタン画像
    this.load.image('coin', 'assets/coin.gif')
    this.load.image('orange-button', 'assets/ui/orange-button.png')
    this.load.image('blue-button', 'assets/ui/blue-button.png')

    // 背景画像
    this.load.image('background', 'assets/ui/background.jpeg')
    // BGM

    // SE
    this.load.audio('coin-se', 'assets/sounds/coin-se.ogg')

    this.load.audio('card-se', 'assets/sounds/card-se.mp3')
    this.load.audio('card-flip-se', 'assets/sounds/card-flip-se.mp3')

    this.load.audio('hover-se', 'assets/sounds/hover-se.wav')
    this.load.audio('select-se', 'assets/sounds/select-se.wav')

    this.load.audio('win-se', 'assets/sounds/win-se.mp3')
    this.load.audio('lose-se', 'assets/sounds/lose-se.mp3')
  }

  create(data: any) {
    this.#percenage = this.make.text({
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      text: '0%',
      style: {
        font: '18px monospace',
        fontFamily: 'pixel'
      }
    })
    this.#percenage.setOrigin(0.5, 0.5)

    this.#progressBox?.destroy()
    this.#progressBar?.destroy()
    this.#loadText?.destroy()
    this.#percenage?.destroy()

    console.log(data.table)
    if (data.table.gameType === 'blackjack') {
      this.scene.start('blackjack', { table: data.table })
    }
  }
}
