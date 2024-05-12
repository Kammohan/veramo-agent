# Veramo Agent Project

This repository contains a Veramo agent designed to manage decentralized identities and verifiable credentials. This agent can be integrated into various applications to enable identity management and trust verification.

## Features

- **DID Management:** Create and manage decentralized identities using multiple DID methods.
- **Verifiable Credentials:** Issue and verify credentials in a secure and standardized way.
- **Interaction with Blockchain:** Interact with different blockchains for operations related to DIDs and credentials.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.x or later)
- Yarn or npm
- An understanding of TypeScript and decentralized identity concepts

## Installation

To install the dependencies for this Veramo agent, run the following command:

yarn install

or

npm install

## Usage
Here’s a quick example of how to start the agent and perform basic operations:

import { createAgent } from './agent-config'

const agent = createAgent()

// Example: Create a new DID
async function createDid() {
  const identity = await agent.didManagerCreate()
  console.log('New DID:', identity.did)
}

createDid()

PLEASE USE THIS DOCUMENTATION FOR AN UPDATED VERSION:
https://veramo.io/docs/node_tutorials/node_setup_identifiers

## Contributions
Contributions to this project are welcome! Please adhere to this project's code of conduct.

## License
Distributed under the MIT License.

## Contact
Kamalesh Mohaasundar - kammohan04@gmail.com
