import requests
import os
import csv

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

# Specify the CSV output file path
csv_file_path = 'repo_mapping.csv'

# Open CSV file for writing
with open(csv_file_path, mode='w', newline='') as csv_file:
    fieldnames = ['Repository Name', 'Repository ID']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    # Write the header
    writer.writeheader()

    # Write each repo's name and ID
    for repo in all_repos:
        writer.writerow({'Repository Name': repo['name'], 'Repository ID': repo['id']})

print(f"Repository mapping saved to {csv_file_path}")
