export class ModeSelectView {
  constructor() {
    console.log('ModeSelectView constructor')
  }

  /*
    create(): void
    モード選択ページの要素を生成する
  */
  static create() {
    const root = document.getElementById('app')

    // 左上に戻るボタン
    const backButton = document.createElement('button')
    backButton.innerText = 'Back'
    backButton.classList.add('back-button')

    const container = document.createElement('div')
    const title = document.createElement('h1')
    title.innerText = 'Select a game mode'

    const blackjackModal = this.modal('Blackjack', 'blackjack')
    const warModal = this.modal('War', 'war')
    const pokerModal = this.modal('Poker', 'poker')
    const speedModal = this.modal('Speed', 'speed')

    container.append(
      backButton,
      title,
      blackjackModal,
      warModal,
      pokerModal,
      speedModal
    )
    root?.append(container)
  }

  /*
    modal(title: string, gameType: string): HTMLDivElement
    モード、難易度、ラウンド数選択のモーダルを生成する
  */
  static modal(title: string, gameType: string): HTMLDivElement {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    modal.id = `${gameType}-modal`

    const modalContent = document.createElement('div')
    modalContent.classList.add('modal-content')

    const modalTitle = document.createElement('h2')
    modalTitle.innerText = title

    const tutoButton = document.createElement('button')
    tutoButton.innerText = 'Tutorial'
    tutoButton.classList.add(`${gameType}-tuto-button`)

    // pull dowm menus for difficulty and rounds selection
    const difficulties = document.createElement('select')
    difficulties.id = `${gameType}-difficulty`
    difficulties.classList.add(`${gameType}-difficulty`)
    difficulties.innerHTML = `
      <option value="easy">Easy</option>
      <option value="normal">Normal</option>
      <option value="hard">Hard</option>
    `

    const rounds = document.createElement('select')
    rounds.id = `${gameType}-rounds`
    rounds.classList.add(`${gameType}-rounds`)
    rounds.innerHTML = `
      <option value="5">5 rounds</option>
      <option value="7">7 rounds</option>
    `

    const playButton = document.createElement('button')
    playButton.innerText = 'Play'
    playButton.classList.add(`${gameType}-play-button`)

    modalContent.append(
      modalTitle,
      difficulties,
      rounds,
      playButton,
      tutoButton
    )
    modal.append(modalContent)

    return modal
  }

  static backButton() {
    const backButton = document.createElement('button')
    backButton.innerText = 'Back'
    backButton.classList.add('back-button')

    return backButton
  }
}
