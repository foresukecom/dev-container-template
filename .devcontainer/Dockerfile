FROM ubuntu:latest

# Install necessary packages
RUN apt-get update && apt-get install -y curl git vim zsh sudo locales tree software-properties-common

# Set timezone to JST
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set locale to Japanese
RUN locale-gen ja_JP.UTF-8
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

# # Vue開発時に使用
# RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash -
# RUN apt-get install -y nodejs
# RUN npm install -g @vue/cli yarn webpack babel-cli @storybook/cli

# # Golangでの開発時に使用
RUN add-apt-repository ppa:longsleep/golang-backports
RUN apt install -y golang-go


# Set working directory
WORKDIR /workspace

# Set default command
CMD [ "/bin/zsh" ]
