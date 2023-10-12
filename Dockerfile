FROM node:20-slim

# install
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# build
COPY . .
RUN pnpm build

# migrate
# RUN pnpm db:migrate

# remove unused files
RUN rm -rf src .github .vscode

# run
EXPOSE 3000
CMD ["pnpm", "start"]
