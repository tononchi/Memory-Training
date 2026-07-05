// 1年生の問題（ひらがな / カタカナ入り / かんじ入り）
// app.js より先に読み込むこと。window.PASSAGE_SETS に登録する。
// かんじ入りは第1学年の80字のみを使用（docs/kanji-by-grade.md）。
window.PASSAGE_SETS = Object.assign(window.PASSAGE_SETS || {}, {
  "1-hiragana": {
    label: "1年 ひらがな",
    items: [
      {
        id: "1h-1",
        text: "きょうは あさから そらが ぴかぴか はれです。",
        q: { ask: "そらは どうだった？", choices: ["はれ", "あめ"], answer: 0 }
      },
      {
        id: "1h-2",
        text: "あかい くるまが みちを すいすい はしります。",
        q: { ask: "くるまは なにいろ？", choices: ["あお", "あか"], answer: 1 }
      },
      {
        id: "1h-3",
        text: "ねこが まどべで ひなたぼっこを しています。",
        q: { ask: "なにが ひなたぼっこ してる？", choices: ["ねこ", "いぬ"], answer: 0 }
      },
      {
        id: "1h-4",
        text: "こうえんで ともだちと おにごっこを しました。",
        q: { ask: "どこで あそんだ？", choices: ["こうえん", "がっこう"], answer: 0 }
      },
      {
        id: "1h-5",
        text: "おみせで あまい いちごを かいました。",
        q: { ask: "なにを かった？", choices: ["みかん", "いちご"], answer: 1 }
      }
    ]
  },
  "1-katakana": {
    label: "1年 カタカナ入り",
    items: [
      {
        id: "1k-1",
        text: "ライオンが おおきな こえで ほえました。",
        q: { ask: "なにが ほえた？", choices: ["ライオン", "ねこ"], answer: 0 }
      },
      {
        id: "1k-2",
        text: "おやつに バナナと トマトを たべました。",
        q: { ask: "おやつは なに？", choices: ["バナナと トマト", "パンと たまご"], answer: 0 }
      },
      {
        id: "1k-3",
        text: "テレビで サッカーの しあいを みました。",
        q: { ask: "テレビで なにを みた？", choices: ["サッカー", "アニメ"], answer: 0 }
      },
      {
        id: "1k-4",
        text: "あかい ボールを ともだちに パスしました。",
        q: { ask: "ボールは なにいろ？", choices: ["あか", "あお"], answer: 0 }
      },
      {
        id: "1k-5",
        text: "コップに つめたい ジュースを いれました。",
        q: { ask: "コップに なにを いれた？", choices: ["ジュース", "おちゃ"], answer: 0 }
      }
    ]
  },
  "1-kanji": {
    label: "1年 かんじ入り",
    items: [
      {
        id: "1j-1",
        text: "天気が よくて 青い 空が 見える。",
        q: { ask: "そらは どんな いろ？", choices: ["青い", "赤い"], answer: 0 }
      },
      {
        id: "1j-2",
        text: "犬と 子犬が 川の 水を のむ。",
        q: { ask: "なにが 水を のむ？", choices: ["犬", "とり"], answer: 0 }
      },
      {
        id: "1j-3",
        text: "学校の 大きな 木に 花が さく。",
        q: { ask: "木に なにが さく？", choices: ["花", "み"], answer: 0 }
      },
      {
        id: "1j-4",
        text: "森の 中で 白い 花を 見つけた。",
        q: { ask: "森で なにを 見つけた？", choices: ["白い 花", "赤い み"], answer: 0 }
      },
      {
        id: "1j-5",
        text: "夕やけで 山が 赤く なる。",
        q: { ask: "山は なにいろに なった？", choices: ["赤", "青"], answer: 0 }
      },
      {
        id: "1j-6",
        text: "王さまの 右手に 金の 玉。",
        q: { ask: "金の 玉は どこ？", choices: ["右手", "左手"], answer: 0 }
      },
      {
        id: "1j-7",
        text: "村の 男の人が 田に 入る。",
        q: { ask: "だれが 田に 入る？", choices: ["男の人", "女の子"], answer: 0 }
      },
      {
        id: "1j-8",
        text: "先生が 早口で 名を よぶ。",
        q: { ask: "先生は どう よんだ？", choices: ["早口", "小ごえ"], answer: 0 }
      },
      {
        id: "1j-9",
        text: "一年生が 六人 休む。",
        q: { ask: "なん人 休んだ？", choices: ["六人", "二人"], answer: 0 }
      },
      {
        id: "1j-10",
        text: "七つの 貝と 八つの 石。",
        q: { ask: "貝は いくつ？", choices: ["七つ", "八つ"], answer: 0 }
      },
      {
        id: "1j-11",
        text: "雨の 日は 草が ぬれる。",
        q: { ask: "雨で なにが ぬれる？", choices: ["草", "火"], answer: 0 }
      },
      {
        id: "1j-12",
        text: "左の 耳に 音が きこえる。",
        q: { ask: "どこで 音を きく？", choices: ["左の 耳", "右の 手"], answer: 0 }
      },
      {
        id: "1j-13",
        text: "糸と 竹で 文字を かく。",
        q: { ask: "なにで かく？", choices: ["糸と 竹", "水と 火"], answer: 0 }
      },
      {
        id: "1j-14",
        text: "三、四、五、九、十と 大きな こえで かぞえる。",
        q: { ask: "どう かぞえた？", choices: ["大きな こえ", "小さな こえ"], answer: 0 }
      },
      {
        id: "1j-15",
        text: "百円玉と 千円さつを 出す。",
        q: { ask: "なにを 出した？", choices: ["お金", "本"], answer: 0 }
      },
      {
        id: "1j-16",
        text: "火と 水で りょうりを する。",
        q: { ask: "なにを つかう？", choices: ["火と 水", "土と 石"], answer: 0 }
      },
      {
        id: "1j-17",
        text: "二人で 上を 見て、月を 見る。",
        q: { ask: "なにを 見た？", choices: ["月", "花"], answer: 0 }
      },
      {
        id: "1j-18",
        text: "正しい 字を 目で 見て かく。",
        q: { ask: "なにで 見る？", choices: ["目", "耳"], answer: 0 }
      },
      {
        id: "1j-19",
        text: "車の 中で 本を よむ。",
        q: { ask: "どこで よむ？", choices: ["車の 中", "木の 上"], answer: 0 }
      },
      {
        id: "1j-20",
        text: "小さな 女の子が 立つ。",
        q: { ask: "だれが 立つ？", choices: ["女の子", "男の人"], answer: 0 }
      },
      {
        id: "1j-21",
        text: "力を 入れて、足で ける。",
        q: { ask: "なにで ける？", choices: ["足", "手"], answer: 0 }
      },
      {
        id: "1j-22",
        text: "林と 町の あいだに 田。",
        q: { ask: "林と 町の あいだに なに？", choices: ["田", "川"], answer: 0 }
      },
      {
        id: "1j-23",
        text: "土の 中に 虫が いる。",
        q: { ask: "土の 中に なにが いる？", choices: ["虫", "貝"], answer: 0 }
      },
      {
        id: "1j-24",
        text: "木の 下で 犬が ねる。",
        q: { ask: "どこで ねる？", choices: ["木の 下", "川の 中"], answer: 0 }
      }
    ]
  }
});
