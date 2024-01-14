import GameObject from '../game/gameObject'
import { backButton } from '../component/back-button'

export class ModeSelectView {
  static render(modeList: string[]) {
    const root = document.getElementById('app')
    const cards = this.cardsElement(modeList)

    root!.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 lg:px-8 md:pt-14">
      <div class="pt-4 lg:pt-0">
        ${backButton}
      </div>
      <div class="mt-10">
        <h1 class="text-lg text-gray-900 dark:text-white font-bold">ゲーム選択</h1>
      </div>
      <div id="cards" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-8">
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
      <div id="${mode}" class="overflow-hidden rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-800 shadow bg-white dark:bg-zinc-900 relative group flex flex-col hover:ring-2 hover:ring-primary-500 dark:hover:ring-primary-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 cursor-pointer">
        <div class="flex-1 px-4 py-5 sm:p-6">
          <div class="mb-6 flex">
            <div class="p-2 rounded-lg border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800">
              <img src="/assets/card-label.svg" width="36" height="36" />
            </div>
          </div>
          <h2 class="text-zinc-900 dark:text-white text-base font-semibold truncate flex items-center gap-1.5">${
            GameObject.game(mode)!.title
          }</h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">${
            GameObject.game(mode)!.description
          }</p>
        </div>
      </div>
      `
    })
    return element
  }
}
