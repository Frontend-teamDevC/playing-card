export class InitialView {
  static create() {
    const root = document.getElementById('app')

    const container = document.createElement('div')

    container.innerHTML = `
      <div class="relative w-full h-screen flex flex-col justify-center items-center">
        <h1 class="text-lg font-bold text-center">Playing Card Games</h1>
        <div class="w-full p-6">
          <div class="w-full py-6 px-4 border border-[#2c3239] rounded-lg bg-[#0C1117]">
            <span class="text-sm text-[#848D97]">Enter your name</span>
            <div class="mt-2">
              <input type="text" id="name-input" placeholder="name" class='w-full h-10 px-2 border border-[#2C3239] rounded-md bg-[#15191E]'>
            </div>
            <div class="mt-4">
              <button id="start-button" class="w-full h-10 rounded bg-white font-bold text-[#0C1117]">Start</button>
            </div>
          </div>
        </div>
      </div>
    `

    root?.append(container)
  }
}
