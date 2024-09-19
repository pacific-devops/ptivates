import requests
import os
import json

# Fetch GitHub token and org name from environment variables
TOKEN = os.getenv('GITHUB_TOKEN')
ORG_NAME = os.getenv('GITHUB_ORG_NAME')
REPO_NAME = os.getenv('GITHUB_REPO_NAME')  # Specific repository name

# Check if TOKEN, ORG_NAME, and REPO_NAME are provided
if not TOKEN or not ORG_NAME or not REPO_NAME:
    print("Error: Please set the GITHUB_TOKEN, GITHUB_ORG_NAME, and GITHUB_REPO_NAME environment variables.")
    exit(1)

headers = {'Authorization': f'token {TOKEN}'}

# Fetch a specific repository
response = requests.get(f'https://api.github.com/repos/{ORG_NAME}/{REPO_NAME}', headers=headers)

if response.status_code != 200:
    print(f"Error: Failed to fetch repo. HTTP Status code: {response.status_code}")
    print(response.text)
    exit(1)

# Print the JSON response for the specific repository
repo = response.json()
print(json.dumps(repo, indent=4))  # Pretty-print the entire JSON response for the repo
