FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && \
    apt-get install -y curl git vim zsh sudo locales tree software-properties-common && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache to reduce image size

# Set timezone to JST
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set locale to Japanese
RUN locale-gen ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

# Install Node.js (LTS version 20.x) and the specified npm package
# NodeSourceのスクリプトがリポジトリの追加、GPGキーの設定、apt-get updateの実行を行います。
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g @anthropic-ai/claude-code && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* # Clean up apt cache and downloaded package files

# Set working directory
WORKDIR /workspace

# Set default command
# Note: docker-compose service command in compose.yml overrides this CMD
CMD [ "/bin/zsh" ]