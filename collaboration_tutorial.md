# Collaboration Tutorial

This guide explains how to work with this repository when the project is already cloned and you already have collaborator access on GitHub.

## 1. Confirm the repository is cloned

Open a terminal inside the project folder and run:

```powershell
git status
```

If you see branch and file status information, the repo is already cloned correctly.

You can also confirm the current branch and remote:

```powershell
git branch --show-current
git remote -v
```

## 2. Check that the remote points to GitHub

The remote should usually be named `origin` and point to the repository URL.

Example:

```powershell
git remote -v
```

If the URL is wrong, fix it with:

```powershell
git remote set-url origin https://github.com/milen06/PilahNusa-AI.git
```

If you use SSH instead of HTTPS:

```powershell
git remote set-url origin git@github.com:milen06/PilahNusa-AI.git
```

## 3. Pull the latest changes first

Before editing, sync your local branch with the remote branch:

```powershell
git pull origin main
```

If the repository uses another branch, replace `main` with that branch name.

## 4. Make your changes

Edit the files you need, then check what changed:

```powershell
git status
git diff
```

## 5. Stage and commit your work

Add the files you changed:

```powershell
git add .
```

Or stage a single file:

```powershell
git add collaboration_tutorial.md
```

Create a commit with a clear message:

```powershell
git commit -m "Add collaboration tutorial"
```

## 6. Push to the repository

Push your commit to GitHub:

```powershell
git push origin main
```

If you are working on a feature branch, push that branch instead:

```powershell
git push origin my-feature-branch
```

## 7. If Git asks for authentication

If you cloned with HTTPS, GitHub may ask you to sign in.

Common options:

- GitHub sign-in through VS Code or Git Credential Manager
- A personal access token if password login is not accepted
- SSH keys if your remote uses SSH

If access is correct but push still fails, verify:

```powershell
git remote -v
git branch --show-current
```

Then confirm the GitHub account has collaborator access on the repository.

## 8. Recommended collaboration workflow

Use this flow to avoid conflicts:

1. Pull the latest code from `main`.
2. Create a feature branch for your work.
3. Make changes and commit locally.
4. Push the feature branch to GitHub.
5. Open a pull request for review.

Example:

```powershell
git checkout -b feature/my-update
git add .
git commit -m "Describe the change"
git push -u origin feature/my-update
```

## 9. If you already cloned the repo and only need to reconnect

Use this quick checklist:

```powershell
git status
git remote -v
git pull origin main
git add .
git commit -m "Your message"
git push origin main
```

## 10. Troubleshooting

- If push is rejected, another change may have landed on GitHub. Run `git pull origin main` and try again.
- If the remote URL is wrong, update it with `git remote set-url origin ...`.
- If authentication fails, sign in again or use the correct token/SSH key.
- If you get merge conflicts, resolve them, then run `git add .` and `git commit` again.

## Short version

If the repo is already cloned and you already have access, the basic flow is:

```powershell
git pull origin main
git add .
git commit -m "Your message"
git push origin main
```
