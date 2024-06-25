import { serve } from "./deps.js";
import { cacheMethodCalls } from "./util/cacheUtil.js";
import EventEmitter from "https://deno.land/x/eventemitter@1.2.4/mod.ts";
import * as programmingAssignmentService from "./services/programmingAssignmentService.js";
import * as programmingGraderService from "./services/programmingGraderService.js";

const cachedAssignmentService = cacheMethodCalls(programmingAssignmentService, ["updateSubmission", "createSubmission"]);

const eventEmitter = new EventEmitter();
let currentStatus = "sse-connection";

const handleRoot = async (request, mappingResult) => {
  return new Response("Root");
};

const updateStatus = async (user_uuid, submission_id, code, status, grader_feedback, correct) => {
  // Getting previous status
  const oldStatus = await cachedAssignmentService.findSubmissionWithId(submission_id, user_uuid);

  await cachedAssignmentService.updateSubmission(submission_id, code, status, grader_feedback, correct);
  const newStatus = await cachedAssignmentService.findSubmissionWithId(submission_id, user_uuid);

  // Updating status and sending sse
  currentStatus = JSON.stringify(newStatus[0]);
  eventEmitter.emit(`status-${user_uuid}`, JSON.stringify(newStatus[0]));

};

// Handling sse
const sendSSE = async (request, mappingResult) => {
  const user_uuid = mappingResult.pathname.groups.user_uuid;
  const body = new ReadableStream({
    start(controller) {

      const sendUpdate = (status) => {
        const encodedStatus = new TextEncoder().encode(`data: ${status}\n\n`);
        controller.enqueue(encodedStatus);
      };

      const onStatus = (status) => {
        sendUpdate(status);
      };

      eventEmitter.on(`status-${user_uuid}`, onStatus);

      controller.close = () => {
        eventEmitter.removeListener(`status-${user_uuid}`, onStatus);
      };
    }
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "*",
    },
  });

};

const handleGrading = async (request, mappingResult) => {
  const user_uuid = mappingResult.pathname.groups.user_uuid;
  let grading_result;
  try {
    grading_result = await request.json();
  } catch (error) {
    return new Response("ERROR", { status: 400 });
  }

  // Updating status based on grading result
  let correct = false;
  if (grading_result.result[0] === '.') {
    correct = true;
  };
  await updateStatus(user_uuid, grading_result.submission_id, grading_result.code, 'processed', grading_result.result, correct);
  return new Response("OK");
};

const handleGetAssignment = async (request, mappingResult) => {

  // Determining which assingment
  const assignment_order = mappingResult.pathname.groups.id;
  try {
    const assignment = await cachedAssignmentService.findAssignment(assignment_order);
    return Response.json(assignment);
  } catch (error) {
    console.log("error");
  }
};

const handleSubmission = async (request, mappingResult) => {

  const assignment_order = mappingResult.pathname.groups.id;

  let submission;
  try {
    submission = await request.json();
  } catch (error) {
    return new Response("ERROR", { status: 400 });
  }

  // Getting the assignment and prevuous submission
  const assignment = await cachedAssignmentService.findAssignment(assignment_order);
  const previous_submission = await cachedAssignmentService.findSubmission(assignment[0].id, submission.user_uuid);
  console.log(previous_submission);


  if (!previous_submission[0]) {
    // Creating submission
    await cachedAssignmentService.createSubmission(assignment[0].id, submission.code, submission.user_uuid);
    const new_submission = await cachedAssignmentService.findSubmission(assignment[0].id, submission.user_uuid);

    // Sending new submission to grader
    const response = await programmingGraderService.submitToGrader(new_submission[0].id, new_submission[0].code, assignment[0].test_code, new_submission[0].user_uuid);

    // Updating submission status
    await updateStatus(new_submission[0].user_uuid, new_submission[0].id, new_submission[0].code, 'pending', '', false);


    // Returning a response to the client
    return new Response(JSON.stringify(response));
  } else {

    // Checking for duplicate submission
    console.log(submission.code, previous_submission[0].status);
    if ((previous_submission[0].code === submission.code) || previous_submission[0].status === 'pending') {

      const response = {
        data: "Duplicate submission",
      };
      return new Response(JSON.stringify(response));
    }

    else {
      // Sending submission to grader
      const response = await programmingGraderService.submitToGrader(previous_submission[0].id, submission.code, assignment[0].test_code, previous_submission[0].user_uuid);

      // Updating submission status

      await updateStatus(submission.user_uuid, previous_submission[0].id, submission.code, 'pending', '', false);

      // Returning a response to the client
      return new Response(JSON.stringify(response));

    };
  }

};

const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments/:id" }),
    fn: handleGetAssignment,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    fn: handleRoot,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/submissions/:id" }),
    fn: handleSubmission,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/grading/:user_uuid" }),
    fn: handleGrading,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/grading/:user_uuid" }),
    fn: sendSSE,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );
  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    return new Response(e.stack, { status: 500 });
  }
};


const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
