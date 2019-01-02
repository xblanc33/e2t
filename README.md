# E2T : Exploratory Testing Tool
E2T allows you to perform exploratory testing campaigns on your website.

## Getting started

Launch the server:

```bash
cd e2t
docker-compose up --build
```

Build the chrome plugin:

```bash
cd e2t/chromePlugin
npm run debug
```

Then, follow the instructions [there](https://support.google.com/chrome_webstore/answer/2664769?hl=en) in order to install the plugin located in `e2t/chromePlugin/dist` in Chrome.

## An example workflow

Open the Chrome Extension and create campaign.  
Other testers can join an existing campaign by using the campaign id.

Click the **Record** button to start and record an expedition. 

Open a browser http://localhost/YOUR-CAMAPAIGN-ID and look if the performed expeditions are new (high level of entropy) or not so new.

This may help you to better explore and then make better exploratory tests.