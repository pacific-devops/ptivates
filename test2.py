import requests
import os

# Fetch GitHub token and org name from environment variables
TOKEN = os.getenv('GITHUB_TOKEN')
ORG_NAME = os.getenv('GITHUB_ORG_NAME')

# Check if TOKEN and ORG_NAME are provided
if not TOKEN or not ORG_NAME:
    print("Error: Please set the GITHUB_TOKEN and GITHUB_ORG_NAME environment variables.")
    exit(1)

headers = {'Authorization': f'token {TOKEN}'}

# Initialize variables for pagination
page = 1
per_page = 100  # Max limit for per_page is 100
all_repos = []

# Fetch all repos using pagination
while True:
    response = requests.get(f'https://api.github.com/orgs/{ORG_NAME}/repos', headers=headers, params={'page': page, 'per_page': per_page})
    
    if response.status_code != 200:
        print(f"Error: Failed to fetch repos. HTTP Status code: {response.status_code}")
        print(response.text)
        exit(1)

    repos = response.json()
    if not repos:
        break  # Exit the loop when no more repos are returned

    all_repos.extend(repos)
    page += 1  # Move to the next page

# Define the path for the output YAML file
output_file = 'repo_mapping.yml'

# Open the file in write mode and write the YAML structure
with open(output_file, 'w') as yaml_file:
    yaml_file.write("repo_mapping:\n")
    
    for repo in all_repos:
        # Write each repo's name and ID in the desired YAML format with anchors
        yaml_file.write(f"  {repo['name']}: &{repo['name']} {repo['id']}\n")

print(f"Repository mapping saved to {output_file}")
