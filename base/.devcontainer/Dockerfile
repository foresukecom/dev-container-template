FROM ubuntu:22.04

# 基本設定
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Tokyo

# パッケージリストの更新とロケール設定
RUN apt-get update && apt-get install -y \
    locales \
    tzdata \
    && locale-gen ja_JP.UTF-8 \
    && update-locale LANG=ja_JP.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 環境変数設定
ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:ja
ENV LC_ALL=ja_JP.UTF-8

# 基本開発ツールのインストール
RUN apt-get update && apt-get install -y \
    # 基本ツール
    curl \
    wget \
    unzip \
    git \
    vim \
    nano \
    make \
    build-essential \
    # zsh関連
    zsh \
    zsh-autosuggestions \
    zsh-syntax-highlighting \
    # その他便利ツール
    tree \
    htop \
    jq \
    sqlite3 \
    ca-certificates \
    gnupg \
    lsb-release \
    software-properties-common \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# JUSTタスクランナーのインストール
RUN ARCH=$(uname -m | sed 's/x86_64/x86_64/g' | sed 's/aarch64/aarch64/g') \
    && curl -L "https://github.com/casey/just/releases/latest/download/just-${ARCH}-unknown-linux-musl.tar.gz" -o just.tar.gz \
    && tar -xzf just.tar.gz \
    && mv just /usr/local/bin/just \
    && chmod +x /usr/local/bin/just \
    && rm just.tar.gz

# oh-my-zshのインストール
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# root以外のユーザー作成
ARG USERNAME=developer
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/zsh \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ユーザー切り替え
USER $USERNAME

# oh-my-zshをユーザー用にもインストール
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Claude Codeのインストール
RUN curl -fsSL https://claude.ai/install.sh | bash

# 基本的な.zshrc設定
RUN echo 'export ZSH="$HOME/.oh-my-zsh"' >> ~/.zshrc \
    && echo 'ZSH_THEME="robbyrussell"' >> ~/.zshrc \
    && echo 'plugins=(git)' >> ~/.zshrc \
    && echo 'source $ZSH/oh-my-zsh.sh' >> ~/.zshrc \
    && echo 'source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh' >> ~/.zshrc \
    && echo 'source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh' >> ~/.zshrc

# 作業ディレクトリ設定
WORKDIR /workspaces

# デフォルトシェルをzshに設定
ENV SHELL=/bin/zsh