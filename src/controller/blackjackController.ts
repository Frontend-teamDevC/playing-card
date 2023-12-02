import Phaser from 'phaser'
import { Config } from '../config/pageConfig'
import BlackjackTable from '../model/blackjack/blackjackTable'
import { BlackjackView } from '../view/blackjackView'
import { Controller } from './controller'

export class BlackjackController extends Phaser.Scene {
  /*
  renderGameScene(table: BlackjackTable): void
  ゲームのシーンを描画する
  */
  static renderGameScene(table: BlackjackTable) {
    // lotate table's dealer and player
    this.renderPlayers(table)

    if (table.gamePhase === 'game over') {
      this.renderGameOverModal(table)
      return
    }

    if (table.roundCount === table.maxRounds) {
      this.renderFinalResultsModal(table)
      return
    }

    if (table.gamePhase === 'evaluating') {
      Config.displayNone()
      this.renderRoundOverModal(table)
      this.onClickNextRoundButton(table)
      return
    }

    if (table.gamePhase === 'dealer turn') {
      table.dealer.gameStatus =
        table.dealer.gameStatus === 'waiting'
          ? 'acting'
          : table.dealer.gameStatus
      setTimeout(() => {
        Config.displayNone()
        if (table.dealer.gameStatus === 'acting') {
          table.haveTurn()
          this.renderGameScene(table)
        }
        table.gamePhase = 'evaluating'
        this.renderGameScene(table)
        return
      }, 3000)
    }

    const turnPlayer = table.getTurnPlayer()
    if (turnPlayer.type === 'human') {
      if (table.gamePhase === 'betting') {
        BlackjackView.createBetModal(table)

        const betButton = document.querySelector('.bet-button')
        if (!betButton?.ariaDisabled) {
          betButton!.addEventListener('click', () => {
            Config.displayNone()

            const betCount = parseInt(betButton!.innerHTML.split(' ')[1])
            table.haveTurn(betCount)
            this.renderGameScene(table)
            betButton!.ariaDisabled = 'true'
          })
        }
      } else if (table.gamePhase === 'acting') {
        // プレイヤーのgameStatusがstand, bust, surrender, blackjackの場合は次のターンへ
        if (table.playerActionResolved(turnPlayer)) {
          Config.displayNone()

          table.haveTurn()
          this.renderGameScene(table)
        } else {
          BlackjackView.createActionsModal()

          // on action buttons click
          this.onActionButtonsClick(table)
        }
      }
    } else {
      setTimeout(() => {
        Config.displayNone()
        table.haveTurn()
        this.renderGameScene(table)
      }, 3000)
    }
  }

  /*
  renderRoundOverModal(table: BlackjackTable): void
  ラウンド終了時のモーダルを描画する
  */
  static renderRoundOverModal(table: BlackjackTable) {
    BlackjackView.createRoundOverModal(table)
  }

  /*
  renderGameOverModal(table: BlackjackTable): void
  操作プレイヤーのチップが全てなくなった時のモーダルを描画する
  */
  static renderGameOverModal(table: BlackjackTable) {
    BlackjackView.createGameOverModal()
    this.onClickGameOverButtons(table)
  }

  /*
  renderFinalResultsModal(table: BlackjackTable): void
  全ラウンド終了後の最終結果のモーダルを描画する
  */
  static renderFinalResultsModal(table: BlackjackTable) {
    BlackjackView.createFinalResultsModal(table)
    this.onClickFinalResultsButons(table)
  }

  /*
  renderPlayers(table: BlackjackTable): void
  プレイヤーの情報を描画する
  */
  static renderPlayers(table: BlackjackTable) {
    BlackjackView.createPlayerView(table.dealer, table)

    for (let player of table.players) {
      BlackjackView.createPlayerView(player, table)
    }
  }

  /*
  onActionButtonsClick(table: BlackjackTable): void
  アクションボタンがクリックされた時の処理を記述する
  */
  static onActionButtonsClick(table: BlackjackTable) {
    const hitButton = document.querySelector('.hit-button')
    const standButton = document.querySelector('.stand-button')
    const doubleButton = document.querySelector('.double-button')
    const surrenderButton = document.querySelector('.surrender-button')

    hitButton?.addEventListener('click', () => {
      if (table.players[0].getHandScore() <= 21) {
        Config.displayNone()
        table.haveTurn('hit')
        this.renderGameScene(table)
      }
    })
    standButton?.addEventListener('click', () => {
      Config.displayNone()
      table.haveTurn('stand')
      this.renderGameScene(table)
    })
    doubleButton?.addEventListener('click', () => {
      if (
        table.players[0].chips >= table.players[0].bet * 2 &&
        table.players[0].getHandScore() <= 21
      ) {
        Config.displayNone()
        table.haveTurn('double')
        this.renderGameScene(table)
      }
    })
    surrenderButton?.addEventListener('click', () => {
      if (table.players[0].getHandScore() <= 21) {
        Config.displayNone()
        table.haveTurn('surrender')
        this.renderGameScene(table)
      }
    })
  }

  /*
  onClickNextRoundButton(table: BlackjackTable): void
  round overモーダルのnext roundボタンがクリックされた時の処理を記述する
  */
  static onClickNextRoundButton(table: BlackjackTable) {
    const nextRoundButton = document.querySelector('.next-round-button')
    nextRoundButton?.addEventListener('click', () => {
      if (table.gamePhase === 'game over') {
        Config.displayNone()
        this.renderGameOverModal(table)
        return
      }
      table.gamePhase = 'betting'
      Config.displayNone()
      this.renderGameScene(table)
    })
  }

  /*
  onClickGameOverButtons(table: BlackjackTable): void
  game overモーダルのrestart, backボタンがクリックされた時の処理を記述する
  */
  static onClickGameOverButtons(table: BlackjackTable) {
    const restartButton = document.querySelector('.restart-button')
    const backButton = document.querySelector('.back-button')
    restartButton?.addEventListener('click', () => {
      Config.displayNone()
      this.renderGameScene(
        new BlackjackTable(
          'blackjack',
          table.players[0].name,
          table.difficulty,
          table.maxRounds
        )
      )
    })
    backButton?.addEventListener('click', () => {
      Config.displayNone()
      Controller.renderModeSelectPage(['blackjack', 'war'])
    })
  }

  /*
  onClickFinalResultsButons(table: BlackjackTable): void
  final resultsモーダルのrestart, backボタンがクリックされた時の処理を記述する
  */
  static onClickFinalResultsButons(table: BlackjackTable) {
    const restartButton = document.querySelector('.restart-button')
    const backButton = document.createElement('button')
    restartButton?.addEventListener('click', () => {
      Config.displayNone()
      this.renderGameScene(
        new BlackjackTable(
          'blackjack',
          table.players[0].name,
          table.difficulty,
          table.maxRounds
        )
      )
    })
    backButton?.addEventListener('click', () => {
      Config.displayNone()
      Controller.renderModeSelectPage(['blackjack', 'war'])
    })
  }
}
