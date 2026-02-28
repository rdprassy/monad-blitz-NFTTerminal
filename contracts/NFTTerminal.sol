// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTTerminal is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public maxSupply;
    uint256 public mintPrice;
    uint256 public maxPerWallet;
    uint256 private _nextTokenId;

    string public baseTokenURI;

    bool public publicMintActive;
    bool public whitelistMintActive;

    bytes32 public merkleRoot;

    mapping(address => uint256) public mintedCount;

    event Minted(address indexed to, uint256 indexed tokenId, uint256 timestamp);
    event PublicMintToggled(bool active);
    event WhitelistMintToggled(bool active);
    event MerkleRootUpdated(bytes32 newRoot);
    event BaseURIUpdated(string newURI);
    event Withdrawn(address indexed to, uint256 amount);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _mintPrice,
        uint256 _maxPerWallet,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        maxPerWallet = _maxPerWallet;
        baseTokenURI = _baseTokenURI;
        _nextTokenId = 1;
    }

    modifier mintCompliance(uint256 _quantity) {
        require(_nextTokenId + _quantity - 1 <= maxSupply, "Exceeds max supply");
        require(mintedCount[msg.sender] + _quantity <= maxPerWallet, "Exceeds per-wallet limit");
        require(msg.value >= mintPrice * _quantity, "Insufficient payment");
        _;
    }

    function publicMint(uint256 _quantity) external payable mintCompliance(_quantity) {
        require(publicMintActive, "Public mint not active");
        _mintBatch(msg.sender, _quantity);
    }

    function whitelistMint(uint256 _quantity, bytes32[] calldata _proof)
        external
        payable
        mintCompliance(_quantity)
    {
        require(whitelistMintActive, "Whitelist mint not active");
        require(
            MerkleProof.verify(_proof, merkleRoot, keccak256(abi.encodePacked(msg.sender))),
            "Invalid Merkle proof"
        );
        _mintBatch(msg.sender, _quantity);
    }

    function _mintBatch(address _to, uint256 _quantity) internal {
        mintedCount[_to] += _quantity;
        for (uint256 i = 0; i < _quantity; i++) {
            uint256 tokenId = _nextTokenId;
            _nextTokenId++;
            _safeMint(_to, tokenId);
            emit Minted(_to, tokenId, block.timestamp);
        }
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
        emit MerkleRootUpdated(_merkleRoot);
    }

    function togglePublicMint() external onlyOwner {
        publicMintActive = !publicMintActive;
        emit PublicMintToggled(publicMintActive);
    }

    function toggleWhitelistMint() external onlyOwner {
        whitelistMintActive = !whitelistMintActive;
        emit WhitelistMintToggled(whitelistMintActive);
    }

    function setBaseURI(string memory _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
        emit BaseURIUpdated(_baseTokenURI);
    }

    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        emit Withdrawn(owner(), balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString(), ".json")) : "";
    }

    function tokensOfOwner(address _owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokens = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokens[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokens;
    }
}
