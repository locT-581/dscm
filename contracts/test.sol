// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract test {
  string public message;

  constructor(string memory _message) {
      message = _message;
  }

  function updateMessage(string memory _newMessage) public {
      message = _newMessage;
  }
}
