export class InitialView {
  static create() {
    const root = document.getElementById('app')
    root!.innerHTML = `
    <div class="pt-14">
      <div class="max-w-2xl w-full mx-auto px-4">
      <div class="relative h-[200px]">
      <img id="card-1" class="absolute top-[50%] left-[50%] shadow-sm translate-x-[-50%] translate-y-[-50%]" src="assets/cards/9C.png" width="64" height="89" />
      <img id="card-2" class="absolute top-[50%] left-[50%] shadow-sm translate-x-[-50%] translate-y-[-50%]" src="assets/cards/KS.png" width="64" height="89" />
      <img id="card-3" class="absolute top-[50%] left-[50%] shadow-sm translate-x-[-50%] translate-y-[-50%]" src="assets/cards/4C.png" width="64" height="89" />
      <img id="card-4" class="absolute top-[50%] left-[50%] shadow-sm translate-x-[-50%] translate-y-[-50%]" src="assets/cards/AS.png" width="64" height="89" />
      <img id="card-5" class="absolute top-[50%] left-[50%] shadow-sm translate-x-[-50%] translate-y-[-50%]" src="assets/cards/backB.png" width="64" height="89" />
    </div>
        <h1 class="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">トランプゲーム</h1>
        <p class="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">全4種類のトランプゲームをちょっとした空き時間にお楽しみください。</p>
        <div class="mt-10 flex flex-col lg:flex-row justify-center gap-y-4 lg:gap-x-6 text-sm">
          <input id="name-input" name="email" value="" type="email" required placeholder="名前を入力してください" class="sm:flex items-center w-full lg:w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700" autocomplete="off" id="nuid-0">
          <button id="start-button" class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">はじめる</button>
        </div>
      </div>
    </div>
    `

    setTimeout(() => {
      this.animation()
    }, 500)
  }

  static animation() {
    document.getElementById('card-1')!.classList.add('card1-animation')
    document.getElementById('card-2')!.classList.add('card2-animation')
    document.getElementById('card-3')!.classList.add('card3-animation')
    document.getElementById('card-4')!.classList.add('card4-animation')
    document.getElementById('card-5')!.classList.add('card5-animation')
  }
}
