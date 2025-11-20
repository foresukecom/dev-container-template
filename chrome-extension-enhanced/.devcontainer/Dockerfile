# ベースイメージから継承
FROM devcontainer-base:latest

# rootユーザーに切り替えてパッケージインストール
USER root

# Node.js 20.xのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Chrome/Chromiumのインストール（拡張機能のテストに必要）
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# 開発者ユーザーに戻る
USER developer

# グローバルにインストールする開発ツール
RUN npm install -g \
    pnpm \
    yarn \
    web-ext \
    typescript \
    vite

# Node.js用のzsh設定追加
RUN echo '# Node.js environment' >> ~/.zshrc \
    && echo 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.zshrc
