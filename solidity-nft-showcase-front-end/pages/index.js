import { useEffect, useState } from "react";
import S from "../styles/Home.module.css";
import { ethers } from "ethers";
import NFTContract from "../utils/abi/NFTContract.json";

const CONTRACT_ADDRESS = "0xa492116fAcEA2a9Cb411C54A5cd98925862aED7e";

const TWITTER_HANDLE = "the_last_austin";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const Container = ({ children }) => (
  <div className={S.container}>{children}</div>
);

const createAskContractToMintNft = (setEtherscanLink) => async () => {
  console.log("🪙 Asking contract to mint...");

  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log(
        "...minting failed, could not find ethereum object in window. ❌"
      );
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum); // provider allows conversation with ether nodes
    const signer = provider.getSigner(); // signer is abstraction of an ethereum account. https://docs.ethers.io/v5/api/signer/#signers
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      NFTContract.abi,
      signer
    );

    console.log("   popping wallet to pay gas...");
    let nftTxn = await connectedContract.makeAnNFT();

    console.log("   mining...");
    await nftTxn.wait();

    console.log(
      `...mined & minted! See transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash} ✅`
    );

    setEtherscanLink(nftTxn.hash);
  } catch (err) {
    console.log(err);
    console.log("...minting failed from above error. ❌");
  }
};

const Home = () => {
  const [hasWallet, setHasWallet] = useState(false);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [maybeError, setMaybeError] = useState(null);
  const [etherscanLink, setEtherscanLink] = useState("");

  const askContractToMintNft = createAskContractToMintNft(setEtherscanLink);

  const checkIfWalletIsConnected = async () => {
    if (!window) return;

    const { ethereum } = window;

    console.log("👀 Checking for wallet...");
    if (!ethereum) {
      console.log("...wallet not found! ❌");
      setHasWallet(false);
      return;
    } else {
      console.log("...wallet found! ✅");
      setHasWallet(true);
    }

    console.log("👀 Checking for account...");
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      setAccount(accounts[0]);

      console.log(accounts[0]);
      console.log("...found account! ✅");
    } else {
      console.log("...account not found. ❌");
    }
  };

  const connectWallet = async () => {
    if (!hasWallet) return;

    console.log("💰 Connecting wallet...");

    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      console.log(account);

      console.log("...wallet connected! ✅");
    } catch (err) {
      setMaybeError(
        "Something went wrong connecting your wallet. Try refreshing."
      );

      console.error(err);
      console.log("...wallet failed to connect! ❌");
    }
  };

  useEffect(() => checkIfWalletIsConnected(), []);

  return (
    <>
      <header className={S.header}>
        <Container>
          <p>{"Austin's great NFTmart"}</p>
        </Container>
      </header>

      <main className={S.main}>
        <section className={S.hero}>
          <Container>
            <h1>
              NFTs <wbr />
              On-Demand
            </h1>
            <h2>Quick, Fresh, Yours</h2>
            <p>Get you something special with these one-of-kind NFTs.</p>
          </Container>
        </section>

        <section className={S.actions}>
          <Container>
            {account ? (
              <button
                className={[S.btn, S["btn--mint"]].join(" ")}
                onClick={askContractToMintNft}
              >
                Mint NFT
              </button>
            ) : (
              <>
                <button
                  className={
                    hasWallet
                      ? [S.btn, S["btn--connect"]].join(" ")
                      : [S.btn, S["btn--disabled"]].join(" ")
                  }
                  onClick={hasWallet ? connectWallet : null}
                >
                  Connect Wallet
                </button>
                {!hasWallet && (
                  <div
                    className={[S.messagebox, S["messagebox--warn"]].join(" ")}
                  >
                    Please install Metamask
                  </div>
                )}
              </>
            )}
          </Container>

          {etherscanLink && (
            <Container>
              <div
                className={[S.messagebox, S["messagebox--success"]].join(" ")}
              >
                Done! You can see your NFT on{" "}
                <a
                  href={`https://rinkeby.etherscan.io/tx/${etherscanLink}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  etherscan
                </a>{" "}
                or on{" "}
                <a
                  href={`https://testnets.opensea.io/${etherscanLink}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenSea
                </a>
                .
              </div>
            </Container>
          )}
        </section>
      </main>

      <footer className={S.footer}>
        <Container>
          <div>
            <img />
            <p>
              Built by{" "}
              <a
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
              >{`@${TWITTER_HANDLE}`}</a>
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Home;
