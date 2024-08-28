TODO: There is a brief description of the application in REFLECTION.md that highlights the key design decisions for the application. The document also contains a reflection of possible improvements that should be done to improve the performance of the application.


Key design aspects of the application:

- DaisyUI was utilized in the frontend styling

- Programming-ui contains the handout component which is the main component seen on screen
- Handout component contains the feedback component where the status of grading is handled
- Status of grading sse are received in the feedback component 
- Header component has the total points shown
- assignmentService component is used to send http requests (submissions) to the backend
- important state variables like the total score, access rights, user_uuid are in saved in localStorage that is defined in stores

- Programming-api handles the submission and modifies the sql database
- Duplicate submissions are detected if identical submission is in the database or if submission status is pending
- Programming-api sends grading requests to the grading-api

- Grading-api receives grading requests and sorts them in a queue
- Submissions are graded one by one with processQueue function
- After grading, results are sent to the prgramming-api with http request
- Sse messages are sent to the UI from programming-api 
- Sse message is only sent to one correct user by using status-${user_uuid}

Improvements:
- Clean up the application code
- Make code clearer with controller.js files
- Removing unnecessary console.logs