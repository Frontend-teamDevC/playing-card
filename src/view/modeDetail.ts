import { backButton } from '../component/back-button'
import GameObject from '../game/gameObject'

export class ModeDetail {
  static render(type: string) {
    const root = document.getElementById('app')
    const game = GameObject.game(type)
    const regulation = this.regulation(GameObject.game(type)!.regulation)

    root!.innerHTML = `
    <div class="lg:max-w-[1280px] lg:mx-auto lg:px-8 lg:pt-14">
      <div class="p-4 lg:p-0">
        ${backButton}
      </div>
      <div class="mt-4 lg:flex lg:flex-row-reverse lg:mt-8">
        <div class="lg:w-2/3 px-4 lg:px-0">
          <div class="rounded-lg overflow-hidden">
            <img src="/assets/${type}.jpg" width="1080" height="720" />
          </div>
        </div>
        <div class="lg:w-1/3 lg:mr-8 px-4 lg:px-0">
          <div class="mt-4 lg:mt-0">
            <h1 class="text-lg text-[#111] font-bold lg:text-xl">${
              game!.title
            }</h1>
            <p class="mt-1 text-sm text-[#666]">${game!.description}</p>
          </div>
          <div class="flex gap-4 mt-6">
            <button id="playButton" class="py-2.5 px-4 rounded bg-[#111] text-sm text-white">ゲームを始める</button>
            <button id="guideButton" class="py-2.5 px-4 border border-[#eaeaea] rounded bg-white text-sm text-[#111]">遊び方を見る</button>
          </div>    
          <div class="mt-10">
            <span class="mb-2 text-xs text-[#666]">ゲーム設定</span>
            <div class="flex flex-col gap-2">
              ${regulation}
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }

  static regulation(reg: string[]): string {
    let element = ''

    console.log(reg)
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
    } else {
      element = `
      <p class="text-sm text-[#666]">設定できる項目はありません</p>
      `
    }

    return element
  }

  static difficultySelectElement(): string {
    const element = `
    <div class="flex justify-between items-center">
      <span class="text-sm text-[#666]">CPUの強さ</span>
      <select id="difficulty">
        <option value="easy">弱い</option>
        <option value="normal">普通</option>
        <option value="hard">強い</option>
      </select>
    </div>
    `
    return element
  }

  static roundsSelectElement(): string {
    const element = `
    <div class="flex justify-between items-center">
      <span class="text-sm text-[#666]">ラウンド数</span>
      <select id="rounds">
        <option value="5">5ラウンドでプレイ</option>
        <option value="7">7ラウンドでプレイ</option>
      </select>
    </div>
    `
    return element
  }
}
