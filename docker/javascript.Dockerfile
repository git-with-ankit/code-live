FROM node:18-alpine
RUN apk add --no-cache coreutils 
WORKDIR /sandbox
CMD ["sleep", "infinity"] 