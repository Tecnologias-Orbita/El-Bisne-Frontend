FROM node:22-alpine AS build

ARG GITHUB_TOKEN

WORKDIR /app

COPY ./package.json ./
COPY ./.npmrc ./

RUN export GITHUB_TOKEN=${GITHUB_TOKEN}
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:22-alpine

ARG GITHUB_TOKEN

WORKDIR /app

COPY --from=build /app/package.json .
COPY --from=build /app/.npmrc .

RUN export GITHUB_TOKEN=${GITHUB_TOKEN}
RUN npm install --omit='dev' --legacy-peer-deps

COPY --from=build /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]