// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Polls {

    // model a candidate
    struct Candidate {
        uint id;
        string name;
        string position;
        uint voteCount;
    }
    Candidate[] public Allcandidates;
    //take note of those who have voted
    mapping(address => bool) public voter;
    // store candidates
    // Fetch candidates
    mapping(uint => Candidate) public candidates;
    // max number of candidtaes
    uint public maxNumberOfCandidates = 5;
    // How many candidates are there.
    uint public totalCandidates;
    // total voters
    uint public totalVoters;

    // Event Declaration
    event CandidateAdded(uint indexed candidateId, address indexed sender);
    event Voted(uint indexed candidateId);

    function addCandidate (string memory _name, string memory _position) public {
        require(totalCandidates <= maxNumberOfCandidates, "Max Number of candidates reached");
        totalCandidates ++;
        Allcandidates.push(Candidate(totalCandidates, _name, _position, 0));
        candidates[totalCandidates] = Candidate(totalCandidates, _name, _position, 0);
        emit CandidateAdded(totalCandidates, msg.sender);
    }
    function getTotalVoters() view external returns(uint){
        return totalVoters;
    }
    function getAllCandidates() view external returns(Candidate[] memory){
        return Allcandidates;
    }
    function vote (uint _candidateId) public {
        // Check if the candidate candidate is valid
        require(_candidateId > 0 && _candidateId <= totalCandidates, "Oops!!! That candidate isn't running for office");

        // Require that the voter has not voted before
        require(!voter[msg.sender], "Can't vote twice. If this is a mistake, contact us asap!");

        // Record that they have voted
        voter[msg.sender] = true;

        // Add Number of totalVoters
        totalVoters++;

        // Update candidate vote count
        candidates[_candidateId].voteCount++;
        Allcandidates[_candidateId].voteCount++;

        // Emit the Voted event
        emit Voted(_candidateId);
        }
}