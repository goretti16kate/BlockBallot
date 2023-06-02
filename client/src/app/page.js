"use client";

import Image from "next/image";
import Head from "next/head";
import Web3Modal from "web3modal";
// import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Web3 from "web3";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../../constants";

//Access our wallet inside our dapp
const web3 = new Web3(Web3.givenProvider);
//contract ABI
// const contractABI = require("../../../backend/artifacts/contracts/Polls.sol/Polls.json");
//contract Address
// const contractAddress = "0x0Af982E9692229d730E0d414Ba1CD44FA8E7FC5D";
const pollContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export default function Home() {
  //keep track whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  //keep track of whether the user is in the right chain
  const [correctNetwork, setCorrectNetwork] = useState(false);
  // name of the candidate to be added
  const [name, setName] = useState("");
  // position of the candidate
  const [position, setPosition] = useState("");
  const [candidates, setCandidates] = useState([]);
  // keeps track of whether the user has voted or not

  const [voted, setVoted] = useState(false);
  //when waiting for a transaction is getting mined
  const [loading, setLoading] = useState(false);
  // keep track of how many voters have voted
  const [numberOfVoters, setNumberOfVoters] = useState(0);

  const web3ModalRef = useRef();

  // To Connect using MetaMask
  async function connect() {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(window.ethereum);
      const account = web3.eth.accounts; //Get the current MetaMask selected/active wallet
      const walletAddress = account.givenProvider.selectedAddress;
      console.log(`Wallet: ${walletAddress}`);
      setWalletConnected(true);
      // console.log(totalVoters);
      let chainId = await web3.eth.getChainId();
      console.log(chainId);
      // await totalVoters();
      const sepoliaChainId = 11155111;

      if (chainId !== sepoliaChainId) {
        alert("you are not connected to sepolia testnet");
        return;
      } else {
        setCorrectNetwork(true);
      }
    } else {
      console.log("No Wallet");
    }
  }

  // To get the Number of voters
  const totalVoters = async () => {
    try {
      await pollContract.methods
        .getTotalVoters()
        .call()
        .then((totalNoVoters) => {
          console.log("Total Voters:", totalNoVoters);
          setNumberOfVoters(totalNoVoters);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //Getting All Candidates
  async function getAllCandidates() {
    try {
      let allCandidates = await pollContract.methods.getAllCandidates().call();
      setCandidates(allCandidates);
    } catch (error) {
      console.log(error);
    }
  }

  // adding Candidate function
  async function addCandidate(name, position) {
    // let candidate = {
    //   name,position,
    // };
    try {
      const account = web3.eth.accounts; //Get the current MetaMask selected/active wallet
      const walletAddress = account.givenProvider.selectedAddress;
      console.log(`The Wallet you have voted with: ${walletAddress}`);
      // Call the contract's vote function
      await pollContract.methods
        .addCandidate(name, position)
        .send({ from: walletAddress });
      getAllCandidates();
    } catch (error) {
      console.log(error);
    }
  }

  //Voting function
  async function vote(candidateId) {
    setLoading(true);
    try {
      const account = web3.eth.accounts; //Get the current MetaMask selected/active wallet
      const walletAddress = account.givenProvider.selectedAddress;
      console.log(`The Wallet you have voted with: ${walletAddress}`);
      // Call the contract's vote function
      const result = await pollContract.methods
        .vote(candidateId)
        .send({ from: walletAddress });

      //process the vote
      console.log("Vote result is: ", result);

      // Update the user's voting status
      setVoted(true);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
      totalVoters();
    }
  }
  useEffect(() => {
    connect();
    getAllCandidates();
    totalVoters();
    // renderButton();
  }, []);

  useEffect(() => {
    getAllCandidates();
  }, [candidates]);
  /*
        renderButton: Returns a button based on the state of the dapp
      */
  const renderButton = () => {
    // If we are currently waiting for something, return a loading button
    if (loading) {
      return (
        <div>
          <button className={styles.button}>Voting...</button>
        </div>
      );
    }
    // If tokens to be claimed are greater than 0, Return a claim button
    if (!candidates.length) {
      return (
        <div className={styles.form_container}>
          <div className={styles.thing}>
            <div className={styles.form_title}>
              <div className={styles.inputs}>
                <label className={styles.form_label}>Name</label>
                <input
                  className={styles.in}
                  label="Enter Candidate Name"
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label className={styles.form_label}>Position</label>
                <input
                  className={styles.in}
                  label="Enter Candidate Position"
                  size="small"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <button
                  className={styles.form_button}
                  onClick={() => addCandidate(name, position)}
                >
                  Add Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>blockBallot</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.header}>
        <section className={styles.wrapper}>
          <div className={styles.top}>BlockBallot</div>
          <div className={styles.bottom} aria-hidden="true">
            BlockBallot
          </div>
        </section>
        <nav className={styles.slidemenu}>
          <input
            type="radio"
            className={styles.slide_toggle}
            id="slide-item-1"
            name="slideItem"
            checked
          />
          <label for="slide-item-1">
            <p className={styles.icon}>✈</p>
            
            <span>Voting Arena</span>
          </label>

          <input
            type="radio"
            className={styles.slide_toggle}
            id="slide-item-2"
            name="slideItem"
          />
          <label for="slide-item-2">
            <p className={styles.icon}>✎</p>
            <span>About Developer</span>
          </label>

          <div className={styles.clear}></div>

          <div className={styles.slider}>
            <div className={styles.bar}></div>
          </div>
        </nav>
        <button className={styles.button_connect} onClick={connect}>
          Connect Wallet
        </button>
      </div>
      {/* End of Header */}

      {/* Beginning of main*/}
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Your vote your choice</h1>
          <p>Total number of voters So far: {numberOfVoters}</p>
        </div>
        <div className={styles.container}>
          {renderButton()}

          <div className={styles.container_inner}>
            {candidates.map((candidate) => (
              <div className={styles.gradient_cards} key={candidate.id}>
                {/* start candidate card */}
                <div className={styles.card} >
                  <div className={styles.container_card}>
                    <p className={styles.card_title}>{candidate.name}</p>
                    <p className={styles.card_description}>
                      {candidate.position}
                    </p>
                    <p className={styles.card_description}>
                      {candidate.voteCount}
                    </p>
                    <button
                      className={styles.button}
                      onClick={() => vote(candidate.id-1)}
                      disabled={voted}
                    >
                      Vote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* end candidate card */}
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by me_smiley_face
      </footer>
    </div>
  );
}
