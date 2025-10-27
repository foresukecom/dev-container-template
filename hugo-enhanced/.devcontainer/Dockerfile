FROM devcontainer-base:latest

USER root

# HUGO_VERSION を指定（最新版を使用）
ARG HUGO_VERSION=0.150.1
ARG TARGETARCH

# Hugo Extended版のインストール（アーキテクチャ自動判定）
RUN ARCH=$(case ${TARGETARCH} in \
        "amd64") echo "amd64" ;; \
        "arm64") echo "arm64" ;; \
        *) echo "amd64" ;; \
    esac) \
    && wget -q https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-${ARCH}.tar.gz \
    && tar -xzf hugo_extended_${HUGO_VERSION}_linux-${ARCH}.tar.gz \
    && mv hugo /usr/local/bin/ \
    && rm hugo_extended_${HUGO_VERSION}_linux-${ARCH}.tar.gz \
    && chmod +x /usr/local/bin/hugo

# Node.js（PostCSSやTailwind等のツールに必要）
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# グローバルnpmパッケージ（Hugo開発でよく使うもの）
RUN npm install -g \
    postcss-cli \
    autoprefixer \
    @fullhuman/postcss-purgecss

USER developer

# 作業ディレクトリ
WORKDIR /workspaces

# Hugoバージョン確認コマンドを.zshrcに追加
RUN echo '' >> ~/.zshrc \
    && echo '# Hugo version info' >> ~/.zshrc \
    && echo 'hugo version' >> ~/.zshrc