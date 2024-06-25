import { sql } from "../database/database.js";

const findAll = async () => {
  return await sql`SELECT * FROM programming_assignments;`;
};

const findAssignment = async (assignment_order) => {
  return await sql`SELECT * FROM programming_assignments WHERE assignment_order = ${assignment_order};`;
};

const findSubmission = async (programming_assignment_id, user_uuid) => {
  return await sql`SELECT * FROM programming_assignment_submissions WHERE programming_assignment_id = ${programming_assignment_id} AND  user_uuid = ${user_uuid};`;
};

const findSubmissionWithId = async (id, user_uuid) => {
  return await sql`SELECT * FROM programming_assignment_submissions WHERE id = ${id} AND  user_uuid = ${user_uuid};`;
};

const updateSubmission = async (submission_id, code, status, grader_feedback, correct) => {

  return await sql`UPDATE programming_assignment_submissions
                   SET code = ${code},
                      status = ${status}, 
                      grader_feedback = ${grader_feedback}, 
                      correct = ${correct}, 
                      last_updated = CURRENT_TIMESTAMP
                   WHERE id = ${submission_id};`;

};

const createSubmission = async (programming_assignment_id, code, user_uuid) => {
  return await sql`INSERT INTO programming_assignment_submissions (programming_assignment_id, code, user_uuid, status, grader_feedback, correct, last_updated)
  VALUES
  (${programming_assignment_id}, ${code}, ${user_uuid}, 'pending', NULL, FALSE, CURRENT_TIMESTAMP);`;
};

export { findAll, findAssignment, createSubmission, findSubmission, findSubmissionWithId, updateSubmission };
