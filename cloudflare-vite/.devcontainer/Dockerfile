# ベースイメージから継承
FROM devcontainer-base:latest

# rootユーザーに切り替えてパッケージインストール
USER root

# Node.js 24.x のインストール
ENV NODE_VERSION=24.x
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# グローバルパッケージマネージャーのインストール
RUN npm install -g pnpm

# Cloudflare / 開発ツールのインストール
RUN npm install -g \
    wrangler \
    typescript \
    ts-node

# 開発者ユーザーに戻る
USER developer

# npm globalディレクトリ作成
RUN mkdir -p ~/.npm-global

# Node.js用のzsh設定追加
RUN echo '' >> ~/.zshrc \
    && echo '# Node.js environment' >> ~/.zshrc \
    && echo 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.zshrc \
    && echo 'export NPM_CONFIG_PREFIX=$HOME/.npm-global' >> ~/.zshrc

# 作業ディレクトリ
WORKDIR /workspaces
