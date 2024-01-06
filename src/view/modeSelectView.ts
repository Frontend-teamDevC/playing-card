export class ModeSelectView {
  // Breakpoint prefix	Minimum width	CSS
  // sm	640px	@media (min-width: 640px) { ... }
  // md	768px	@media (min-width: 768px) { ... }
  // lg	1024px	@media (min-width: 1024px) { ... }
  // xl	1280px	@media (min-width: 1280px) { ... }
  // 2xl	1536px	@media (min-width: 1536px) { ... }

  static render(modeList: string[], name?: string) {
    const root = document.getElementById('app')
    const backButton = this.backButtonElement()
    const cards = this.cardsElement(modeList)

    root!.innerHTML = `
    <div id="header" class="pt-6 px-6">
      <div class="flex justify-between items-center">
        ${backButton}
        <span class="text-sm opacity-70">${name}</span>
      </div>
      <div class="mt-10">
        <h1 class="text-lg font-bold">Select a game mode</h1>
      </div>
    </div>
    <div id="cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 px-6">
      ${cards}
    </div>
    `
  }

  static backButtonElement(): string {
    const element = `
    <div id="backButton" class="flex items-center cursor-pointer">
      <img src="assets/ui/arrow.svg" width="10" height="15" />
      <span class="ml-1 text-sm text-[#00C495]">スタート</span>
    </div>
    `
    return element
  }

  static cardsElement(modeList: string[]): string {
    let element = ''

    modeList.map((mode) => {
      element += `
      <div id="${mode}" class="relative flex w-full rounded-lg bg-[#15191E] overflow-hidden cursor-pointer before:absolute before:w-full before:h-full before:bg-black before:bg-opacity-50 before:hover:bg-opacity-60">
        <img src="/assets/ui/war-back.png" width="1080" height="720" />
        <div class="absolute bottom-0 left-0 py-6 px-4">
          <h2 class="text-md font-bold">${mode.replace(
            mode[0],
            mode[0].toUpperCase()
          )}</h2>
          <p class="mt-2 text-sm opacity-80">To ensure you can easily update your
          project after deploying</p>
        </div>
      </div>
      `
    })
    return element
  }
}
