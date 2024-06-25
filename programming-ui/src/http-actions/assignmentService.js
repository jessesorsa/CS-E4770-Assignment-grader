const getAssignment = async (assignment_order) => {
    const id = assignment_order;
    console.log(id);
    const response = await fetch(`/programming-api/assignments/${id}`);
    return await response.json();
}

const submitAssignment = async (solution, assignment_order, user_uuid) => {
    const id = assignment_order;
    const submission = {
        code: solution,
        user_uuid: user_uuid
    }

    const response = await fetch(`/programming-api/submissions/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submission)
    })
    const res = response.json();
    return res;
}

export { getAssignment, submitAssignment }