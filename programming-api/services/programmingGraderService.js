const submitToGrader = async (submission_id, code, testCode, user_uuid) => {
    console.log("thsi is submission id");
    console.log(submission_id);
    const body = {
        submission_id: submission_id,
        code: code,
        testCode: testCode,
        user_uuid: user_uuid,
    }
    /*
    `/programming-api/submissions/${id}`
    http://localhost:7800/grader-api/
    'http://nginx:7800/grader-api/'
    */
    console.log("about to submit this:")
    console.log(body);
    const request = await fetch(`http://nginx:7800/grader-api/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    });
    const result = await request.json();
    return result;
};

export { submitToGrader };