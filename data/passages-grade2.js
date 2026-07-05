// 2年生の問題（ひらがな / かんじ入り）
// app.js より先に読み込むこと。window.PASSAGE_SETS に登録する。
// かんじ入りは第1〜2学年の漢字のみを使用（docs/kanji-by-grade.md）。
window.PASSAGE_SETS = Object.assign(window.PASSAGE_SETS || {}, {
  "2-hiragana": {
    label: "2年 ひらがな",
    items: [
      {
        id: "2h-1",
        text: "しゅくだいを おえたら、じぶんで つぎの もんだいに ちょうせんします。",
        q: { ask: "しゅくだいの あとは どうする？", choices: ["つぎに ちょうせん", "ねる"], answer: 0 }
      },
      {
        id: "2h-2",
        text: "はやく よむだけでなく、ないようを おもいだせるか たしかめます。",
        q: { ask: "たいせつなのは？", choices: ["はやさだけ", "ないようも"], answer: 1 }
      },
      {
        id: "2h-3",
        text: "ともだちと くらべるより きのうの じぶんより せいちょうするのが だいじです。",
        q: { ask: "だれと くらべる？", choices: ["きのうの じぶん", "ともだち"], answer: 0 }
      },
      {
        id: "2h-4",
        text: "みじかい ぶんを くりかえし よむと、しぜんに ながく よめるように なります。",
        q: { ask: "どう よむと よくなる？", choices: ["くりかえし よむ", "いちど だけ"], answer: 0 }
      },
      {
        id: "2h-5",
        text: "きょうの がんばりを ほしで ためて、れんぞく ちゃれんじを つづけましょう。",
        q: { ask: "なにを ためる？", choices: ["ほし", "おかね"], answer: 0 }
      }
    ]
  },
  "2-kanji": {
    label: "2年 かんじ入り",
    items: [
      {
        id: "2j-1",
        text: "朝、兄と 弟が 公園まで 走る。",
        q: { ask: "だれと 走った？", choices: ["兄と 弟", "母と 父"], answer: 0 }
      },
      {
        id: "2j-2",
        text: "新しい 本を 買って、毎日 読む。",
        q: { ask: "新しい 本を どうする？", choices: ["毎日 読む", "しまう"], answer: 0 }
      },
      {
        id: "2j-3",
        text: "理科の 時間に 池の 魚を 数える。",
        q: { ask: "池で なにを 数える？", choices: ["魚", "とり"], answer: 0 }
      },
      {
        id: "2j-4",
        text: "母と 市場で 野さいを 買う。",
        q: { ask: "市場で なにを 買う？", choices: ["野さい", "おかし"], answer: 0 }
      },
      {
        id: "2j-5",
        text: "音楽の 時間に みんなで 歌を 歌う。",
        q: { ask: "音楽の 時間に なにを する？", choices: ["歌を 歌う", "本を 読む"], answer: 0 }
      },
      {
        id: "2j-6",
        text: "夏の 海で 強い 風が ふく。",
        q: { ask: "海で なにが ふく？", choices: ["強い 風", "雪"], answer: 0 }
      },
      {
        id: "2j-7",
        text: "遠くの 空に 黒い 雲。",
        q: { ask: "空に なにが ある？", choices: ["黒い 雲", "星"], answer: 0 }
      },
      {
        id: "2j-8",
        text: "星と 光が きれいな 夜。",
        q: { ask: "いつ？", choices: ["夜", "昼"], answer: 0 }
      },
      {
        id: "2j-9",
        text: "晴れた 昼に 鳥が 鳴く。",
        q: { ask: "鳥は どうする？", choices: ["鳴く", "ねる"], answer: 0 }
      },
      {
        id: "2j-10",
        text: "岩の あいだから 雪どけ水が ながれる。",
        q: { ask: "岩から なにが？", choices: ["水", "火"], answer: 0 }
      },
      {
        id: "2j-11",
        text: "姉と 妹が 家で あそぶ。",
        q: { ask: "だれが あそぶ？", choices: ["姉と 妹", "父と 母"], answer: 0 }
      },
      {
        id: "2j-12",
        text: "父と 母は 親せきの 会に 行く。",
        q: { ask: "どこへ 行く？", choices: ["親せきの 会", "学校"], answer: 0 }
      },
      {
        id: "2j-13",
        text: "友だちの 顔を 見て 話す。",
        q: { ask: "なにを 見る？", choices: ["顔", "手"], answer: 0 }
      },
      {
        id: "2j-14",
        text: "弱い 牛を 強く そだてる。",
        q: { ask: "牛を どう する？", choices: ["強く そだてる", "売る"], answer: 0 }
      },
      {
        id: "2j-15",
        text: "国語と 算数を 教わる。",
        q: { ask: "なにを ならう？", choices: ["国語と 算数", "音楽"], answer: 0 }
      },
      {
        id: "2j-16",
        text: "古い 本を 読んで 記おくする。",
        q: { ask: "古い 本を どうする？", choices: ["読む", "すてる"], answer: 0 }
      },
      {
        id: "2j-17",
        text: "図を 見て 形を 考える。",
        q: { ask: "なにを 考える？", choices: ["形", "色"], answer: 0 }
      },
      {
        id: "2j-18",
        text: "半分の 米を 計りで はかる。",
        q: { ask: "なにを はかる？", choices: ["米", "水"], answer: 0 }
      },
      {
        id: "2j-19",
        text: "太い 線を 引く。",
        q: { ask: "どんな 線？", choices: ["太い", "細い"], answer: 0 }
      },
      {
        id: "2j-20",
        text: "丸い 形を 紙に 画く。",
        q: { ask: "どんな 形？", choices: ["丸い", "四角い"], answer: 0 }
      },
      {
        id: "2j-21",
        text: "汽車に のって 京へ 行く。",
        q: { ask: "なにに のる？", choices: ["汽車", "船"], answer: 0 }
      },
      {
        id: "2j-22",
        text: "船で 海を 西へ すすむ。",
        q: { ask: "どっちへ すすむ？", choices: ["西", "東"], answer: 0 }
      },
      {
        id: "2j-23",
        text: "電車で 東の 店へ 行く。",
        q: { ask: "どこへ？", choices: ["店", "家"], answer: 0 }
      },
      {
        id: "2j-24",
        text: "南北に のびる 道を 歩く。",
        q: { ask: "どの 道？", choices: ["南北の 道", "川"], answer: 0 }
      },
      {
        id: "2j-25",
        text: "交ばんの 前で 止まる。",
        q: { ask: "どこで 止まる？", choices: ["交ばんの 前", "こうえん"], answer: 0 }
      },
      {
        id: "2j-26",
        text: "広い 道に 来る 牛。",
        q: { ask: "どんな 道？", choices: ["広い", "せまい"], answer: 0 }
      },
      {
        id: "2j-27",
        text: "頭と 首を 体そうで うごかす。",
        q: { ask: "なにを うごかす？", choices: ["頭と 首", "手だけ"], answer: 0 }
      },
      {
        id: "2j-28",
        text: "肉と 麦を 食べて 元気に なる。",
        q: { ask: "なにを 食べる？", choices: ["肉と 麦", "くだもの"], answer: 0 }
      },
      {
        id: "2j-29",
        text: "心ぞうの 音を 聞く。",
        q: { ask: "なんの 音？", choices: ["心ぞう", "電車"], answer: 0 }
      },
      {
        id: "2j-30",
        text: "こわれた 戸を 直す。",
        q: { ask: "なにを 直す？", choices: ["戸", "本"], answer: 0 }
      },
      {
        id: "2j-31",
        text: "同じ 答えを 言う。",
        q: { ask: "どんな 答え？", choices: ["同じ", "ちがう"], answer: 0 }
      },
      {
        id: "2j-32",
        text: "刀で 竹を 切る。",
        q: { ask: "なにで 切る？", choices: ["刀", "はさみ"], answer: 0 }
      },
      {
        id: "2j-33",
        text: "色えんぴつで 絵を かく。",
        q: { ask: "なにで かく？", choices: ["色えんぴつ", "ふで"], answer: 0 }
      },
      {
        id: "2j-34",
        text: "毎日 弓と 矢を 用いる。",
        q: { ask: "なにを つかう？", choices: ["弓と 矢", "ぼうし"], answer: 0 }
      },
      {
        id: "2j-35",
        text: "今日は 曜日を 知る。",
        q: { ask: "なにを 知る？", choices: ["曜日", "名前"], answer: 0 }
      },
      {
        id: "2j-36",
        text: "秋と 冬は 夜が 長い。",
        q: { ask: "夜は どう？", choices: ["長い", "みじかい"], answer: 0 }
      },
      {
        id: "2j-37",
        text: "週に 一回 海へ 行く。",
        q: { ask: "どのくらい 行く？", choices: ["週に 一回", "毎日"], answer: 0 }
      },
      {
        id: "2j-38",
        text: "工作で 角を つくる。",
        q: { ask: "なにを つくる？", choices: ["角", "円"], answer: 0 }
      },
      {
        id: "2j-39",
        text: "大きな 声で 歌う。",
        q: { ask: "どんな 声？", choices: ["大きな", "小さな"], answer: 0 }
      },
      {
        id: "2j-40",
        text: "少しの 麦を 分ける。",
        q: { ask: "どれだけ 分ける？", choices: ["少し", "ぜんぶ"], answer: 0 }
      },
      {
        id: "2j-41",
        text: "番ごうを 黒ばんに 書く。",
        q: { ask: "なにを 書く？", choices: ["番ごう", "絵"], answer: 0 }
      },
      {
        id: "2j-42",
        text: "原っぱで 馬が 草を 食べる。",
        q: { ask: "なにが 草を 食べる？", choices: ["馬", "牛"], answer: 0 }
      },
      {
        id: "2j-43",
        text: "午後に 売り場へ 行く。",
        q: { ask: "いつ 行く？", choices: ["午後", "朝"], answer: 0 }
      },
      {
        id: "2j-44",
        text: "室内で 図かんを 外より 見る。",
        q: { ask: "どこで 見る？", choices: ["室内", "外"], answer: 0 }
      },
      {
        id: "2j-45",
        text: "地めんに 矢を さす。",
        q: { ask: "どこに さす？", choices: ["地めん", "空"], answer: 0 }
      },
      {
        id: "2j-46",
        text: "台の 上で 茶を いれる。",
        q: { ask: "なにを いれる？", choices: ["茶", "水"], answer: 0 }
      },
      {
        id: "2j-47",
        text: "むかしを 思い出す。",
        q: { ask: "なにを する？", choices: ["思い出す", "わすれる"], answer: 0 }
      },
      {
        id: "2j-48",
        text: "寺の 門を くぐり、谷を こえる。",
        q: { ask: "なにを くぐる？", choices: ["門", "戸"], answer: 0 }
      },
      {
        id: "2j-49",
        text: "会社の 工場で はたらく。",
        q: { ask: "どこで はたらく？", choices: ["工場", "家"], answer: 0 }
      },
      {
        id: "2j-50",
        text: "明るい 声で わらう。",
        q: { ask: "どんな 声？", choices: ["明るい", "くらい"], answer: 0 }
      },
      {
        id: "2j-51",
        text: "黄色の 花が さく 夏。",
        q: { ask: "なにいろの 花？", choices: ["黄色", "青"], answer: 0 }
      },
      {
        id: "2j-52",
        text: "何回も 同じ 道を 行く。",
        q: { ask: "どんな 道？", choices: ["同じ 道", "ちがう 道"], answer: 0 }
      },
      {
        id: "2j-53",
        text: "細い 糸で 羽を つくる。",
        q: { ask: "なにで つくる？", choices: ["細い 糸", "太い ぼう"], answer: 0 }
      },
      {
        id: "2j-54",
        text: "自分の 名前を 大きく 書く。",
        q: { ask: "なにを 書く？", choices: ["名前", "数字"], answer: 0 }
      },
      {
        id: "2j-55",
        text: "多くの 人が 谷を わたる。",
        q: { ask: "どこを わたる？", choices: ["谷", "海"], answer: 0 }
      },
      {
        id: "2j-56",
        text: "元気な 馬が 野原を 走る。",
        q: { ask: "どこを 走る？", choices: ["野原", "町"], answer: 0 }
      },
      {
        id: "2j-57",
        text: "元気に 活やくする 兄。",
        q: { ask: "兄は どう？", choices: ["活やく", "休む"], answer: 0 }
      },
      {
        id: "2j-58",
        text: "近くの 高い 山に のぼる。",
        q: { ask: "どんな 山？", choices: ["高い", "ひくい"], answer: 0 }
      },
      {
        id: "2j-59",
        text: "二人の 力を 合わせる。",
        q: { ask: "力を どう する？", choices: ["合わせる", "ぬく"], answer: 0 }
      },
      {
        id: "2j-60",
        text: "九才の 妹が わらう。",
        q: { ask: "妹は なん才？", choices: ["九才", "十才"], answer: 0 }
      },
      {
        id: "2j-61",
        text: "春に なって 花が さく。",
        q: { ask: "いつ 花が さく？", choices: ["春", "冬"], answer: 0 }
      },
      {
        id: "2j-62",
        text: "赤組と 白組に 分かれる。",
        q: { ask: "なん組に 分かれる？", choices: ["赤組と 白組", "一組だけ"], answer: 0 }
      },
      {
        id: "2j-63",
        text: "学校へ 通う 道。",
        q: { ask: "どこへ 通う？", choices: ["学校", "店"], answer: 0 }
      },
      {
        id: "2j-64",
        text: "点と 線を つなぐ。",
        q: { ask: "なにを つなぐ？", choices: ["点と 線", "丸"], answer: 0 }
      },
      {
        id: "2j-65",
        text: "光を 顔に 当てる。",
        q: { ask: "なにを 当てる？", choices: ["光", "水"], answer: 0 }
      },
      {
        id: "2j-66",
        text: "北の 方角を しらべる。",
        q: { ask: "どっちの 方角？", choices: ["北", "南"], answer: 0 }
      },
      {
        id: "2j-67",
        text: "一万円の 本を 見る。",
        q: { ask: "いくらの 本？", choices: ["一万円", "百円"], answer: 0 }
      },
      {
        id: "2j-68",
        text: "毛糸で あんで つくる。",
        q: { ask: "なにで つくる？", choices: ["毛糸", "紙"], answer: 0 }
      },
      {
        id: "2j-69",
        text: "山里に すむ。",
        q: { ask: "どこに すむ？", choices: ["山里", "海べ"], answer: 0 }
      },
      {
        id: "2j-70",
        text: "学校から 家に 帰る。",
        q: { ask: "どこに 帰る？", choices: ["家", "店"], answer: 0 }
      }
    ]
  }
});
