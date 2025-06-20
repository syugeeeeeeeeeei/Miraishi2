# ⚡ Electron-Vite-Shadcn Interactive Demo

これは、Electron・Vite・React・TypeScript、そしてshadcn/uiを使用して構築された、モダンでインタラクティブなUIのデモンストレーションプロジェクトです。フルスクリーンのスライドショー形式で、デスクトップアプリのようなリッチなユーザー体験を提供します。

## ✨ 主な機能

-   **モダンな技術スタック**: Electron, Vite, React, TypeScriptを採用し、高速な開発体験を実現。
-   **美しいUI**: shadcn/uiとTailwind CSSによる、カスタマイズ可能でアクセシブルなコンポーネント。
-   **インタラクティブなプレゼンテーション**: フルスクリーンの垂直スライドショーUI。
-   **多彩なナビゲーション**: マウススクロール、矢印ボタン、サイドインジケーターによるスライド操作。
-   **ループ機能**: 最後のスライドから最初へシームレスにループ。
-   **ダークモード対応**: OSの設定に連動し、手動切り替えも可能なダークモード。テーマは`localStorage`に保存。
-   **豊富なコンポーネントデモ**: `Button`, `Card`, `AlertDialog`, `Slider`, `Tabs`, `Sonner` (Toast)など、shadcn/uiの主要コンポーネントを実装。
-   **アニメーション**: CSSによる背景グラデーションアニメーションや、滑らかなスライドトランジション。

## 🚀 セットアップと実行

### 前提条件

プロジェクトを実行するには、以下の環境が必要です。

-   Node.js (v18以降を推奨)
-   Yarn

### インストール

1.  **リポジトリをクローンします:**
    ```sh
    git clone [https://github.com/syugeeeeeeeeeei/Electron-Vite-Shadcn.git](https://github.com/syugeeeeeeeeeei/Electron-Vite-Shadcn.git)
    cd Electron-Vite-Shadcn
    ```

2.  **依存関係をインストールします:**
    ```sh
    yarn install
    ```

### 開発サーバーの起動

以下のコマンドを実行すると、開発サーバーが起動します。

```sh
yarn dev
````

ブラウザで `http://localhost:5173` （ポートは異なる場合があります）にアクセスしてください。

### ビルド

本番用のファイルを生成するには、以下のコマンドを実行します。

```sh
yarn build
```

`out`および`build`ディレクトリに最適化されたファイルが生成されます。

## 🛠️ プロジェクト構造

プロジェクトの主要なディレクトリとファイルは以下の通りです。

```
.
├── build/                  # Electron Builderの配布物出力先
├── out/                    # Electron-Viteのビルド出力先
├── resources/              # ビルド時にコピーされる静的リソース
├── src/
│   ├── main/               # Electronメインプロセス関連のソース
│   │   └── index.ts
│   ├── preload/            # Electronプリロードスクリプト
│   │   └── index.ts
│   └── renderer/           # レンダラープロセス (Reactアプリ)
│       └── src/
│           ├── assets/
│           ├── components/ # 独自に作成したReactコンポーネント
│           ├── App.tsx     # メインのReactコンポーネント
│           ├── main.tsx    # Reactアプリのエントリポイント
│           └── shadcn/     # shadcn/ui関連のファイル
│               ├── components/ui/
│               └── lib/
├── electron.vite.config.ts # Electron-Vite設定
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

  - **`src/renderer/src/App.tsx`**: このプロジェクトの中心となるUIコンポーネントです。スライドのコンテンツ、レイアウト、ナビゲーションロジックのすべてが含まれています。
  - **`src/main/index.ts`**: Electronのメインプロセスで、ウィンドウの作成などを管理します。
  - **`src/preload/index.ts`**: メインプロセスとレンダラープロセスを安全に橋渡しするスクリプトです。

### パスエイリアスについて

このプロジェクトでは、Viteの設定により以下のパスエイリアスが定義されています。

  - `@shadcn` は `src/renderer/src/shadcn` を指します。

これにより、コンポーネントをインポートする際に、以下のように記述できます。

```tsx
import { Button } from '@shadcn/components/ui/button';
```

## 🔧 カスタマイズ

### スライドの追加・編集

スライドのコンテンツは`src/renderer/src/App.tsx`内の`slides`配列で定義されています。スライドを追加・編集するには、以下の手順に従います。

1.  `totalSlides`定数の値を目的のスライド数に更新します。
2.  `slides`配列に新しいReact要素（JSX）を追加または編集します。各要素が1つのスライドに対応します。

<!-- end list -->

```tsx
// src/renderer/src/App.tsx

// ...
const totalSlides = 4; // スライド数を4に変更
// ...
const slides = [
    // 既存のスライド ...
    // ...
    // 新しいスライドを追加
    <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-4xl">4番目の新しいスライド</h1>
    </div>
];
// ...
```

### テーマの変更

カラーテーマはグローバルなCSSファイル（例: `src/renderer/src/assets/index.css`）で定義されたCSS変数を介して制御されます。`:root`で定義されているカラー変数を変更することで、全体のカラースキームを調整できます。

```css
/* src/renderer/src/assets/index.css */

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ...他のカラー変数を変更... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ...他のカラー変数を変更... */
}
```

## 📜 ライセンス

このプロジェクトは [MIT License](https://www.google.com/search?q=LICENSE) の下で公開されています。

