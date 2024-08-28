# Designing and Building Scalable Web Applications / Course Project I

The application consists of 3 different parts:

1. programming-ui
- Frontend that has submission, alert, feedback, and assignment navigation functionalities

2. programming-api
- Backend server that handles the assignment submissions
- Connects and handles a postgresql database
- Sends submissions to grading
- Communicates with frontend using sse and http

3. grading-api
- Two deployments of grading api which handles the grading process
- Submissions are handled in order from a submissions queue
- Sends grading results to the programming-api

The app also has playwright tests, k6 performance tests, and a redis cache functionality implemented

