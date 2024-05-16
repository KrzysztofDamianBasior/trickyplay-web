# build environment
FROM node:21 AS builder

# Setting up the work directory
WORKDIR /app

# Copy package.json and package-lock.json to the container 
COPY package*.json ./ 

# Install dependencies 
RUN npm install 
# RUN yarn install
# ENV PATH /app/node_modules/.bin:$PATH

# Base urls
ENV VITE_TRICKYPLAY_API_BASE_URL http://localhost:9000
ENV VITE_COMMENTS_URL comments
ENV VITE_REPLIES_URL replies
ENV VITE_USERS_URL users
ENV VITE_AUTH_URL auth
ENV VITE_ACCOUNT_URL account

# Auth urls
ENV VITE_SIGN_IN_ENDPOINT sign-in
ENV VITE_SIGN_UP_ENDPOINT sign-up
ENV VITE_ALL_SESSIONS_SIGN_OUT_ENDPOINT all-sessions-sign-out
ENV VITE_SINGLE_SESSION_SIGN_OUT_ENDPOINT single-session-sign-out
ENV VITE_REFRESH_ACCESS_TOKEN_ENDPOINT refresh-access-token

# Account urls
ENV VITE_ACCOUNT_ACTIVITY_SUMMARY_ENDPOINT activity-summary

# Users urls
ENV VITE_BAN_ENDPOINT ban
ENV VITE_UNBAN_ENDPOINT unban
ENV VITE_GRANT_ADMIN_PERMISSIONS_ENDPOINT grant-admin-permissions
ENV VITE_USERS_FEED_ENDPOINT feed
ENV VITE_USER_COMMENTS_ENDPOINT comments
ENV VITE_USER_REPLIES_ENDPOINT replies
ENV VITE_USER_ACCTIVITY_SUMMARY_ENDPOINT activity-summary

# Replies urls 
ENV VITE_REPLIES_FEED_ENDPOINT feed

# Comments urls
ENV VITE_COMMENTS_FEED_ENDPOINT feed

# Constraints
ENV VITE_MIN_NUM_OF_COMMENT_LETTERS 1
ENV VITE_MAX_NUM_OF_COMMENT_LETTERS 300

ENV VITE_MIN_NUM_OF_PASSWORD_LETTERS 4
ENV VITE_MAX_NUM_OF_PASSWORD_LETTERS 32

ENV VITE_MIN_NUM_OF_USERNAME_LETTERS 2
ENV VITE_MAX_NUM_OF_USERNAME_LETTERS 16

# Copy the rest of the application code 
# Directories are special! If you write: COPY dir1 dir2 ./
# that actually works like: COPY dir1/* dir2/* ./
# If you want to copy multiple directories (not their contents) under a destination directory in a single command, you'll need to set up the build context so that your source directories are under a common parent and then COPY that parent.
# if the sources are directories, this copies the directory contents, not the directories themselves
COPY README.md vitest.config.ts vite.config.ts tsconfig.node.json tsconfig.json LICENSE index.html .gitignore .eslintrc.cjs .env.test ./
COPY src ./src
COPY public ./public

RUN echo $(pwd)
RUN echo $(ls)
RUN echo $(ls node_modules)

# Build the React app 
RUN npm run build 
# RUN yarn run build
# node_modules/.bin/tsc --version

# Serve stage 
FROM nginx:1.25.1 

# Declaring env
# ENV NODE_ENV production

# Copy the custom nginx.conf file to the container 
# COPY ./nginx.conf /etc/nginx/nginx.conf

# Copying our default.conf 
COPY nginx.conf /etc/nginx/conf.d/default.conf

## Remove default nginx index page
# RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build stage to the nginx container 
COPY --from=builder /app/dist /usr/share/nginx/html 
# COPY --from=builder /app/dist /var/www/html/
COPY --from=builder /app/src/shared/assets /data/images

# Expose port 80 
EXPOSE 80 

# Start Nginx 
CMD ["nginx", "-g", "daemon off;"]

ARG DESCRIPTION="A neon-style website that allows you to play 2D games"
ARG BUILD_TAG=local
ARG VERSION=local

LABEL maintainer="krzysztofbasior"
LABEL description=${DESCRIPTION}
LABEL version=${VERSION}
LABEL build_tag=${BUILD_TAG}

# docker build --no-cache --progress=plain . 