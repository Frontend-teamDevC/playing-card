export class InitialView {
  static create() {
    const root = document.getElementById('app')
    root!.innerHTML = `
    <div class="relative w-full h-screen flex items-center">
      <div class="max-w-2xl w-full mx-auto px-4">
        <h1 class="text-xl font-bold text-[#111] text-center">Playing Card Games</h1>
        <div class="relative h-[200px]">
          <img id="card-front" class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" src="assets/cards/AS.png" />
          <img id="card-back" class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" src="assets/cards/backB.png" />
        </div>
        <span class="text-sm text-[#848D97]">Enter your name</span>
        <div class="mt-2">
          <input type="text" id="name-input" placeholder="name" class='w-full h-10 px-2 border border-[#eaeaea] rounded-md bg-[#fafafa] text-md font-normal text-[#111]'>
        </div>
        <div class="mt-4">
          <button id="start-button" class="w-full h-10 rounded bg-[#111] text-[#fff]">Start</button>
        </div>
      </div>
    </div>
    `

    setTimeout(() => {
      this.animation()
    }, 500)
  }

  static animation() {
    document.getElementById('card-front')!.classList.add('cardf-animation')
    document.getElementById('card-back')!.classList.add('cardb-animation')
  }
}
