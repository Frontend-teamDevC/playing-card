import Phaser from 'phaser'
import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Sound = Phaser.Sound.BaseSound

export class Button extends Phaser.GameObjects.Container {
  #image: Image
  #text: Text
  #sound: Sound

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    key: string,
    soundKey: string,
    callback: () => void
  ) {
    super(scene, x, y)

    this.#image = new Image(scene, 0, 0, key)

    this.#sound = scene.sound.add(soundKey)
    this.#image.setInteractive()
    this.#image.on('pointerdown', () => {
      this.#image.y += 4
      this.#text.y += 4
    })
    this.#image.on('pointerup', () => {
      callback()
      this.#sound.play()
      this.#image.y -= 4
      this.#text.y -= 4
    })
    this.#image.on('pointerover', () => {
      this.#image.setTint(0xcccccc)
      const hoverSound = scene.sound.add('hover-se')
      hoverSound.play()
    })
    this.#image.on('pointerout', () => {
      this.#image.clearTint()
      if (this.#image.y > 0) {
        this.#image.y -= 4
        this.#text.y -= 4
      }
    })

    this.#text = new Phaser.GameObjects.Text(scene, 0, 0, text, {
      color: '#000000',
      fontSize: '20px',
      fontFamily: 'pixel'
    })

    // adjust image size
    const { width, height } = this.#text
    this.#image.displayWidth = width + 20
    this.#image.displayHeight = height + 20

    // adjust text position
    this.#text.x = -width / 2
    this.#text.y = -height / 2

    this.add(this.#image)
    this.add(this.#text)

    scene.add.existing(this)
  }

  setText(text: string) {
    this.#text.setText(text)
    const { width, height } = this.#text
    this.#image.displayWidth = width + 20
    this.#image.displayHeight = height + 20
    this.#text.x = -width / 2
    this.#text.y = -height / 2
  }
}
