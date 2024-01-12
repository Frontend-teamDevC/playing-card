import GameObject from '../game/gameObject'
import { backButton } from '../component/back-button'

export class ModeSelectView {
  static render(modeList: string[]) {
    const root = document.getElementById('app')
    const cards = this.cardsElement(modeList)

    root!.innerHTML = `
    <div class="lg:max-w-[1280px] lg:mx-auto px-4 lg:px-8 lg:pt-14">
      <div class="pt-4 lg:pt-0">
        ${backButton}
      </div>
      <div class="mt-10">
        <h1 class="text-lg text-[#111] font-bold">ゲーム選択</h1>
      </div>
      <div id="cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2 mb-8">
        ${cards}
      </div>
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
      <div id="${mode}" class="relative flex w-full rounded-lg bg-[#15191E] overflow-hidden cursor-pointer before:absolute before:w-full before:h-full before:bg-gradient-to-t before:from-[#275A33]/100 before:to-transparent">
        <img src="/assets/${mode}.jpg" width="1080" height="720" />
        <div class="absolute bottom-0 left-0 py-6 px-4">
          <h2 class="text-sm font-bold text-white">${
            GameObject.game(mode)!.title
          }</h2>
          <p class="mt-1 text-xs text-white">${
            GameObject.game(mode)!.description
          }</p>
        </div>
      </div>
      `
    })
    return element
  }
}
