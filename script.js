/**
 * Name: Hamza Ahmed
 * Date: 10.07.2025
 * CSC 372-01
 *
 * This script fetches GitHub repositories for a user
 * and displays their details in a simple gallery layout.
 * Includes: name, description, dates, watchers, languages,
 * commits, and a link to the GitHub page.
 */

// Default GitHub username
const defaultUser = "hamza890890";

const form = document.getElementById("search-form");
const repoList = document.getElementById("repo-list");
const displayUser = document.getElementById("display-user");

/**
 * Fetch the latest 20 repositories for a given user.
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
      repoList.innerHTML =
        "<p>Could not load repositories. Please check the username.</p>";
    });
}

/**
 * Show each repository with details.
 * @param {Array} repos
 * @param {string} username
 */
function showRepos(repos, username) {
  repoList.innerHTML = "";

  if (repos.length === 0) {
    repoList.innerHTML = "<p>No repositories found for this user.</p>";
    return;
  }

  repos.forEach((repo) => {
    // Create repo card
    let repoDiv = document.createElement("div");
    repoDiv.className = "repo";

    // Fill in basic repo info
    repoDiv.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description ? repo.description : "No description provided."}</p>
      <p><strong>Created:</strong> ${new Date(repo.created_at).toLocaleDateString()}</p>
      <p><strong>Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
      <p><strong>Watchers:</strong> ${repo.watchers_count}</p>
      <p id="languages-${repo.name}"><strong>Languages:</strong> loading...</p>
      <p id="commits-${repo.name}"><strong>Commits:</strong> loading...</p>
      <p><a href="${repo.html_url}" target="_blank">View on GitHub</a></p>
    `;

    repoList.appendChild(repoDiv);

    // Fetch languages and commits for this repo
    getLanguages(username, repo.name);
    getCommitCount(username, repo.name);
  });
}

/**
 * Second fetch: gets the list of programming languages for a repository.
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
 * Fetch estimated commit count (by counting commits pages).
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
      return 1; // if no pagination, assume 1 commit
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

/* ---------- Form event ---------- */
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  if (username) {
    getRepos(username);
  } else {
    repoList.innerHTML = "<p>Please enter a GitHub username.</p>";
  }
});

/* ---------- Default load ---------- */
window.addEventListener("load", function () {
  getRepos(defaultUser);
  displayUser.textContent = defaultUser;
});
