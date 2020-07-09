require("dotenv").config();
const request = require("request");
const fs = require("fs");
const shell = require("shelljs");

const targetDir = process.env.SAVE_DIR

if (!fs.existsSync(targetDir)) {
  console.log("Please set a valid directory as SAVE_DIR in .env");
  process.exit(1);
}

pullGist = (id) => {
  shell.exec(`git -C ${targetDir}/${id} pull`);
};

cloneGist = (pullUrl) => {
  shell.exec(`git -C ${targetDir} clone ${pullUrl}`);
};

const options = {
  url: "https://api.github.com/gists",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "gitPuller",
  },
};

request(options, (err, res, body) => {
  if (!err && res.statusCode == 200) {
    const gists = JSON.parse(body);

    fs.writeFile(`${targetDir}/my-gists.json`, JSON.stringify(gists, null, 2), "utf8", (err) => {
      if (err) {
        console.log(err);
      }
    });

    const gistList = []

    gists.forEach((gist) => {
      const { id, git_pull_url, description } = gist;
      const gistIsPreviouslyCloned = fs.existsSync(
        `${targetDir}/${id}`
      );

      if (gistIsPreviouslyCloned) {
        pullGist(id);
      } else {
        cloneGist(git_pull_url);
      }
      gistList.push({id, description})
    });

    fs.writeFile(`${targetDir}/gist-list.json`, JSON.stringify(gistList, null, 2), "utf8", (err) => {
        if (err) {
          console.log(err);
        }
      });

  } else {
    console.log(err);
  }
});
