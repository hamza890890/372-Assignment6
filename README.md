# 372-Assignment6

# GitHub Gallery

**Author:** Hamza Ahmed  
**Date:** October 7, 2025  
**Course:** CSC 372-01 — Web Development  

---

## Description
This project is a simple web page that displays the latest 20 public repositories for any GitHub user.  
It uses the **GitHub REST API** and the **Fetch API** in JavaScript to retrieve and show information about each repository.  

Each repository entry includes:
- Repository name  
- Description  
- Creation date  
- Last update date  
- Number of watchers  
- List of programming languages (via a second fetch)  
- Estimated number of commits  
- A direct link to the repository on GitHub  

A default username (`octocat`) loads when the page opens, and users can type a different GitHub username in the search box to view that person’s repositories.

---

## Technologies Used
- **HTML5**
- **CSS3**
- **JavaScript (Fetch API)**
- **Font Awesome** (for the GitHub icon)
- **GitHub REST API**

---

## This project uses the public GitHub API:
- https://api.github.com/users/hamza890890/repos
- **The GitHub API limits unauthenticated requests to 60 per hour.
If you exceed this limit, you may temporarily stop receiving responses until the hour resets.**

