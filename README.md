# Github Pages
See this repository hosted [here](https://willemhscott.github.io/csci-4240/) on Github Pages
# Google Document Link
See the below report [here](https://docs.google.com/document/d/1PD7HbthCdC2bi1N8swPWhJiwxt2HkpWaa7b_HMMTkE4/edit?usp=sharing) on Google Docs

# Overview
My goal for this project has been to have a complete understanding of what is necessary to implement secure peer to peer messaging on the blockchain, especially with the goal of preventing censorship. This comes with a couple main components. First is understanding the components of contracts, especially where data lives and how it can be written and read. Second is understanding the nature of the stored data as is relevant to sending and receiving messages, especially ‘secure’ messages. Third is understanding the technical requirements for keeping a message ‘uncensorable’.

# Components of Contracts
Reading and writing data to the blockchain is trivially done with smart contracts, which can specify where data is stored, whether temporarily in memory or permanently in storage, the latter being more expensive. A contract can be deployed by anyone, in which case it will have its own independent ‘database’ associated with it. This means that the same contract cannot share data with another instance, and that redeploying the contract or updating it means that memory cannot be shared. Users can then interact with the contract, often for a fee, to invoke some functionality that is part of the contract.
# Storage of Data
While individual messages can be fairly small, storing data on the blockchain can be expensive. Text content can easily add up, especially if the messaging app were to truly facilitate full conversations, rather than singleton messages. As a result, the time it takes for a message to be ‘delivered’ may depend on how much the sender is willing to pay to get their message written.

A message is little more than some content, a verified sender, and the person they wish to address it to. It is easy for a contract to verify a sender and recipient, but how can trust be ‘transferred’? If for example we wish to update the messaging contract, there are a few options. We could either treat all the messages stored in the old contract as valid and reference all messages written to each version of the contract, or upon deployment of a new contract, fetch all previous messages and ‘upgrade’ them to include any new information associated with a message, or to make it compatible with any updates. We can create a sort of ‘chain’ of contracts that we trust to include the messages.

Alternatively, we could create a protocol that allows different messaging contracts to communicate without trust. The main difficulty is verifying that a contract is trying to write a message on behalf of the user who invoked the contract, and that the message is untampered with. In this case, it may be worth leveraging digital signatures to verify a message is untouched and from the sender. The messages could be written openly where any of the other contracts can read them and verify them. This allows for anyone to deploy a messaging contract and for any messaging contract to be compatible with any other following the protocol.

Each has its apparent pros and cons, and both of these approaches seem to be in some form of use between other messaging apps.
Security & Censorship
The approach described above, which would take advantage of digital signatures can easily be extended as well to support public key encryption. This would allow for both verifiable messages, as well as private messages between two addresses, by signing a message that is encrypted with the recipient’s public key. Furthermore, some messaging apps take advantage of some additional features to make only available during a specified timeframe. These apps take advantage of Time-Lock Encryption, a process by which something can only be decrypted after knowledge becomes available after a certain period of time, generally measured by the reliable pace of new blockchain blocks being created. I can’t say I can fully understand the mechanism behind this given my current technical level, but I’ve done my best to research the topic.

Writing information to the blockchain alone makes it resistant to censorship, since by nature it becomes a part of the distributed ledger, and cannot be removed without completely destroying the chain itself. Under the assumption that the blockchain cannot be destroyed, the message cannot also be censored.
A Design for a Simple Implementation
A simple implementation would include a few trivial parts.
A contract to write data to the blockchain
A client which interacts with the contracts
The ability in the client to specify which contracts to read messages from
The ability in the client to listen for messages being posted

The first contract task itself simply needs to be able to write a message, and may include the sender’s and recipient’s addresses for ease of finding matching messages without attempting to decrypt, as well as optionally verifying that the message is signed by the sender, though that can just as well be done on the client.

My basic implementation includes the remaining tasks, the contracts being hard coded in the source, listing previous contracts that were used during testing, and fetching the messages from all the available contracts. Messages are filtered by whether the user is a party to the message, and receives new messages live.
# Potential Improvements
The current implementation doesn’t provide public key encryption or message signing. This would be a core feature of a real implementation. This implementation is also rather slow and expensive. The main potential improvement beyond the encryption factor, would be changes to reduce gas usage. As was recommended in my proposal feedback, message compression would offer a measurable improvement, especially with something like zlib compression. Layer-2 protocols could offer an added optimization. In a higher scale implementation, zero-knowledge rollups might offer some optimizations for large amounts of messages with a little more time between sending and receipt. For a more sparsely used messaging platform, a state channel might help make for cheaper and quicker messaging between two users, only writing the conversation history to the chain after a fixed amount of time or number of messages, submitting them in batches, though this approach might sacrifice some amount of resilience and censorship resistance by depending on the additional state channel.
# Conclusions
I’m happy with the progress I was able to make learning about not only writing a simple contract, but additionally integration with Metamask and the ability to interact with the wallet and contracts through the browser. I would like to attempt a further iteration in the future containing some of the additional security functionality, since that is likely the most important feature followed by gas costs. I’m happy with the research I was able to do, even though I didn’t quite hit all of the implementation goals.



