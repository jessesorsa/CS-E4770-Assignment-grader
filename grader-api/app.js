import { serve } from "./deps.js";
import { grade } from "./services/gradingService.js";
import * as queueService from "./services/queueService.js";

const SERVER_ID = crypto.randomUUID();

const processQueue = async () => {
  while (true) {
    let submission;
    if (submission = queueService.peekQueue()) {
      console.log("processing queue");
      console.log(submission.code);
      const dequeuedSubmission = queueService.deQueue();

      const result = await grade(dequeuedSubmission.code, dequeuedSubmission.testCode);
      console.log("this is the result");
      console.log(result);
      console.log("the submission_id");
      console.log(dequeuedSubmission.submission_id)
      const body = {
        submission_id: dequeuedSubmission.submission_id,
        result: result,
        code: submission.code,
      }

      await fetch(`http://programming-api:7777/grading/${dequeuedSubmission.user_uuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
};

const handleRequest = async (request) => {

  console.log(`Handling grading by: ${SERVER_ID}`);
  try {
    const requestData = await request.json();
    console.log(requestData);
    queueService.enQueue(requestData);
  } catch (e) {
    return new Response(JSON.stringify({ status: 'Error' }));
  }
  return new Response(JSON.stringify({ status: 'Enqueued' }));
};

processQueue();

const portConfig = { port: 7000, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
