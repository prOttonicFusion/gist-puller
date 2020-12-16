# gist-puller

A quick and dirty tool for pulling all your [gists](https://gist.github.com/) from GitHub.

## Installation

Clone the repository using e.g.
```
git clone git@github.com:prottonicfusion/gist-puller.git
```
and install all required packes by running either ``npm i`` or ``yarn``. Make sure to copy or rename the file `.env.example` to `.env` and include a valid GitHub access token and storage location.

## Usage

The script is executed by running 
```
node gistPuller.js
```
This pulls any previously cloned gists and clones any new ones. Additionally, the gist IDs and descriptions are listed in `gist-list.json` for convenience.
