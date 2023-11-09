FROM node:16

ENV NODE_OPTIONS=--max-old-space-size=16384

WORKDIR /myfolder/
COPY . /myfolder

RUN apt-get clean && apt-get update 

RUN apt-get -y install locales && export LANGUAGE=ko_KR.UTF-8 && export LANG=ko_KR.UTF-8 && locale-gen ko_KR ko_KR.UTF-8 \
    && apt-get install -y libseccomp2 \
    && apt-get install -y libnss3 libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev \
    && apt-get install -y wget gnupg fonts-ipafont-gothic fonts-freefont-ttf fonts-noto-cjk firefox-esr --no-install-recommends 

RUN apt-get install -y python3-pip \
    && pip3 install PyPDF2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY ./package.json /myfolder/
COPY ./package-lock.json /myfolder/

RUN npm install && PUPPETEER_PRODUCT=firefox npm install puppeteer

CMD npm run start:dev

HEALTHCHECK --interval=30s --timeout=300s --retries=2 \
    CMD curl -f http://localhost:4999/health -s -w %{http_code} | grep 200 || kill -9 `pgrep -f "nest start"`