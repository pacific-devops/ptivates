import os
import sys
import requests

# Timeout for network requests (in seconds)
REQUEST_TIMEOUT = 60

def upload_to_jfrog(parent_folder, jfrog_repo):
    """
    Upload files from the local system to a JFrog repository.
    If an error occurs or an upload is interrupted, it skips to the next file.
    Args:
        parent_folder (str): The path to the local folder containing files to upload.
        jfrog_repo (str): The name of the target JFrog repository.
    """
    
    # Get JFrog credentials from environment variables
    jfrog_url = os.getenv('JFROG_URL')
    jfrog_user = os.getenv('JFROG_USER')
    jfrog_api_key = os.getenv('JFROG_API_KEY')

    # Check if JFrog credentials are set
    if not jfrog_url or not jfrog_user or not jfrog_api_key:
        print("Error: Missing JFrog connection details in environment variables.")
        return

    # Loop through the files in the parent folder
    for root, _, files in os.walk(parent_folder):
        for file_name in files:
            full_path = os.path.join(root, file_name)
            relative_path = os.path.relpath(full_path, parent_folder)
            upload_url = f"{jfrog_url}/{jfrog_repo}/{relative_path}"

            # Get the local file size
            local_file_size = os.path.getsize(full_path)

            try:
                # Check if the file exists in JFrog and get its size
                response = requests.head(upload_url, auth=(jfrog_user, jfrog_api_key), timeout=REQUEST_TIMEOUT)
                if response.status_code == 200:
                    # Get file size from JFrog
                    jfrog_file_size = int(response.headers.get('Content-Length', 0))

                    # Skip if the file sizes match
                    if jfrog_file_size == local_file_size:
                        print(f"Skipping identical file: {relative_path} (size: {local_file_size} bytes)")
                        continue

                    # Log that re-upload will happen due to size difference
                    print(f"File exists but sizes differ. Re-uploading: {relative_path} (local: {local_file_size}, JFrog: {jfrog_file_size})")

                # Upload the file if it doesn't exist or sizes differ
                with open(full_path, 'rb') as file:
                    response = requests.put(upload_url, auth=(jfrog_user, jfrog_api_key), data=file, timeout=REQUEST_TIMEOUT)
                    if response.status_code == 201:
                        print(f"Uploaded: {relative_path}")
                    else:
                        print(f"Failed to upload {relative_path}: {response.status_code} {response.text}")

            except Exception as error:
                # Log the error and move to the next file
                print(f"Error uploading file {relative_path}: {error}")
                continue


def main():
    """
    Main function to handle command-line arguments and call the upload function.
    """
    if len(sys.argv) != 3:
        print("Usage: python upload_to_jfrog.py <parent_folder> <jfrog_repo>")
        sys.exit(1)

    parent_folder = sys.argv[1]
    jfrog_repo = sys.argv[2]

    # Call the function to upload files to JFrog
    upload_to_jfrog(parent_folder, jfrog_repo)

if __name__ == "__main__":
    main()
