import { Config } from '../config/pageConfig'
import BlackjackTable from '../model/blackjack/blackjackTable'
import WarTable from '../model/war/warTable'
import SpeedTable from '../model/speed/speedTable'
import { InitialView } from '../view/initialView'
import { ModeSelectView } from '../view/modeSelectView'
import { ModeDetail } from '../view/modeDetail'
import { BlackjackController } from './blackjackController'
import { WarController } from './warController'
import { SpeedController } from './speedController'
import { PokerController } from './pokerController'
import pokerTable from '../model/poker/pokerTable'

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
    // ModeSelectView.create(modeList)
    ModeSelectView.render(modeList, username)

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
            Config.displayNone();
            this.renderGamePage(mode, username);
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
    ModeDetail.render(mode, username!)

    const difficultySelector = document.getElementById(
      'difficulty'
    ) as HTMLSelectElement

    const roundsSelector = document.getElementById(
      'rounds'
    ) as HTMLSelectElement

    let difficulty = difficultySelector.value
    let maxRounds = parseInt(roundsSelector.value)

    difficultySelector.addEventListener('change', () => {
      difficulty = difficultySelector.value
      console.log(difficulty)
    })

    roundsSelector.addEventListener('change', () => {
      maxRounds = parseInt(roundsSelector.value)
      console.log(maxRounds)
    })

    document.getElementById('backButton')!.addEventListener('click', () => {
      Config.displayNone()
      this.renderModeSelectPage(
        ['blackjack', 'war', 'poker', 'speed'],
        username
      )
    })

    document.getElementById('play-tab')!.addEventListener('click', () => {
      document
        .getElementById('play-tab')!
        .classList.add(
          'before:absolute',
          'before:bottom-[-1px]',
          'before:w-full',
          'before:bg-[#00C495]',
          'before:h-[1px]',
          'opacity-100'
        )
      document
        .getElementById('detail-tab')!
        .classList.remove(
          'before:absolute',
          'before:bottom-[-1px]',
          'before:w-full',
          'before:bg-[#00C495]',
          'before:h-[1px]',
          'opacity-100'
        )
      document.getElementById('play-tab')!.classList.remove('opacity-70')
      document.getElementById('detail-tab')!.classList.add('opacity-70')
      document.getElementById('play-view')!.classList.remove('hidden')
      document.getElementById('play-view')!.classList.add('block')
      document.getElementById('detail-view')!.classList.remove('block')
      document.getElementById('detail-view')!.classList.add('hidden')
    })

    document.getElementById('detail-tab')!.addEventListener('click', () => {
      document
        .getElementById('play-tab')!
        .classList.remove(
          'before:absolute',
          'before:bottom-[-1px]',
          'before:w-full',
          'before:bg-[#00C495]',
          'before:h-[1px]',
          'opacity-100'
        )
      document.getElementById('play-tab')!.classList.add('opacity-70')
      document
        .getElementById('detail-tab')!
        .classList.add(
          'before:absolute',
          'before:bottom-[-1px]',
          'before:w-full',
          'before:bg-[#00C495]',
          'before:h-[1px]',
          'opacity-100'
        )
      document.getElementById('detail-tab')!.classList.remove('opacity-70')
      document.getElementById('play-view')!.classList.remove('block')
      document.getElementById('play-view')!.classList.add('hidden')
      document.getElementById('detail-view')!.classList.remove('hidden')
      document.getElementById('detail-view')!.classList.add('block')
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
          Config.displayNone();
          PokerController.startGame(new pokerTable("poker", maxRounds))
          break
        case 'speed':
          Config.displayNone()
          SpeedController.startGame(
            new SpeedTable('speed', username!, difficulty)
          )
          break
      }
    })
  }
}
