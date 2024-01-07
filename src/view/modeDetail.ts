import Description from '../config/description'

export class ModeDetail {
  static render(type: string, name: string) {
    const root = document.getElementById('app')
    const playButton = this.playButtonElement()
    const backButton = this.backButtonElement()
    const diffSelect = this.difficultySelectElement()
    const roundsSelect = this.roundsSelectElement()
    const detail = this.detailElements(type)

    root!.innerHTML = `
    <div id="header" class="pt-6 px-6">
      <div class="flex justify-between items-center">
        ${backButton}
        <span class="text-sm opacity-70">${name}</span>
      </div>
      <div class="mt-10">
        <h1 class="text-lg font-bold">${type.replace(
          type[0],
          type[0].toUpperCase()
        )}</h1>
      </div>
    </div>
    <div id="navigation" class="mt-6">
      <div class="flex px-6 border-b border-[#2c3239]">
        <div id="play-tab" class="relative flex items-center pb-2 cursor-pointer before:absolute before:bottom-[-1px] before:w-full before:bg-[#00C495] before:h-[1px]">
          <span class="text-sm">プレイ</span>
        </div>
        <div id="detail-tab" class="relative flex items-center ml-6 pb-2 cursor-pointer opacity-70">
          <span class="text-sm">遊び方</span>
        </div>
      </div>
    </div>
    <div id="play-view" class="block min-h-screen p-6 bg-[#15191E]">
      <span class="text-sm opacity-50">Regulation</span>
      <div class="mt-2 border border-[#2C3239] rounded-lg bg-[#0C1117]">
        <div class="flex justify-between items-center py-2 px-4 border-b border-[#2C3239]">
          <span class="text-sm opacity-70">Difficulty</span>
          ${diffSelect}
        </div>
        <div class="flex justify-between items-center py-2 px-4 border-b border-[#2C3239]">
          <span class="text-sm opacity-70">Rounds</span>
          ${roundsSelect}
        </div>
      </div>
      <div class="mt-4">
        ${playButton}
      </div>
    </div>
    <div id="detail-view" class="hidden min-h-screen pb-6 px-6 bg-[#15191E]">
      ${detail}
    </div>
    `
  }

  static playButtonElement(): string {
    const element = `
    <button id="playButton" class="w-full h-10 rounded-lg bg-white text-[#0c1117] font-bold">Play</button>
    `
    return element
  }

  static backButtonElement(): string {
    const element = `
    <div id="backButton" class="flex items-center cursor-pointer">
      <img src="assets/ui/arrow.svg" width="10" height="15" />
      <span class="ml-1 text-sm text-[#00C495]">ゲーム選択</span>
    </div>
    `
    return element
  }

  static difficultySelectElement(): string {
    const element = `
    <select id="difficulty">
      <option value="easy">弱い</option>
      <option value="normal">普通</option>
      <option value="hard">強い</option>
    </select>
    `
    return element
  }

  static roundsSelectElement(): string {
    const element = `
    <select id="rounds">
      <option value="5">5ラウンドでプレイ</option>
      <option value="7">7ラウンドでプレイ</option>
    </select>
    `
    return element
  }

  static detailElements(type: string): string {
    let element = ''
    console.log(element)
    if (type == 'war') {
      Description.war.map((detail) => {
        element += `
            <h2 class="pt-6 text-sm font-bold">${detail.title}</h2>
            <p class="text-sm opacity-70">${detail.text}</p>
            ${
              detail.imgSrc &&
              `
              <img src="${detail.imgSrc}">
            `
            }
          `
      })
    }

    return element
  }
}
