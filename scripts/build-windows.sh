#!/bin/bash
# Windows クロスコンパイルビルドスクリプト (WSL Ubuntu 用)

set -e

echo "=== OCI Desktop Windows Cross-Compile Build ==="
echo ""
echo "WARNING: Cross-compilation produces a standalone .exe only."
echo "         WebView2 runtime must be installed on target Windows."
echo ""

# 色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 前提条件チェック
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # mingw-w64 チェック
    if ! command -v x86_64-w64-mingw32-gcc &> /dev/null; then
        echo -e "${RED}Error: mingw-w64 is not installed.${NC}"
        echo "Install with: sudo apt install -y mingw-w64"
        exit 1
    fi
    
    # Rust ターゲットチェック
    if ! rustup target list --installed | grep -q "x86_64-pc-windows-gnu"; then
        echo -e "${YELLOW}Adding Rust target x86_64-pc-windows-gnu...${NC}"
        rustup target add x86_64-pc-windows-gnu
    fi
    
    # Node.js チェック
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Prerequisites OK${NC}"
}

# フロントエンドビルド
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    npm install
    npm run build
    echo -e "${GREEN}Frontend build complete${NC}"
}

# Rust バックエンドビルド
build_backend() {
    echo -e "${YELLOW}Building Rust backend for Windows...${NC}"
    cd src-tauri
    cargo build --release --target x86_64-pc-windows-gnu
    cd ..
    echo -e "${GREEN}Backend build complete${NC}"
}

# WebView2Loader.dll をダウンロード
download_webview2_loader() {
    echo -e "${YELLOW}Downloading WebView2Loader.dll...${NC}"
    
    local OUTPUT_DIR="src-tauri/target/x86_64-pc-windows-gnu/release"
    local DLL_FILE="$OUTPUT_DIR/WebView2Loader.dll"
    
    # 既に存在する場合はスキップ
    if [ -f "$DLL_FILE" ]; then
        echo -e "${GREEN}WebView2Loader.dll already exists.${NC}"
        return 0
    fi
    
    # NuGet から WebView2 SDK をダウンロード
    local TEMP_DIR=$(mktemp -d)
    local NUGET_URL="https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/1.0.2792.45"
    
    cd "$TEMP_DIR"
    
    # パッケージをダウンロードして解凍
    if command -v wget &> /dev/null; then
        wget -q "$NUGET_URL" -O webview2.zip
    elif command -v curl &> /dev/null; then
        curl -sL "$NUGET_URL" -o webview2.zip
    else
        echo -e "${RED}Error: wget or curl is required.${NC}"
        cd - > /dev/null
        rm -rf "$TEMP_DIR"
        return 1
    fi
    
    # unzip で解凍
    if command -v unzip &> /dev/null; then
        unzip -q webview2.zip
    else
        echo -e "${RED}Error: unzip is required.${NC}"
        cd - > /dev/null
        rm -rf "$TEMP_DIR"
        return 1
    fi
    
    # DLL をコピー
    mkdir -p "$OUTPUT_DIR"
    cp "build/native/x64/WebView2Loader.dll" "$DLL_FILE" 2>/dev/null || \
    cp "runtimes/win-x64/native/WebView2Loader.dll" "$DLL_FILE" 2>/dev/null
    
    cd - > /dev/null
    rm -rf "$TEMP_DIR"
    
    if [ -f "$DLL_FILE" ]; then
        echo -e "${GREEN}WebView2Loader.dll downloaded successfully.${NC}"
    else
        echo -e "${RED}Failed to download WebView2Loader.dll.${NC}"
        return 1
    fi
}

# ビルド成果物確認
show_result() {
    echo ""
    echo -e "${GREEN}=== Build Complete ===${NC}"
    echo ""
    echo "Windows executable:"
    echo "  src-tauri/target/x86_64-pc-windows-gnu/release/oci-desktop-unofficial.exe"
    echo "  src-tauri/target/x86_64-pc-windows-gnu/release/WebView2Loader.dll"
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}IMPORTANT: Copy both files to Windows!${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    echo "The target Windows machine needs:"
    echo "  1. Both .exe and .dll files in the same directory"
    echo "  2. Microsoft Edge WebView2 Runtime installed"
    echo ""
    echo "WebView2 Runtime download:"
    echo "  https://developer.microsoft.com/microsoft-edge/webview2/"
    echo ""
    echo "Or use GitHub Actions for complete installer:"
    echo "  git tag v0.1.0 && git push origin v0.1.0"
    echo ""
}

# メイン実行
main() {
    check_prerequisites
    build_frontend
    build_backend
    download_webview2_loader
    show_result
}

main "$@"
