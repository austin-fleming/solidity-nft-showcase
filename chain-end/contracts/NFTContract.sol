// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // ERC721 is the NFT standard: https://eips.ethereum.org/EIPS/eip-721
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

// Inherit from contract to gain its methods
// https://solidity-by-example.org/inheritance/
contract NFTContract is ERC721URIStorage {
    using Counters for Counters.Counter; // helps keeping track of tokenIds
    Counters.Counter private _tokenIds;

    // Pass name of NFTs token and it's symbol
    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("NFT contract.");
    }

    function makeAnNFT() public {
        // Get the current tokenId, starting at 0
        uint256 newItemId = _tokenIds.current();

        // Actually min NFT to sender
        // msg.sender is a safe method that prevents someone spoofing an address
        _safeMint(msg.sender, newItemId);

        // Set NFTs data
        // the second argument is a link to a JSON metadata file that follows the ERC721 standard.
        _setTokenURI(newItemId, "https://jsonkeeper.com/b/9GRB");

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        // Increment counter for next NFT
        _tokenIds.increment();
    }
}
