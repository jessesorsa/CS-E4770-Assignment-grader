TODO: The RUNNING.md briefly outlines steps needed to run the application.

After downloading the source code:

Run 'npm install' in the main folder
Build the grader image by running 'docker build -t grader-image .' in the grader-image folder
Start the application by running 'docker compose -f docker-compose.prod.yml up' in the main folder
Navigate to localhost:7800 to see the application