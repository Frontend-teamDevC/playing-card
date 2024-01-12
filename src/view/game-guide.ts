import GameObject from '../game/gameObject'
import { backButton } from '../component/back-button'

export default class GameGuide {
  static render(type: string) {
    const root = document.getElementById('app')
    const navigation = this.navigation(type)
    const content = this.content(type)

    root!.innerHTML = `
    <div class="lg:max-w-[1280px] lg:flex lg:mx-auto lg:px-8">
      <div class="sticky lg:h-full top-0 lg:top-14 lg:w-1/3 pt-4 lg:pt-0 px-4 lg:px-0 border-b lg:border-b-0 border-[#eaeaea] bg-white">
        ${backButton}
        <div class="flex gap-4 lg:flex-col py-4 lg:py-8">
          ${navigation}
        </div>
      </div>
      <div class="lg:w-2/3 lg:ml-8 px-4 lg:px-0 py-6 lg:py-14">${content}</div>
    </div>
    `
  }

  static navigation(type: string): string {
    let element = ''
    const guide = GameObject.game(type)!.guide
    for (let i = 0; i < guide.length; i++) {
      element += `
        <div class="nav-item text-sm cursor-pointer ${
          i == 0 ? 'text-[#111]' : 'text-[#666]'
        }">${guide[i].type}</div>
        `
    }

    return element
  }

  static content(type: string): string {
    let element = ''
    const guide = GameObject.game(type)!.guide

    for (let i = 0; i < guide.length; i++) {
      const div = document.createElement('div')
      div.classList.add('tab-view')
      if (i != 0) div.classList.add('hidden')

      guide[i].content.map((a: any) => {
        const b = document.createElement('div')
        b.classList.add('mb-10')
        b.innerHTML = `
        <p class="text-sm lg:text-lg text-[#111] font-bold">${a.title}</p>
        <p class="mt-1 text-sm lg:text-md text-[#666]">${a.text}</p>
        <div class="mt-2 border border-[#eaeaea] rounded-lg overflow-hidden">
        ${
          a.image
            ? `
            <img src="${a.image}" width="1000" height="500">
          `
            : `
            <img src="assets/ui/not-image.png" width="1000" height="500">
          `
        }
        </div>
        `
        div.append(b)
      })
      element += div.outerHTML
    }

    return element
  }
}
