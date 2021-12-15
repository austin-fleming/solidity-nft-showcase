// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // ERC721 is the NFT standard: https://eips.ethereum.org/EIPS/eip-721
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

// Inherit from contract to gain its methods
// https://solidity-by-example.org/inheritance/
contract NFTContract is ERC721URIStorage {
    using Counters for Counters.Counter; // helps keeping track of tokenIds
    Counters.Counter private _tokenIds;

    string svgStart =
        "<svg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg' xml:space='preserve' style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2'><style>.base{fill-opacity:.32;fill:";
    string svgBaseColorEnd =
        "}</style><path style='fill:none' d='M0 0h1000v1000H0z'/><path style='fill:#000' d='M0 0h1000v1000H0z'/><path class='base' d='M0 0h1000v1000H0z'/><path d='M1000 0H0v1000h1000V0ZM319.672 587.308c0-40.688 40.206-69.761 75.718-69.761s-16.172 16.284-16.172 77.382c0 30.116 6.04 74.465-18.016 74.465-24.055 0-41.53-41.399-41.53-82.086Zm246.926 21.347c32.754 0 77.835-15.236 77.835-33.717 0-18.481-19.887-49.999-53.473-49.999s-14.132 37.312-35.266 37.312-21.851 46.404 10.904 46.404Z' class='base'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' rotate='10' style='font-family:sans-serif;font-size:90px;fill:";
    string svgWordColorEnd = "'>";
    string svgEnd =
        "</text><path d='M1000 0H0v1000h1000V0ZM285.364 587.482c0-99.248 41.782-152.207 151.786-152.207s68.255 50.218 120.973 50.218c36.081 0 135.762-110.661 135.762 72.577 0 163.829-104.243 78.608-161.349 78.608-34.969 0-40.352-61.79-78.18-61.79-77.966 0-13.108 124.721-86.528 124.721s-82.464-76.309-82.464-112.127Z' class='base'/><path d='M1000 0H0v1000h1000V0ZM215.241 553.167c0-122.082 118.522-182.393 253.834-182.393s39.961 95.866 104.807 95.866c44.382 0 166.995-136.12 166.995 89.274 0 201.519-123.405 105.643-193.649 105.643s-49.367-66.535-95.898-66.535c-76.87 0 10.76 126.831-79.551 126.831s-156.538-46.605-156.538-168.686Z' class='base'/><path d='M1000 0H0v1000h1000V0ZM149.812 554.873c0-198.265 170.815-271.009 339.812-271.009 168.998 0 44.438 151.411 99.869 151.411 55.43 0 216.812-158.476 216.812 123.03 0 251.687-156.96 141.304-244.691 141.304-112.668 0-54.677-91.143-112.791-91.143-74.369 0 55.111 153.761-57.683 153.761s-241.328-54.88-241.328-207.354Z' class='base'/><path d='M1000 0H0v1000h1000V0ZM85.723 561.087c0-71.842-33.627-244.175 49.193-244.175 125.725 0 95.314-249.949 150.448-249.949 156.426 0 4.524 170.201 206.519 170.201 201.994 0 92.991 110.58 159.245 110.58 66.253 0 229.574-82.53 229.574 152.256 0 279.462-66.647 327.196-139.825 327.196-93.152 0-68.433-105.343-226.073-105.343-134.665 0-5.818 87.074-140.635 87.074-134.817 0-288.446-65.596-288.446-247.84Z' class='base'/><path d='M1000 0H0v1000h1000V0ZM45.736 567.442c0-71.842 6.36-250.53 89.18-250.53 125.725 0 79.065-281.641 134.199-281.641 156.427 0 96.535 113.231 298.529 113.231s59.988 143.493 126.241 143.493 276.568-58.507 276.568 176.279c0 399.319-134.103 473.587-207.282 473.587-93.152 0-57.655-114.665-215.295-114.665-134.666 0-70.687 107.015-205.504 107.015S45.736 749.686 45.736 567.442Z' class='base'/></svg>";

    string[] wordList = [
        "Milky",
        "Loose",
        "Ideal",
        "Verdant",
        "Point",
        "Wire",
        "Land",
        "Pump",
        "Purple",
        "Awesome",
        "Pantry",
        "Desert",
        "Orca",
        "Chin",
        "Wiggly",
        "Godly",
        "Power",
        "Slip",
        "Roasted",
        "Bucket"
    ];

    string[] wordColors = ["#5f10f5", "#93faa5", "#0b7fab", "#b7f4d8"];
    string[] baseColors = ["#e76d89", "#fe7968", "#f27935"];

    // Pass name of NFTs token and it's symbol
    constructor() ERC721("SquareNFT", "SQUARE") {
        console.log("NFT contract.");
    }

    // convert input to bytes, hash it, then cast to number
    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnNFT() public {
        // Get the current tokenId, starting at 0
        uint256 newItemId = _tokenIds.current();

        // ## BUILD SVG ##
        // Seed random with a stringified combination of an arbitrary word and the token ID, then squash into range.
        uint256 randWordIdx01 = random(
            string(abi.encodePacked("first", Strings.toString(newItemId)))
        ) % wordList.length;
        uint256 randWordIdx02 = random(
            string(abi.encodePacked("second", Strings.toString(newItemId)))
        ) % wordList.length;
        uint256 randWordIdx03 = random(
            string(abi.encodePacked("third", Strings.toString(newItemId)))
        ) % wordList.length;

        string memory assembledWord = string(
            abi.encodePacked(
                wordList[randWordIdx01],
                wordList[randWordIdx02],
                wordList[randWordIdx03]
            )
        );

        uint256 randWordColorIdx = random(
            string(abi.encodePacked("word_color", Strings.toString(newItemId)))
        ) % wordColors.length;
        uint256 randBaseColorIdx = random(
            string(abi.encodePacked("base_color", Strings.toString(newItemId)))
        ) % baseColors.length;

        string memory finalSvg = string(
            abi.encodePacked(
                svgStart,
                baseColors[randBaseColorIdx],
                svgBaseColorEnd,
                wordColors[randWordColorIdx],
                svgWordColorEnd,
                assembledWord,
                svgEnd
            )
        );

        string memory base64Svg = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(finalSvg))
            )
        );

        console.log("---");
        console.log(finalSvg);
        console.log("---");
        console.log(base64Svg);
        console.log("---");

        string
            memory nftDescription = "A squiggly background with a few select words. May not make a person rich, but sure is fun.";

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"#',
                        newItemId,
                        "_",
                        assembledWord,
                        '", "description":"',
                        nftDescription,
                        '", "image":"',
                        base64Svg,
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        console.log(
            "Final token URI for NFT #",
            newItemId,
            ": ",
            finalTokenUri
        );

        // Actually min NFT to sender
        // msg.sender is a safe method that prevents someone spoofing an address
        _safeMint(msg.sender, newItemId);

        // Set NFTs data
        // the second argument is a link to a JSON metadata file that follows the ERC721 standard.
        _setTokenURI(newItemId, finalTokenUri);

        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        // Increment counter for next NFT
        _tokenIds.increment();
    }
}
