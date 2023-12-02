export class InitialView {
  constructor() {
    console.log('InitialView constructor')
  }

  static create() {
    const root = document.getElementById('app')

    const container = document.createElement('div')

    container.innerHTML = `
      <h1>Playing Card Games</h1>
      <div>
        <input type="text" id="name-input" placeholder="Enter your name" class='mt-3 border-2 border-black rounded-md p-2'>
        <button id="start-button">Start</button>
      </div>
    `

    root?.append(container)
  }
}
