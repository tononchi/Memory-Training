# Memory-Training

小学校1〜2年生向けの、Web版速読トレーニングアプリです。  
ローカル実行でも、静的ホスティング（GitHub Pages / Netlify / Vercel など）でも動作します。

## 使い方（ローカル）

### 1) ファイルを直接開く
`/home/runner/work/Memory-Training/Memory-Training/index.html` をブラウザで開くだけで実行できます。

### 2) 簡易サーバーで実行（推奨）

```bash
cd /home/runner/work/Memory-Training/Memory-Training
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。

## 機能

- 学年別（1〜2年）短文トレーニング
- 表示スピード調整
- 1分セッションの速読練習
- 即時スコア・コンボ
- 毎日継続（streak）とスター/バッジ
- 成績のローカル保存（`localStorage`）

## デプロイ

このリポジトリは静的ファイルのみのため、`index.html`, `styles.css`, `app.js`, `docs/` をそのまま配置できる環境ならデプロイ可能です。

## 調査ドキュメント

- `/home/runner/work/Memory-Training/Memory-Training/docs/speed-reading-research.md`
