import { backButton } from '../component/back-button'
import GameObject from '../game/gameObject'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

export class ModeDetail {
  static render(type: string) {
    const root = document.getElementById('app')
    const game = GameObject.game(type)
    const regulation = this.regulation(GameObject.game(type)!.regulation)

    root!.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 lg:px-8 md:pt-14">
      <div class="pt-4 lg:pt-0">
        ${backButton}
      </div>
      <div class="mt-10">
        <div class="mb-6 flex">
          <div class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <img src="/assets/card-label.svg" width="64" height="64" />
          </div>
        </div>
        <div class="mt-4 lg:mt-0">
          <h1 class="text-2xl text-zinc-900 dark:text-white font-bold">${
            game!.title
          }</h1>
          <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">${
            game!.description
          }</p>
        </div>
        <div class="py-6 flex flex-wrap gap-x-3 gap-y-1.5">
          <button id="playButton" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm text-white dark:text-zinc-900 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 dark:disabled:bg-white focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center">ゲームを始める</button>
          <button id="guideButton" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 text-zinc-700 dark:text-zinc-200 bg-zinc-50 hover:bg-zinc-100 disabled:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/50 dark:disabled:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center">遊び方を見る</button>
        </div>
        <div class="pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <span class="block mb-2 text-sm text-[#666]">ゲーム設定</span>
          ${
            regulation !== ''
              ? `<div class="overflow-hidden rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-800 shadow bg-white dark:bg-zinc-900 relative group flex flex-col">${regulation}</div>`
              : `<p class="text-sm text-[#666]">設定できる項目はありません</p>`
          }
        </div>
      </div>
    </div>
    
    `

    new Swiper('.swiper', {
      loop: true,
      slidesPerView: 'auto',

      // If we need pagination
      pagination: {
        el: '.swiper-pagination'
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar'
      }
    })
  }

  static regulation(reg: string[]): string {
    let element = ''

    if (reg.length != 0) {
      reg.map((regType: string) => {
        switch (regType) {
          case 'round':
            element += this.roundsSelectElement()
            break
          case 'cpurank':
            element += this.difficultySelectElement()
            break
        }
      })
    }

    return element
  }

  static difficultySelectElement(): string {
    const element = `
    <div class="bg-zinc-100/50 dark:bg-zinc-800/50">
    <div class="flex justify-between items-center px-4 py-2">
      <span class="text-sm text-[#666]">CPUの強さ</span>
      <select id="difficulty" class="relative block disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input bg-transparent rounded-md text-sm text-zinc-900 dark:text-white pe-8">
        <option value="easy">弱い</option>
        <option value="normal">普通</option>
        <option value="hard">強い</option>
      </select>
    </div>
    </div>
    `
    return element
  }

  static roundsSelectElement(): string {
    const element = `
    <div class="bg-zinc-100/50 dark:bg-zinc-800/50">
    <div class="flex justify-between items-center px-4 py-2">
      <span class="text-sm text-[#666]">ラウンド数</span>
      <select id="rounds" class="relative block disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input bg-transparent rounded-md text-sm text-zinc-900 dark:text-white pe-8">
        <option value="5">5ラウンドでプレイ</option>
        <option value="7">7ラウンドでプレイ</option>
      </select>
    </div>
    </div>
    `
    return element
  }
}
