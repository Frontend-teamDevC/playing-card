import { Config } from '../config/pageConfig'
import BlackjackTable from '../model/blackjack/blackjackTable'
import WarTable from '../model/war/warTable'
import SpeedTable from '../model/speed/speedTable'
import { InitialView } from '../view/initialView'
import { ModeSelectView } from '../view/modeSelectView'
import { ModeDetail } from '../view/modeDetail'
import GameGuide from '../view/game-guide'
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
          ['blackjack', 'poker', 'war', 'speed'],
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
    // ModeSelectView.create(modeList)
    ModeSelectView.render(modeList)

    const backButton = document.getElementById('backButton')
    backButton!.addEventListener('click', () => {
      Config.displayNone()
      this.renderInitialPage()
    })
    for (let mode of modeList) {
      const playButton = document.getElementById(`${mode}`)
      playButton!.addEventListener('click', () => {
        switch (mode) {
          case 'blackjack':
            Config.displayNone()
            this.renderGamePage(mode, username)
            break
          case 'war':
            Config.displayNone()
            this.renderGamePage(mode, username)
            break
          case 'poker':
            break
          case 'speed':
            Config.displayNone()
            this.renderGamePage(mode, username)
            break
        }
      })
    }
  }

  static renderGamePage(mode: string, username?: string): void {
    Config.displayNone()
    ModeDetail.render(mode)

    const difficultySelector = document.getElementById(
      'difficulty'
    ) as HTMLSelectElement

    const roundsSelector = document.getElementById(
      'rounds'
    ) as HTMLSelectElement

    let difficulty: string
    let maxRounds: number
    if (difficultySelector) {
      difficulty = difficultySelector.value

      difficultySelector.addEventListener('change', () => {
        difficulty = difficultySelector.value
        console.log(difficulty)
      })
    }
    if (roundsSelector) {
      maxRounds = parseInt(roundsSelector.value)

      roundsSelector.addEventListener('change', () => {
        maxRounds = parseInt(roundsSelector.value)
        console.log(maxRounds)
      })
    }

    document.getElementById('backButton')!.addEventListener('click', () => {
      Config.displayNone()
      this.renderModeSelectPage(
        ['blackjack', 'poker', 'war', 'speed'],
        username
      )
    })

    document.getElementById('playButton')!.addEventListener('click', () => {
      switch (mode) {
        case 'blackjack':
          Config.displayNone()
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
          WarController.startGame(new WarTable('war', username!))
          break
        case 'poker':
          break
        case 'speed':
          Config.displayNone()
          SpeedController.startGame(
            new SpeedTable('speed', username!, difficulty)
          )
          break
      }
    })

    document.getElementById('guideButton')!.addEventListener('click', () => {
      Config.displayNone()
      this.renderGameGuide(mode, username)
    })
  }

  /*
  renderGameGuide(mode: string, username?: string): void
  ゲームガイドページを描画する
  */
  static renderGameGuide(mode: string, username?: string): void {
    Config.displayNone()
    GameGuide.render(mode)

    document.getElementById('backButton')!.addEventListener('click', () => {
      Config.displayNone()
      this.renderGamePage(mode, username)
    })

    const nav = document.querySelectorAll('.nav-item')
    const tab = document.querySelectorAll('.tab-view')
    for (let i = 0; i < nav.length; i++) {
      nav[i].addEventListener('click', () => {
        window.scroll({
          top: 0,
          behavior: 'instant'
        })
        for (let j = 0; j < nav.length; j++) {
          nav[j].classList.remove('text-[#111]')
          nav[j].classList.add('text-[#666]')
        }
        nav[i].classList.remove('text-[#666]')
        nav[i].classList.add('text-[#111]')
        for (let j = 0; j < tab.length; j++) {
          tab[j].classList.remove('block')
          tab[j].classList.add('hidden')
        }
        tab[i].classList.remove('hidden')
        tab[i].classList.add('block')
      })
    }
  }
}
