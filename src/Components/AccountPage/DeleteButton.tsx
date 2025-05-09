// src/Components/AccountPage/DeleteButton.tsx
import React from 'react';
import styled from 'styled-components';

// 1. Define an interface for the button's props
interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean; // It's good practice to allow disabling buttons
}

// 2. Use React.FC<ButtonProps> to type the component
const DeleteButton: React.FC<ButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <StyledWrapper>
      <button onClick={onClick} disabled={disabled}>
        {/* Provide default children if none are passed */}
        {children || "Delete"}
      </button>
    </StyledWrapper>
  );
}

// Styled components definition
const StyledWrapper = styled.div`
  button {
    position: relative;
    display: inline-block;
    margin: 15px;
    padding: 15px 30px;
    text-align: center;
    font-size: 18px;
    letter-spacing: 1px;
    text-decoration: none;
    color: #DC3545; /* Red color for text */
    background: transparent;
    cursor: pointer;
    transition: ease-out 0.5s;
    border: 2px solid #DC3545; /* Red border */
    border-radius: 10px;
    box-shadow: inset 0 0 0 0 #DC3545; /* Red shadow for inset effect */
  }

  button:hover:not(:disabled) {
    color: white; /* White text on hover */
    box-shadow: inset 0 -100px 0 0 #DC3545; /* Red background fill on hover */
  }

  button:active:not(:disabled) {
    transform: scale(0.9);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    border-color: #E08A92; /* Lighter red for disabled state */
    color: #E08A92; /* Lighter red text for disabled state */
    /* Ensure disabled hover/active states don't override these */
    box-shadow: inset 0 0 0 0 #E08A92;
  }
`;

export default DeleteButton;