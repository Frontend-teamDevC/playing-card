import Phaser from 'phaser'

export class BaseScene extends Phaser.Scene {
  create(data: any) {
    console.log(data)

    const table = data.table
    this.add.image(0, 0, 'background').setOrigin(0)
    this.createGameZone()
    this.createNameText(table.players[0].name)
  }

  createGameZone() {
    this.add.zone(0, 0, 800, 600).setOrigin(0)
  }

  createNameText(username: string) {
    this.add.text(5, 0, `${username}`, {
      fontSize: '30px',
      color: '#ffffff',
      fontFamily: 'pixel'
    })
  }
}
