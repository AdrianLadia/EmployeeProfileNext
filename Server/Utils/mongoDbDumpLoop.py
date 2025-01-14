import subprocess
import os
import time
from datetime import datetime, timedelta
import getpass
import shutil

# MongoDB URI with placeholder for the password
mongo_uri = os.getenv('MONGO_URI_ACCOUNTING_READER')

# Directory where the script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Full path to the mongodump executable
mongodump_path = os.path.join(script_dir,
                              "mongodb-database-tools-windows-x86_64-100.10.0",
                              "bin", "mongodump.exe")  # Update this path


def run_backup():
    # Create a timestamp for the backup
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    # Path to save the dump with the timestamp
    output_path = os.path.join(script_dir, "backups", timestamp)

    # Ensure the output directory exists
    os.makedirs(output_path, exist_ok=True)

    # Command to run mongodump
    command = [mongodump_path, "--uri", mongo_uri, "--out", output_path]

    try:
        # Run the mongodump command
        subprocess.run(command, check=True)
        print(f"Backup completed successfully and saved to {output_path}")
    except subprocess.CalledProcessError as e:
        print(f"Error occurred during mongodump: {e}")


def delete_old_backups():
    backups_dir = os.path.join(script_dir, "backups")
    now = datetime.now()
    one_week_ago = now - timedelta(weeks=1)

    for backup in os.listdir(backups_dir):
        backup_path = os.path.join(backups_dir, backup)

        if os.path.isdir(backup_path):
            try:
                backup_time = datetime.strptime(backup, "%Y%m%d%H%M%S")
                if backup_time < one_week_ago:
                    shutil.rmtree(
                        backup_path
                    )  # Use shutil.rmtree to remove non-empty directories
                    print(f"Deleted old backup: {backup_path}")
            except Exception as e:
                print(e)
                print(f"Skipping non-backup directory: {backup_path}")


while True:
    try:
        run_backup()
        delete_old_backups()
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        for x in range(600):
            print(f"Next backup in {600 - x} seconds...", end="\r")
            time.sleep(1)
