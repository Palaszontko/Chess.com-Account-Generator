# Chess.com Account Generator + Free Game Analyze

## Overview

This is a simple tool for generating Chess.com accounts to help you analyze your games.

For the program to work you need the api key from the [2Captcha](https://2captcha.com).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [Notes](#notes)
- [Disclaimer](#disclaimer)
- [License](#license)

## Prerequisites

Before using the script, ensure you have the following prerequisites installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Make](https://www.gnu.org/software/make/)

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Palaszontko/Chess.com-Account-Generator
   cd chess_com_account_generator
   ```

2. Install project dependencies:
   ```
   npm install
   ```

## Environment configuration

1. Create the .env file using makefile:

   ```
   make create-env KEY=<2Captcha API Key>
   ```

## Usage

1. To run the script you need to use this command:
   ```
   npx ts-node src/index_new_version.ts
   ```
2. Input game link in specyfic format

## Notes

- Script was tested only on macOS
- Script stores screenshots of captcha in src/captcha_images
- Scipt stores data of generated accounts in src/users_data.csv

## Disclaimer
This script is for educational purposes only. The use of automated tools to create accounts on websites may violate the terms of service of those websites. Use at your own risk.

## License

    MIT
