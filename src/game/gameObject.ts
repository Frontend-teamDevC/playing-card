interface GameObjectType {
  title: string
  description: string
  thumbnail: string
  regulation: string[]
  guide: GuideType[]
}

interface GuideType {
  type: string
  content: ContentType[]
}

interface ContentType {
  title: string
  text: string
  image: string
}

export default class GameObject {
  static warObject = {
    title: '戦争',
    description: 'カードの強さを競う シンプルな1対1の運勝負',
    thumbnail: '',
    regulation: [],
    guide: [
      {
        type: '遊び方',
        content: [
          {
            title: '基本の遊び方',
            text: 'カードをたくさんゲットした方の勝ち！',
            image: ''
          },
          {
            title: '勝負！',
            text: '手札から1枚選んで出して、カード同士をバトルさせましょう！',
            image: ''
          },
          {
            title: 'そして',
            text: '相手より強いカードだったら、そのカードをゲット！',
            image: ''
          },
          {
            title: 'カードの強さ',
            text: '「2」が一番弱くて「A」が一番強い 2→3→4→…J→Q→K→A',
            image: ''
          },
          {
            title: '引き分け',
            text: '同じ強さだったらもう一回勝負だ！',
            image: ''
          },
          {
            title: 'チャンス',
            text: '引き分けの後に勝てば、カードをまとめてゲット！',
            image: ''
          }
        ]
      },
      {
        type: 'ヒント',
        content: [
          {
            title: 'カンがすべて',
            text: '考えるな... 感じろ...',
            image: ''
          },
          {
            title: '強くなるために①',
            text: '普段から良い行いを心がけておこう',
            image: ''
          },
          {
            title: '強くなるために②',
            text: 'ツイてる人の生活態度をお手本にしよう',
            image: ''
          }
        ]
      }
    ]
  }

  static blackjackObject = {
    title: 'ブラックジャック',
    description: 'どこまで21に近づけられるか 運と度胸のカードゲーム',
    thumbnail: '',
    regulation: ['cpurank', 'round'],
    guide: [
      {
        type: '遊び方',
        content: [
          {
            title: '基本の遊び方',
            text: 'ディーラーとのトランプ勝負。決めたラウンド数で、チップを多く集めた人が勝ち',
            image: ''
          },
          {
            title: '21を目指す',
            text: 'ディーラーよりもカードの合計を21に近づけて、賭けたチップを2倍にしよう',
            image: ''
          },
          {
            title: 'カードの駆け引き',
            text: '最初に配られるカードは2枚。ギリギリを狙って、カードを追加するか、そのまま勝負するか決めよう',
            image: ''
          },
          {
            title: '「ヒット」と「スタンド」',
            text: 'さらにカードをもらうなら「ヒット」、そのまま勝負するなら「スタンド」',
            image: ''
          },
          {
            title: '「バースト」',
            text: 'カードの合計が21を超えると「バースト」、賭けたチップを取られてしまう',
            image: ''
          },
          {
            title: '「ダブル」',
            text: '賭けるチップを追加して、次の1手で勝負する強気な選択',
            image: ''
          },
          {
            title: '最後はチップ',
            text: '最後は、チップの合計でライバルとの順位が決まる。ベットする額は、ライバルのチップに勝てるかで決めよう',
            image: ''
          }
        ]
      },
      {
        type: 'カードの種類',
        content: [
          {
            title: '絵札①',
            text: '「J・Q・K」は、「10」として数える',
            image: ''
          },
          {
            title: '絵札②',
            text: '「J・Q・K」が2枚そろうだけで「20」!これだけで、ほとんど21だ!',
            image: ''
          },
          {
            title: '「10・J・Q・K」',
            text: '「10で数えるカード」はいっぱいあるぞ',
            image: ''
          },
          {
            title: 'Aはうれしい',
            text: '「1」にも「11」にもなる便利なカード',
            image: ''
          },
          {
            title: 'ブラックジャック',
            text: '「A」と「10のカード」の組み合わせで21になること。勝てばチップが2.5倍',
            image: ''
          }
        ]
      },
      {
        type: 'ヒント',
        content: [
          {
            title: '手札が11以下の場合',
            text: '次のカードで21は超えないので、必ずヒットかダブルでOK!',
            image: ''
          },
          {
            title: 'ティーラーは',
            text: '合計が17を超えるまでカードを引き続ける',
            image: ''
          },
          {
            title: '負けてるときは...',
            text: 'さっき賭けた額より、多く賭けて勝負',
            image: ''
          }
        ]
      }
    ]
  }

  static speedObject = {
    title: 'スピード',
    description: '瞬間勝負のカードバトル',
    thumbnail: '',
    regulation: [],
    guide: [
      {
        type: '遊び方',
        content: [
          {
            title: '基本の遊び方',
            text: '場と数字がつながるカードをどんどん出して、先に自分の手札を出し切った方の勝ち!',
            image: ''
          },
          {
            title: '「K」と「A」',
            text: '繋げることができます',
            image: ''
          },
          {
            title: '仕切り直し',
            text: '2人とも出せるカードがない時は同時に山札からカードを出して再スタート',
            image: ''
          }
        ]
      },
      {
        type: 'ヒント',
        content: [
          {
            title: '相手がカードを出せない時は',
            text: 'こっちが出すまで相手は出せない。あわてずじっくり手順を考えよう',
            image: ''
          }
        ]
      }
    ]
  }

