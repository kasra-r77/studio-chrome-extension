# Studio chrome extension

This extension is meant for managing your Studio easier. Ultimately, Studio will always be available within a click. The extension has been built using react and bundled via webpack

## Available functionalities

at the moment the following functionalities are available:

- Listing collections
- Listing media within a collection
- Downloading uploaded media
- Add Youtube videos directly from youtube website or any website that embeds youtube video
- Download YouTube caption directly to your newly added Youtube video to Studio

## Studio button in YouTube

once you install the extension and login, you have the ability to to add YouTube videos directly into your Studio library by clicking on the Studio logo shown as a button available at Youtube video player controls

## Download caption button in YouTube

When opening YouTube videos, enable and English caption (auto generated is fine as well) and a download button appears which clicking on it will add the subtitle to your newly created YouTube media in Studio

### `npm run build`

Build the app and outputs it to `dist` folder

### `npm run watch`

Starts webpack in watch mode and re-builds the app on every change

## Known issues

- If you have the same YouTube video for different users, download button will always add it to first media which needs a follow up

## Contributing

Bug reports and pull requests are welcomed at https://github.com/kasra-r77/studio-chrome-extension
