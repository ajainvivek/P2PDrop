<h1 align="center">
  <br>
  <img src="http://i.imgur.com/OiyFJKz.png" alt="P2PDrop" width="200">
  <br>
  P2PDrop
  <br>
  <br>
</h1>

<h4 align="center">Securely share files between peers powered by WebRTC</h4>

[![Join the chat at https://gitter.im/ajainvivek/P2PDrop](https://badges.gitter.im/ajainvivek/P2PDrop.svg)](https://gitter.im/ajainvivek/P2PDrop?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

P2PDrop is a secure file sharing application which allows you to transfer files directly between devices, without having to upload to any server. It uses [WebRTC](http://www.webrtc.org)(data channels) powered [WebTorrent](https://webtorrent.io/) for peer-to-peer file transport, [SimpleWebRTC](https://github.com/andyet/SimpleWebRTC) for exchange of hash handshake between peers and [Firebase](https://www.firebase.com) for presence management.

P2PDrop requires internet connection to establish handshake between peers. It lets you securely share large files without even uploading to server therefore you need not worry about data leakage.

### Setup & Installation Steps
* Once the repository is cloned do npm install & bower install.
* If you are using latest version of node and get script error in terminal then paste below script in terminal
```js
git clone git://github.com/creationix/nvm.git ~/.nvm
printf "\n\n# NVM\nif [ -s ~/.nvm/nvm.sh ]; then\n\tNVM_DIR=~/.nvm\n\tsource ~/.nvm/nvm.sh\nfi" >> ~/.bashrc
NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
```
* Configuration - go to config/environment.js update the config
```js
/**
* Set your custom configuration here
**/
var config = {
  firebase : "", //firebase url
  imgur : "", //imgur client id
  googleAnalytics : "", //google analytics is
  emailServer : "", //custom email server
  signallingServer : "" //custom signalling server
};
```
* Run the application on browsers
```js
ember serve
```
* Generate electron builds
```js
ember electron:generate
```


### Supported browsers & desktop
* Chrome (desktop and Android) 33+
* Windows, Mac & Linux

### Note
* P2PDrop is currently developer version.
* Any bugs observed. Please report it so we can get it fixed for you.

## License

#### The MIT License (MIT)

Copyright (c) Chaicode

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
