import GameObject from '../game/gameObject'
import { backButton } from '../component/back-button'

export default class GameGuide {
  static render(type: string) {
    const root = document.getElementById('app')
    const navigation = this.navigation(type)
    const content = this.content(type)

    root!.innerHTML = `
    <div class="max-w-2xl mx-auto lg:px-8">
      <div class="pt-4 lg:pt-14 px-4 lg:px-0">
        ${backButton}
      </div>
      <div class="sticky lg:h-full top-0 mt-6 pt-4 px-4 lg:px-0 border-b border-[#eaeaea] bg-white shadow-[0_10px_10px_-10px_rgba(0,0,0,0.05)]">
        <div class="flex gap-4">
          ${navigation}
        </div>
      </div>
      <div class="px-4 lg:px-0 py-6 lg:py-14">${content}</div>
    </div>
    `
  }

  static navigation(type: string): string {
    let element = ''
    const guide = GameObject.game(type)!.guide
    for (let i = 0; i < guide.length; i++) {
      element += `
        <div class="nav-item mb-[-1px] pb-3 text-sm cursor-pointer ${
          i == 0
            ? 'text-zinc-900 dark:text-white border-b-2 border-zinc-900'
            : 'text-zinc-500 dark:text-zinc-400'
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
        <p class="text-sm text-zinc-900 dark:text-white">${a.title}</p>
        <p class="mt-1 text-sm lg:text-md text-zinc-500 dark:text-zinc-400">${
          a.text
        }</p>
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
