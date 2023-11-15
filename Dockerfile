FROM node:18.17.1

WORKDIR /app
# npmとviteをインストール
RUN npm install -g npm@latest && npm install -g vite@latest
# Phaserをインストール
RUN npm install phaser@3.70.0
# ESLintとPrettierをインストール
RUN npm install -g eslint prettier
# tailwindcssをインストール
RUN npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

CMD ["npm", "run", "dev"]