  static pokerObject = {
    title: 'ポーカー',
    description: '運と駆け引きのトランプゲーム',
    thumbnail: '',
    regulation: ['cpurank', 'round'],
    guide: [
      {
        type: '遊び方',
        content: [
          {
            title: '基本の遊び方',
            text: 'カードの役を予想してチップを賭ける。一番多くみんなのチップを集めて人が勝ち',
            image: ''
          },
          {
            title: 'ゲーム開始',
            text: 'そのラウンドの1番、2番の人は最初にチップを賭けないといけない',
            image: ''
          },
          {
            title: 'チップを賭けるチャンスは4回',
            text: 'カードを見ながらチップを賭けるか、勝負しないか決めます。<br>1回目:手持ちのカード2枚を受け取る<br>2回目:場に3枚のカードが出る<br>3回目:場に4枚目のカードが出る<br>4回目:場に5枚目のカードが出る',
            image: ''
          },
          {
            title: '賭けたチップ',
            text: 'みんなの賭けたチップはポットに貯まっていく',
            image: ''
          },
          {
            title: '4回のベットが終わったら',
            text: 'お互いのカードを見せてラウンド終了。一番強い役を作った人がポットのチップをもらえる',
            image: ''
          },
          {
            title: 'チップの駆け引き',
            text: 'カードの役が弱くても強気に賭けて、みんなの掛け金を吊り上げるのがコツ',
            image: ''
          },
          {
            title: 'リタイヤ',
            text: 'ラウンド終了時にチップがゼロになるとその時点でリタイヤ',
            image: ''
          },
          {
            title: '最後は',
            text: 'すべてのラウンドが終わった時に一番多くみんなのチップを集めた人の勝ち',
            image: ''
          }
        ]
      },
      {
        type: 'アクション',
        content: [
          {
            title: 'ベット',
            text: '最初に賭けること。そこから後の人は、賭けないといけなくなる',
            image: ''
          },
          {
            title: 'コール',
            text: '前の人と同じチップ数になるように賭ける',
            image: ''
          },
          {
            title: 'レイズ',
            text: '前の人よりもチップを2倍上乗せすること。そこから後の人も同じチップまで賭けないといけない',
            image: ''
          },
          {
            title: 'パス',
            text: '誰もベットしていない時だけ使える。自信がない時にベットせずに次の人に回す',
            image: ''
          },
          {
            title: 'ドロップ',
            text: 'そのラウンドの負けを認めて、それまで賭けたチップを諦める。全員がドロップすると最後の人が勝ちになる',
            image: ''
          },
          {
            title: 'オールイン',
            text: 'コールに必要なチップが足りない時に残りチップを全て賭けて勝負する',
            image: ''
          }
        ]
      },
      {
        type: '役',
        content: [
          {
            title: 'カードの強さ',
            text: '「2」が一番弱く「A」が一番強い。2→3→4→...10→J→Q→K→A',
            image: ''
          },
          {
            title: 'ノーペア',
            text: '一番弱い役。何も揃っていない状態',
            image: ''
          },
          {
            title: 'ワンペア',
            text: '同じ数字のペア（2枚）が1つ',
            image: ''
          },
          {
            title: 'ツーペア',
            text: 'ペアが2つある',
            image: ''
          },
          {
            title: 'スリーカード',
            text: '同じ数字が3枚',
            image: ''
          },
          {
            title: 'ストレート',
            text: '続き数字でならぶ',
            image: ''
          },
          {
            title: 'フラッシュ',
            text: '同じマークが5枚',
            image: ''
          },
          {
            title: 'フルハウス',
            text: '同じ数字が2枚と3枚',
            image: ''
          },
          {
            title: 'フォーカード',
            text: '同じ数字が4枚',
            image: ''
          },
          {
            title: 'ストレートフラッシュ',
            text: '同じマークの続き数字',
            image: ''
          },
          {
            title: 'ロイヤルストレートフラッシュ',
            text: '一番強い役。同じマークの「10・J・Q・K・A」',
            image: ''
          }
        ]
      },
      {
        type: 'ヒント',
        content: [
          {
            title: 'ポットを増やせ！',
            text: '逆転したい時は自分からレイズしてみんなのチップをポットに集めよう',
            image: ''
          },
          {
            title: '勝ち逃げ',
            text: '最初にチップをがっぽりゲットしたら、あとはドロップして勝ち逃げするのもアリ...?',
            image: ''
          }
        ]
      }
    ]
  }

  static game(type: string): GameObjectType | null {
    let object = null
    switch (type) {
      case 'war':
        object = this.warObject
        break
      case 'blackjack':
        object = this.blackjackObject
        break
      case 'speed':
        object = this.speedObject
        break
      case 'poker':
        object = this.pokerObject
        break
    }

    return object
  }
}
