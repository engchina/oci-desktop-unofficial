# oci-desktop-unofficial

OCI (Oracle Cloud Infrastructure) リソース管理デスクトップアプリケーション

---

## 目次

- [開発環境](#開発環境)
- [ビルド方法](#ビルド方法)
  - [各プラットフォームでビルド](#各プラットフォームでビルド)
  - [WSL Ubuntu での Windows クロスコンパイル](#wsl-ubuntu-での-windows-クロスコンパイル)
- [WebView2 Runtime について](#webview2-runtime-について)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [プロジェクト構成](#プロジェクト構成)

---

## 開発環境

### 必要条件

- Node.js 20+
- Rust (latest stable)
- Tauri CLI v2

### 開発モードで実行

```bash
npm install
npm run tauri dev
```

---

## ビルド方法

### 各プラットフォームでビルド

各プラットフォーム上で直接ビルドする場合：

```bash
npm run tauri build
```

| プラットフォーム | 生成物 |
|-----------------|--------|
| Windows | `.exe` (NSIS), `.msi` |
| macOS | `.app`, `.dmg` |
| Linux | `.deb`, `.AppImage` |

---

### WSL Ubuntu での Windows クロスコンパイル

WSL Ubuntu 環境から Windows 向けにクロスコンパイル可能です。

#### 前提条件

```bash
# mingw-w64 インストール
sudo apt update
sudo apt install -y mingw-w64

# Rust ターゲット追加
rustup target add x86_64-pc-windows-gnu
```

#### ビルド実行

```bash
# ビルドスクリプトを使用（推奨）
./scripts/build-windows.sh

# または手動実行
npm run build
cd src-tauri
cargo build --release --target x86_64-pc-windows-gnu
```

#### 生成物

```
src-tauri/target/x86_64-pc-windows-gnu/release/oci-desktop-unofficial.exe
```

#### 制限事項

| 項目 | 説明 |
|------|------|
| 生成可能 | `.exe` ファイルのみ |
| 生成不可 | NSIS/WiX インストーラー |
| 回避策 | GitHub Actions を使用して完全なインストーラーを作成 |

---

## WebView2 Runtime について

### ⚠️ 必須要件

Tauri アプリケーションは **Microsoft Edge WebView2 Runtime** を使用します。

#### WSL クロスコンパイルの場合

生成された `.exe` を実行するには、**対象の Windows マシンに WebView2 Runtime がインストールされている必要があります**。

エラー例：
```
WebView2Loader.dll が見つからないため、コードを実行できません。
```

#### 解決方法

**方法 1: WebView2 Runtime をインストール**

[Microsoft Edge WebView2 ダウンロードページ](https://developer.microsoft.com/microsoft-edge/webview2/) からインストーラーをダウンロードできます。

| インストーラー種類 | 説明 | 推奨用途 |
|------------------|------|----------|
| **Evergreen Bootstrapper** | 軽量（約2MB）、最新版を自動ダウンロード・インストール | **通常はこれを推奨** |
| Evergreen Standalone Installer | 完全オフラインインストーラー（約120MB）、ネットワーク不要 | オフライン環境、企業展開 |
| Fixed Version | 特定バージョンの固定 | 特定バージョンが必要な場合のみ |

**推奨: Evergreen Bootstrapper (x64)**

```
https://go.microsoft.com/fwlink/p/?LinkId=2124703
```

> 💡 **Tip**: Windows 10/11 の多くは既に WebView2 Runtime がインストールされています。アプリが起動しない場合のみインストールしてください。

**方法 2: GitHub Actions でインストーラーをビルド（推奨）**

GitHub Actions でビルドした NSIS インストーラーには WebView2 Bootstrapper が自動的に同梱されます。

```bash
git tag v0.1.0
git push origin v0.1.0
```

---

## GitHub Actions CI/CD

`.github/workflows/build.yml` でマルチプラットフォームビルドを自動化しています。

### 使用方法

```bash
# タグをプッシュしてビルドをトリガー
git tag v0.1.0
git push origin v0.1.0
```

### 自動生成される成果物

| プラットフォーム | 成果物 |
|-----------------|--------|
| Windows | NSIS インストーラー (WebView2 同梱) |
| macOS | `.dmg` |
| Linux | `.deb`, `.AppImage` |

---

## プロジェクト構成

```
.
├── src/                    # React フロントエンド
├── src-tauri/              # Rust バックエンド
│   ├── src/                # Rust ソースコード
│   ├── Cargo.toml          # Rust 依存関係
│   └── tauri.conf.json     # Tauri 設定
├── .cargo/                 # Cargo 設定（クロスコンパイル）
│   └── config.toml         # クロスコンパイル用リンカー設定
├── scripts/                # ビルドスクリプト
│   └── build-windows.sh    # Windows クロスコンパイルスクリプト
└── .github/workflows/      # CI/CD 設定
    └── build.yml           # マルチプラットフォームビルド
```

---

## クイックリファレンス

| 目的 | コマンド |
|------|---------|
| 開発モード | `npm run tauri dev` |
| 各プラットフォームビルド | `npm run tauri build` |
| WSL で Windows ビルド | `./scripts/build-windows.sh` |
| CI/CD リリース | `git tag vX.X.X && git push origin vX.X.X` |
| WebView2 Runtime | https://developer.microsoft.com/microsoft-edge/webview2/ |