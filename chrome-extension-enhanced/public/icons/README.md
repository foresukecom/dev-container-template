# アイコン画像

Chrome 拡張機能のアイコンを配置するディレクトリです。

## 必要なアイコンサイズ

以下のサイズのPNG画像を用意してください：

- `icon16.png` - 16x16px（ファビコン、ツールバー用）
- `icon48.png` - 48x48px（拡張機能管理ページ用）
- `icon128.png` - 128x128px（Chromeウェブストア用）

## アイコンの作成方法

### オンラインツール

- [Figma](https://www.figma.com/) - 無料のデザインツール
- [Canva](https://www.canva.com/) - テンプレートから簡単作成
- [GIMP](https://www.gimp.org/) - 無料の画像編集ソフト

### SVG から PNG への変換

現在、サンプルとして SVG ファイルが含まれています。
以下のツールで PNG に変換できます：

```bash
# ImageMagick を使用（要インストール）
convert icon16.svg icon16.png
convert icon48.svg icon48.png
convert icon128.svg icon128.png
```

または、オンラインツール：
- [CloudConvert](https://cloudconvert.com/svg-to-png)
- [Convertio](https://convertio.co/svg-png/)

## デザインのヒント

- シンプルで認識しやすいデザイン
- 背景は透過または単色
- 小さいサイズでも視認性を確保
- ブランドカラーを使用
- 角を丸める（現代的なデザイン）

## 現在のアイコン

サンプルとして青色の背景に白文字で「E」（Extension）を配置したSVGアイコンが含まれています。
実際のアプリケーションでは、これらをカスタムデザインのPNG画像に置き換えてください。
