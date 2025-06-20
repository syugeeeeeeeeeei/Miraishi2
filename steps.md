# ✨ 実装手順：未来視 (Miraishi)

このドキュメントでは、「未来視 (Miraishi)」アプリケーションの要件定義に基づき、各機能を実装するための詳細な手順を記述します。

## 🚀 開発環境のセットアップ

1.  **既存リポジトリの初期設定**
      * 依存関係をインストールします。
        ```sh
        yarn install
        ```
      * 開発サーバーを起動し、動作を確認します。
        ```sh
        yarn dev
        ```
      * PrettierとESLintの設定を確認し、必要に応じて調整します。
        ```sh
        yarn format
        yarn lint
        ```
2.  **必要なライブラリの確認**
      * `package.json`で以下のライブラリがインストールされていることを確認します。
          * `react`, `react-dom`
          * `electron`, `electron-vite`
          * `shadcn/ui` (今回は手動でコンポーネントが追加されているため、個別のパッケージではなくファイルとして存在)
          * `jotai` (インストールが必要な場合、`package.json`に追加)
          * `zod`
          * `date-fns`
          * `vitest` (開発依存としてインストール)
          * `react-chartjs-2`, `chart.js` (インストールが必要な場合)
          * `electron-store` (インストールが必要な場合)
          * `electron-updater` (インストールが必要な場合)
          * `dotenv` (インストールが必要な場合)
3.  **全体的なディレクトリ構成の決定と作成**
      * アプリケーション全体のディレクトリ構成を設計し、`docs/architecture/directory_structure.md`などのドキュメントにまとめます。
      * 以下のshellscriptをプロジェクトルートに`create_directories.sh`として保存し、実行することで一括で必要なディレクトリを作成します。
        ```sh
        #!/bin/bash

        echo "Creating project directories..."

        # Base directories
        mkdir -p src/{main,preload,renderer/src}

        # Renderer specific directories
        mkdir -p src/renderer/src/{components,views,stores,utils,types,constants,services,hooks,globalStyles}
        mkdir -p src/renderer/src/views/{DataView,GraphView,ScenarioView}
        mkdir -p src/renderer/src/components/{common,layout,data,form,navigation,charts,modals}
        mkdir -p src/renderer/src/stores/{data,ui,scenario}
        mkdir -p src/renderer/src/types/{api,domain,store}
        mkdir -p src/renderer/src/services/{calculation,storage,api}
        mkdir -p src/renderer/src/hooks/ui

        # Shadcn UI components (assuming they are already copied/generated or will be)
        mkdir -p src/renderer/src/shadcn/{components/ui,lib,hooks}

        # Configuration and static assets
        mkdir -p config
        mkdir -p resources/{icons,json-schemas}
        mkdir -p public # for Vite static assets if any

        # Documentation (if not already present)
        mkdir -p docs/{architecture,features}

        echo "Directories created successfully!"
        ```
      * `create_directories.sh`ファイルを保存したら、実行権限を付与し、実行します。
        ```sh
        chmod +x create_directories.sh
        ./create_directories.sh
        ```
      * **ディレクトリ・ファイル構成を途中で変更する場合**:
          * 新しいディレクトリを作成する場合: `mkdir -p path/to/new/directory`
          * ファイルを移動する場合: `mv old/path/to/file new/path/to/file`
          * ファイル名を変更する場合: `mv old/path/to/file new/path/to/renamed_file`
          * ファイルを削除する場合: `rm path/to/file`
          * ディレクトリを削除する場合 (中身も含む): `rm -rf path/to/directory`

## 🛠️ UI/UX実装

### 🎨 アプリ全体のデザインシステム構築

