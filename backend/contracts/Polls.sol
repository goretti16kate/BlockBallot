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

    //take note of those who have voted
    mapping(address => bool) public voter;
    // store candidates
    // Fetch candidates
    mapping(uint => Candidate) public candidates;
    // How many candidates are there.
    uint public totalCandidates;

    // Event Declaration
    event CandidateAdded(uint indexed candidateId, address indexed sender);
    event Voted(uint indexed candidateId);

    function addCandidate (string memory _name, string memory _position) private {
        totalCandidates ++;
        candidates[totalCandidates] = Candidate(totalCandidates, _name, _position, 0);
        emit CandidateAdded(totalCandidates, msg.sender);
    }

    function vote (uint _candidateId) public {
        // require that the voter has not voted before
        require(!voter[msg.sender], "Can't vote twice, If this is a mistake contanct us asap!!");
        //check if the candidate is valid
        require(_candidateId > 0 && _candidateId <= totalCandidates, "Ooops!!! That candidate isn't running for office");
        // record that they have voted
        voter[msg.sender] = true;
        // update candidate vote count
        candidates[_candidateId].voteCount ++;
        emit Voted(_candidateId);
    }


    
}