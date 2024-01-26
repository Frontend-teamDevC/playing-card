// import Phaser from 'phaser'
import { PreloadScene } from './preloadScene'

export class BaseScene extends PreloadScene {
  create(data: any) {
    const table = data.table
    this.add.image(0, 0, 'background').setOrigin(0)
    this.createGameZone()
    if (table.gameType !== 'poker' && table.gameType !== 'war') {
      this.createNameText(table.user.name)
    }
  }

  createGameZone() {
    this.add.zone(0, 0, 800, 600).setOrigin(0)
  }

  createNameText(username: string) {
    this.add.text(900, 0, `${username}`, {
      fontSize: '30px',
      color: '#ffffff'
    })
  }
}
