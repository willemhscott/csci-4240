// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

    struct Message {
        address author;
        address recipient;
        string content;
    }

contract Messenger {
    Message[] private messages;

    function sendMessage(address recipient, string memory content) public {
        require(
            bytes(content).length < 1024,
            "Message must be less than 1024 bytes."
        );

        //Emit an event
        emit MessageSent(msg.sender, recipient, content);
        messages.push(Message(msg.sender, recipient, content));
    }

    function getMessages() public view returns (Message[] memory){
        return messages;
    }

    //Declare an Event
    event MessageSent(address indexed _from, address indexed _to, string content);
}