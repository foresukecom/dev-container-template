# ベースイメージから継承
FROM devcontainer-base:latest

# rootユーザーに切り替えてパッケージインストール
USER root

# Node.jsとnpmのインストール
ENV NODE_VERSION=20.x
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \
    && apt-get install -y nodejs

# yarn、pnpm、Vue.js関連のグローバルパッケージをインストール
RUN npm install -g yarn pnpm @vue/cli create-vue

# 開発者ユーザーに戻る
USER developer

# Node.js用のzsh設定追加
RUN echo '# Node.js environment' >> ~/.zshrc \
    && echo 'export PATH=$HOME/.npm-global/bin:$PATH' >> ~/.zshrc \
    && echo 'export NPM_CONFIG_PREFIX=$HOME/.npm-global' >> ~/.zshrc

# npm globalディレクトリ作成
RUN mkdir -p ~/.npm-global