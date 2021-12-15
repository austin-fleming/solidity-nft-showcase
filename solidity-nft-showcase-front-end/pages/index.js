import { useEffect, useState } from "react";
import S from "../styles/Home.module.css";

const TWITTER_HANDLE = "the_last_austin";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const Container = ({ children }) => (
  <div className={S.container}>{children}</div>
);

const Home = () => {
  const [hasWallet, setHasWallet] = useState(false);
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [maybeError, setMaybeError] = useState(null);

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
                onClick={null}
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
