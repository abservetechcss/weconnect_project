## Stage 1 : Build the Application
# get the base node image
FROM 112282000361.dkr.ecr.eu-central-1.amazonaws.com/weconnect/kaiwa-ui:builder-node-12.22-bullseye as builder

# set the working dir for container
# WORKDIR /frontend

# copy the json file first
COPY ./package.json /frontend

# install npm dependencies
RUN npm install

# copy other project files
COPY . .

# build the folder
RUN npm run build

## Stage 2: Build docker image with Nginx
FROM nginx:1.22
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY icons /usr/share/nginx/html/icons
COPY sounds /usr/share/nginx/html/sounds
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
