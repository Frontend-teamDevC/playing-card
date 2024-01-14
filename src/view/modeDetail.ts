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
          <div class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            <img src="/assets/card-label.svg" width="64" height="64" />
          </div>
        </div>
        <div class="mt-4 lg:mt-0">
          <h1 class="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">${
            game!.title
          }</h1>
          <p class="mt-4 text-md text-slate-700 dark:text-slate-400">${
            game!.description
          }</p>
        </div>
        <div class="py-6 flex flex-wrap gap-x-3 gap-y-1.5">
          <button id="playButton" class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 flex-shrink-0 text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset text-white font-semibold rounded-md dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400 inline-flex items-center">ゲームを始める</button>
          <button id="guideButton" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-2 px-3 py-2 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 disabled:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:disabled:bg-slate-800 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center">遊び方を見る</button>
        </div>
        <div class="pt-10 border-t border-slate-200 dark:border-slate-800">
          <span class="block mb-2 text-sm text-slate-700 dark:text-slate-400">ゲーム設定</span>
          ${
            regulation !== ''
              ? `<div class="overflow-hidden rounded-lg divide-y divide-slate-200 dark:divide-slate-800 ring-1 ring-slate-200 dark:ring-slate-800 shadow bg-white dark:bg-slate-900 relative group flex flex-col">${regulation}</div>`
              : `<p class="text-sm text-slate-700 dark:text-slate-400">設定できる項目はありません</p>`
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
    <div class="bg-slate-100/50 dark:bg-slate-800/50">
    <div class="flex justify-between items-center px-4 py-2">
      <span class="text-sm text-slate-700 dark:text-slate-400">CPUの強さ</span>
      <select id="difficulty" class="relative block disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input bg-transparent rounded-md text-sm text-slate-900 dark:text-white pe-8">
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
    <div class="bg-slate-100/50 dark:bg-slate-800/50">
    <div class="flex justify-between items-center px-4 py-2">
      <span class="text-sm text-slate-700 dark:text-slate-400">ラウンド数</span>
      <select id="rounds" class="relative block disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input bg-transparent rounded-md text-sm text-slate-900 dark:text-white pe-8">
        <option value="5">5ラウンドでプレイ</option>
        <option value="7">7ラウンドでプレイ</option>
      </select>
    </div>
    </div>
    `
    return element
  }
}
