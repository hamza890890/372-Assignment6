/**
 * Name: Hamza Ahmed
 * Date: 10.07.2025
 * CSC 372-01
 *
 * This is the script file for my assignment 6
*/
const defaultUser = "hamza890890";

const form = document.getElementById("search-form");
const repoList = document.getElementById("repo-list");
const displayUser = document.getElementById("display-user");

/**
 * This is to fetch the latest 20 repositories for a given user.
 * @param {string} username
 */
function getRepos(username) {
  const apiUrl =
    "https://api.github.com/users/" + username + "/repos?sort=updated&per_page=20";

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((repoData) => {
      console.log("Repos resolved: My Repo Data:", repoData);
      displayUser.textContent = username;
      showRepos(repoData, username);
    })
    .catch((error) => {
      console.error("Error:", error);
      repoList.textContent = "Could not load repositories. Please check the username.";
    });
}

/**
 * This is used to show each repository with details using createElement().
 * @param {Array} repos
 * @param {string} username
 */
function showRepos(repos, username) {
  repoList.innerHTML = "";

  if (repos.length === 0) {
    repoList.textContent = "No repositories found for this user.";
    return;
  }

  repos.forEach((repo) => {
    let repoDiv = document.createElement("div");
    repoDiv.className = "repo";

    // defining attributes here like name, description, date, etc    
    let name = document.createElement("h3");
    name.textContent = repo.name;
    repoDiv.appendChild(name);


    let desc = document.createElement("p");
    desc.textContent = repo.description ? repo.description : "No description provided.";
    repoDiv.appendChild(desc);


    let created = document.createElement("p");
    created.innerHTML = "<strong>Created:</strong> " + new Date(repo.created_at).toLocaleDateString();
    repoDiv.appendChild(created);


    let updated = document.createElement("p");
    updated.innerHTML = "<strong>Updated:</strong> " + new Date(repo.updated_at).toLocaleDateString();
    repoDiv.appendChild(updated);

    let watchers = document.createElement("p");
    watchers.innerHTML = "<strong>Watchers:</strong> " + repo.watchers_count;
    repoDiv.appendChild(watchers);

    let langP = document.createElement("p");
    langP.id = "languages-" + repo.name;
    langP.innerHTML = "<strong>Languages:</strong> loading...";
    repoDiv.appendChild(langP);

    let commitP = document.createElement("p");
    commitP.id = "commits-" + repo.name;
    commitP.innerHTML = "<strong>Commits:</strong> loading...";
    repoDiv.appendChild(commitP);

    // link it together
    let linkP = document.createElement("p");
    let link = document.createElement("a");
    link.href = repo.html_url;
    link.target = "_blank";
    link.textContent = "View on GitHub";
    linkP.appendChild(link);
    repoDiv.appendChild(linkP);

    // add to main container
    repoList.appendChild(repoDiv);

    // fetch extra details
    getLanguages(username, repo.name);
    getCommitCount(username, repo.name);
  });
}

/**
 * This is the second fetch because it gets the list of programming languages.
 * @param {string} username
 * @param {string} repoName
 */
function getLanguages(username, repoName) {
  const langUrl =
    "https://api.github.com/repos/" + username + "/" + repoName + "/languages";

  fetch(langUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching languages");
      }
      return response.json();
    })
    .then((data) => {
      const languages = Object.keys(data);
      const langText =
        languages.length > 0 ? languages.join(", ") : "No languages listed";
      document.getElementById("languages-" + repoName).innerHTML =
        "<strong>Languages:</strong> " + langText;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("languages-" + repoName).innerHTML =
        "<strong>Languages:</strong> N/A";
    });
}

/**
 * This is the the fetch estimated commit count (using the header link we defined above).
 * @param {string} username
 * @param {string} repoName
 */
function getCommitCount(username, repoName) {
  const commitUrl =
    "https://api.github.com/repos/" + username + "/" + repoName + "/commits?per_page=1";

  fetch(commitUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching commits");
      }
      const linkHeader = response.headers.get("Link");
      if (linkHeader && linkHeader.includes("page=")) {
        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
        if (match) {
          return match[1];
        }
      }
      return 1;
    })
    .then((count) => {
      document.getElementById("commits-" + repoName).innerHTML =
        "<strong>Commits:</strong> " + count;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("commits-" + repoName).innerHTML =
        "<strong>Commits:</strong> N/A";
    });
}


form.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  if (username) {
    getRepos(username);
  } else {
    repoList.textContent = "Please enter a GitHub username.";
  }
});


window.addEventListener("load", function () {
  getRepos(defaultUser);
  displayUser.textContent = defaultUser;
});
