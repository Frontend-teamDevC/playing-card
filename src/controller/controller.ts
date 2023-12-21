import { Config } from '../config/pageConfig'
import BlackjackTable from '../model/blackjack/blackjackTable'
import WarTable from '../model/war/warTable'
import SpeedTable from '../model/speed/speedTable'
import { InitialView } from '../view/initialView'
import { ModeSelectView } from '../view/modeSelectView'
import { BlackjackController } from './blackjackController'
import { WarController } from './warController'
import { SpeedController } from './speedController'

export class Controller {
  /*
  renderInitialPage(): void
  最初のページを描画する
  */
  static renderInitialPage(): void {
    InitialView.create()
    // add event listener to button
    const startButton = document.getElementById('start-button')
    startButton!.addEventListener('click', () => {
      const nameInput = document.getElementById(
        'name-input'
      ) as HTMLInputElement
      if (nameInput.value) {
        Config.displayNone()
        this.renderModeSelectPage(
          ['blackjack', 'war', 'poker', 'speed'],
          nameInput.value
        )
      }
    })
  }

  /*
  renderModeSelectPage(modeList: string[], username?: string): void
  モード選択ページを描画する
  */
  static renderModeSelectPage(modeList: string[], username?: string): void {
    ModeSelectView.create()

    const backButton = document.querySelector('.back-button')
    backButton!.addEventListener('click', () => {
      Config.displayNone()
      this.renderInitialPage()
    })
    // add event listeners to buttons
    for (let mode of modeList) {
      const tutoButton = document.querySelector(`.${mode}-tuto-button`)
      tutoButton!.addEventListener('click', () => {
        // clear and render the tutorial page
        switch (mode) {
          case 'blackjack':
            break
          case 'war':
            break
          case 'poker':
            break
          case 'speed':
            break
        }
      })

      const playButton = document.querySelector(`.${mode}-play-button`)

      // get value from pull down menus
      const difficultySelector = document.querySelector(
        '.blackjack-difficulty'
      ) as HTMLSelectElement
      const roundsSelector = document.querySelector(
        '.blackjack-rounds'
      ) as HTMLSelectElement

      let difficulty = difficultySelector.value
      let maxRounds = parseInt(roundsSelector.value)
      // change difficulty when difficultySelector is changed
      difficultySelector.addEventListener('change', () => {
        difficulty = difficultySelector.value
      })
      // change maxRounds when roundsSelector is changed
      roundsSelector.addEventListener('change', () => {
        maxRounds = parseInt(roundsSelector.value)
        console.log(maxRounds)
      })

      playButton!.addEventListener('click', () => {
        // back buttonだけ残す
        console.log(mode)
        switch (mode) {
          case 'blackjack':
            Config.displayNone()

            // render game scene
            BlackjackController.startGame(
              new BlackjackTable('blackjack', username!, difficulty, maxRounds)
            )
            break
          case 'war':
            break
          case 'poker':
            Config.displayNone()
            break
          case 'speed':
            console.log('start speed game')
            Config.displayNone()
            SpeedController.startGame(
              new SpeedTable('speed', username!, difficulty)
            )
        }
      })
    }
  }
}
