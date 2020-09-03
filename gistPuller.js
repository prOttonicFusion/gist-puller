require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const shell = require("shelljs");

const targetDir = process.env.SAVE_DIR;

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

axios({
  method: "get",
  url: "https://api.github.com/gists",
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    "User-Agent": "gistPuller",
  },
})
  .then((res) => {
    if (res.status == 200) {
      const gists = res.data;

      fs.writeFile(
        `${targetDir}/my-gists.json`,
        JSON.stringify(gists, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );

      const gistList = [];

      gists.forEach((gist) => {
        const { id, git_pull_url, description } = gist;
        const gistIsPreviouslyCloned = fs.existsSync(`${targetDir}/${id}`);

        if (gistIsPreviouslyCloned) {
          pullGist(id);
        } else {
          cloneGist(git_pull_url);
        }
        gistList.push({ id, description });
      });

      fs.writeFile(
        `${targetDir}/gist-list.json`,
        JSON.stringify(gistList, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  })
  .catch((err) => {
    console.log("There was an error with pulling your gists...")
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log(err.message);
    }
    console.log(err.config);
  });
