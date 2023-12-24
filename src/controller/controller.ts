import { Config } from '../config/pageConfig'
import BlackjackTable from '../model/blackjack/blackjackTable'
import WarTable from '../model/war/warTable'
import PokerTable from "../model/poker/pokerTable";
import { InitialView } from '../view/initialView'
import { ModeSelectView } from '../view/modeSelectView'
import { BlackjackController } from './blackjackController'
import { WarController } from './warController'
import { PokerController } from './pokerController'

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
        this.renderModeSelectPage(['blackjack', 'war', "poker"], nameInput.value)
      }
    })
  }

  /*
  renderModeSelectPage(modeList: string[], username?: string): void
  モード選択ページを描画する
  */
  static renderModeSelectPage(modeList: string[], username?: string): void {
    console.log(username)
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
            // BlackjackView.renderTutorial()
            break
          case 'war':
            // WarView.renderTutorial()
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
        console.log(difficulty)
      })
      // change maxRounds when roundsSelector is changed
      roundsSelector.addEventListener('change', () => {
        maxRounds = parseInt(roundsSelector.value)
        console.log(maxRounds)
      })

      console.log(difficultySelector.value)
      playButton!.addEventListener('click', () => {
        switch (mode) {
          case 'blackjack':
            Config.displayNone()
            // back buttonだけ残す
            const backButton = ModeSelectView.backButton()
            backButton!.addEventListener('click', () => {
              Config.displayNone()
              this.renderModeSelectPage(['blackjack', 'war'])
            })

            // render game scene
            const table = new BlackjackTable(
              'blackjack',
              username!,
              difficulty,
              maxRounds
            )
            BlackjackController.startGame(table)
            break
          case 'war':
            Config.displayNone()
            // render game scene
            const tableWar = new WarTable('war')
            WarController.startGame(tableWar)
            // WarController.renderInitialPage()
            break
          case "poker":
            console.log('poker clicked')
            Config.displayNone()
            const pokerTable = new PokerTable("poker", 5);
            PokerController.startGame(pokerTable);
            break;
        }
      })
    }
  }
}
