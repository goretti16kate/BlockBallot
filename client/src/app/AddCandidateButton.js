import React, { useState } from 'react';

const AddCandidateButton = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');

  const handleButtonClick = () => {
    setIsFormVisible(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Perform any necessary actions with the candidate data (e.g., send to server)

    // Reset form state
    setCandidateName('');
    setCandidateEmail('');
    setIsFormVisible(false);
  };

  return (
    <div>
      {!isFormVisible ? (
        <button onClick={handleButtonClick}>Add Candidate</button>
      ) : (
        <form onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default AddCandidateButton;
