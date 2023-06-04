// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SoulboundTokens is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => uint256) private _creationTimestamps;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenTimestamp(tokenId, block.timestamp);
    }

    function burn(uint256 tokenId) public virtual {
        require(
            _msgSender() == ownerOf(tokenId) || _msgSender() == owner(),
            "SoulboundToken: Only contract or token owner can burn."
        );
        _burn(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        // We allow mints from contract owner (from == 0x0)
        // and we allow burns from contract owner (to == 0x0)
        require(from == address(0) || to == address(0), "SoulboundToken: Cannot transfer SoulboundToken.");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function tokenTimestamp(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "ERC721: invalid token ID");
        return _creationTimestamps[tokenId];
    }

    function _setTokenTimestamp(uint256 tokenId, uint256 timestamp) private {
        _creationTimestamps[tokenId] = timestamp;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