1.  **Tailwind CSSの調整**
      * `tailwind.config.js`を更新し、`border-radius`が要件の`md`（適度な角丸）に沿っているか確認・調整します。
      * `src/renderer/src/globalStyles/violet.css`を基に、[要件](https://www.google.com/search?q=syugeeeeeeeeeei/miraishi2/Miraishi2-32d49476d2520497feec26227329df37aa806af7/youken.md)に記載されているカラースキーム（ライト系の紫、ダーク系の紫、メインコントラストカラー、プライマリーカラー、セカンダリーカラー、アクセントカラー、ニュートラルカラー、注意色）が正確に反映されているか確認します。
      * `App.tsx`の背景グラデーション（`animated-gradient`）が、設定したカラー変数（`--accent`, `--secondary`, `--primary`）を使用していることを確認します。

### 🕹️ コントロールパネル (Control Panel) の実装

1.  **基本レイアウトの構築**
      * `App.tsx`または専用のコンポーネントで、メインウィンドウの左端に固定される縦長のパネル（コントロールパネル）の基本構造を作成します。
      * パネルの折りたたみ/展開アニメーションを実装します。`shadcn/ui`の`Sheet`コンポーネントをベースに検討します。
2.  **ボタンセクションの追加**
      * 最上段にハンバーガーボタンと検索ボタンを配置します。`shadcn/ui`の`Button`コンポーネントを使用します。
      * 検索ボタンクリック時の白い楕円形検索フォームのアニメーションと機能（フォームへのアニメーション移動、入力フィールド、Xボタン）を実装します。`Input`コンポーネントを使用します。
3.  **シナリオ関連ボタンの追加**
      * シナリオ新規作成ボタンをシナリオリストセクションの直上またはリスト内に配置します。
4.  **シナリオビュー（シナリオリストセクション）の実装**
      * 「シナリオ」タイトルとインポートボタンを横並びで配置します。
      * インポート成否メッセージの一時表示機能を実装します。
      * シナリオリストのスクロール可能な領域を作成し、各シナリオを`Button`コンポーネントで表示します。
      * シナリオ名が長い場合の省略表示（`text-ellipsis`や`line-clamp` Tailwind CSSクラスとツールチップ）と、「︙」ボタン（`DropdownMenu`コンポーネントを利用）でのメニュー表示（「シナリオを追加」「名前の変更」「削除」「エクスポート」）を実装します。

### 📊 データビュー (Data View) の実装

1.  **データビューコンポーネントの作成**
      * メインパネル内に表示される、枠線で囲われた独立した`DataView`コンポーネントを作成します。`Card`コンポーネントをベースに検討します。
      * 枠線の上部または左上隅に`legend`風のセクション名（タイトル）を表示するCSSスタイルとJSXを実装します。
      * タイトルをインライン編集可能にします。
      * タイトルの横に「X」削除ボタンを配置し、クリックでコンポーネントが削除されるロジックを実装します。
2.  **シナリオ数に応じたレイアウト切り替え**
      * 状態管理（Jotai）で現在のシナリオ数を管理し、1つの場合は横データビュー、複数の場合は縦データビューに切り替わるロジックを実装します。
3.  **横データビュー (シナリオ1つの場合)**
      * 入力セクションと計算セクションを左右に分割するレイアウトを実装します。
      * 入力フィールドは`Input`、`Label`、`Switch`などの`shadcn/ui`コンポーネントを使用します。
      * 手当の動的追加（プラスボタンと行ごとの削除ボタン）を実装します。
      * 残業代の固定/非固定選択に応じた入力フィールドの表示/非表示ロジックを実装します。
4.  **縦データビュー (複数シナリオの場合)**
      * 入力セクションと計算セクションを上下に分割するレイアウトを実装します。
      * 追加されたデータビューが2つを超えた場合にメインパネルで横スクロール可能にするCSSとロジックを実装します。

### 📈 グラフビュー (Graph View) の実装

1.  **フロート表示機能**
      * メインパネルの画面端に「`<<`」ボタンを配置し、クリックでグラフビューが現在のデータビューの上にオーバーレイ表示されるロジックを実装します。`Dialog`コンポーネントやカスタムのモーダルコンポーネントをベースに検討します。
      * グラフビュー表示中は下のデータビューを半透明化または操作無効化するスタイルとロジックを適用します。
      * グラフビューを閉じる「X」ボタンと、データビューに戻る「`>>`」ボタンを配置します。
2.  **グラフビュー内部レイアウト**
      * グラフビュー内部を左側70%（グラフセクション）と右側30%（コントロールセクション）に分割するCSS GridまたはFlexboxレイアウトを実装します。
3.  **グラフセクション（左70%）**
      * `react-chartjs-2`を使用して予測グラフ（折れ線グラフ）を表示します。
      * 複数シナリオを異なる色と凡例で重ねて表示する機能を実装します。
      * グラフ上の点クリックで詳細表示（ツールチップや専用パネル）するインタラクティブ機能を実装します。
      * 予測結果をテーブル形式で表示する切り替え機能を実装します。
4.  **コントロールセクション（右30%）**
      * 予測期間設定用に`Slider`コンポーネントと数値表示テキストボックスを配置します。
      * 月平均残業時間入力用に`Input`コンポーネントと単位表示を配置します。
      * 表示項目の選択用に`Tabs`または`ToggleGroup`コンポーネントを使用して、単一選択のトグルボタンを配置します。

## 💡 ロジック実装

### 📊 データ機能 (データビュー内)

1.  **データ構造定義**
      * 給与、手当、残業代、成長率などの入力値を管理するためのTypeScriptの型定義とZodスキーマを定義します。
2.  **入力状態管理**
      * Jotaiを使用して、各データビューの入力状態をグローバルに管理するアトムを作成します。
      * 入力フィールドとJotaiのアトムを連携させ、ユーザーの入力がリアルタイムで状態に反映されるようにします。

### 🧮 計算機能 (データビュー内)

1.  **税制計算ロジック**
      * 所得税、住民税、社会保険料（健康保険、厚生年金、雇用保険）の手取り計算ロジックを実装します。
      * 計算式や係数などの法改正対応のためのJSONスキーマファイルを定義し、そこからデータを読み込む仕組みを実装します。
      * 扶養家族、控除の種類・金額（医療費控除、生命保険料控除、iDeCoなど）を計算に含めるロジックを実装します。
2.  **予測計算ロジック**
      * 給与成長率、手当の期限、残業時間に基づいて、月収・年収の推移を予測するロジックを実装します。
      * 手取り額の予測も上記計算ロジックを適用して行います。

### 💾 保存・比較機能

1.  **シナリオ保存機能**
      * `electron-store`を使用して、シナリオデータ（入力条件のセット）をローカルストレージに保存する機能を実装します。
      * 保存ボタンクリック時にシナリオ名を入力するダイアログを表示し、保存を実行します。
2.  **シナリオ管理**
      * シナリオの新規作成、名前変更、削除機能を実装します。
      * シナリオのJSONエクスポート/インポート機能を実装します。
3.  **シナリオ比較表示**
      * 選択された複数のシナリオのデータをJotaiで管理し、メインパネルにそれぞれのデータビューコンポーネントを動的に追加するロジックを実装します。
      * グラフビューで複数のシナリオの予測結果を重ねて表示できるよう、データ処理とグラフ描画ロジックを調整します。

## ✅ テスト

1.  **単体テスト**
      * Vitestを使用して、計算ロジック（手取り額計算、予測計算）の単体テストを記述します。
2.  **結合テスト**
      * UIコンポーネント間の連携や、状態管理が正しく機能しているかを確認する結合テストを記述します。
3.  **E2Eテスト** (任意)
      * アプリケーション全体のユーザーフローをテストするためのE2Eテストを検討します。

## 📦 ビルドとリリース

1.  **本番ビルドの実行**
      * 開発が完了したら、本番用のファイルを生成します。
        ```sh
        yarn build
        ```
2.  **インストーラーの作成**
      * `electron-builder`を使用して、Windows、macOS、Linux向けのインストーラーを作成します。
        ```sh
        yarn build:win
        yarn build:mac
        yarn build:linux
        ```
3.  **アプリ内アップデートの実装**
      * `electron-updater`を使用して、アプリケーションの自動更新機能を実装します。
      * GitHub `GH_TOKEN`などの環境変数管理に`dotenv`を使用します。
4.  **README.mdの更新**
      * 開発の最後に、README.mdにアプリケーションの最終的な機能、セットアップ方法、使い方などを記述します。