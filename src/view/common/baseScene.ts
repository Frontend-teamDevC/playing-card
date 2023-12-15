import Phaser from 'phaser'
import Zone = Phaser.GameObjects.Zone
import Text = Phaser.GameObjects.Text

export class BaseScene extends Phaser.Scene {
  #gameZone: Zone | null = null
  #moneyText: Text | null = null
  #nameText: Text | null = null
  #username: string = ''

  create(data: any) {
    console.log(data)

    const table = data.table
    this.add.image(0, 0, 'background').setOrigin(0)
    this.createGameZone()
    this.createNameText(table.players[0].name)
  }

  createGameZone() {
    this.add.zone(0, 0, 800, 600).setOrigin(0).setInteractive()
  }

  createNameText(username: string) {
    this.#nameText = this.add.text(0, 0, `${username}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
  }
}
