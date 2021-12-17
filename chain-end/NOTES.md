# Notes

## JSON Metadata for Token URI

- Metadata follows the basic format of:
  `{ "name": "Name of the image", "description": "A description of the image", "image": "https://i.imgur.com/example.png"}`
- Can use [jsonkeeper.com](https://jsonkeeper.com) to host the metadata and pass to the function
- NOTE: if using this **_off-chain_** method, if either imgur or jsonkeeper went down, the NFT would be forever lost.

## Useful links

- Convert SVG to base64 [here](https://www.utilities-online.info/base64)
- View SVGs and optimize [here](https://www.svgviewer.dev/)
- View an NFT [here](https://nftpreview.0xdev.codes/)

## Viewing What Was Made

- Go to: [testnets.opensea.io](https://testnets.opensea.io)
- Past contract address into search. Don't hit enter, instead click the search bar's dropdown result.

## Examples

- [Completed example contract](https://gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9)
