import http from "k6/http";

export const options = {
    duration: "10s",
    vus: 10,
    summaryTrendStats: ["med", "p(99)"]
};

export default function () {

    const solution = `def hello():
        return "Hello"`

    const user_uuid = 1;

    const submission = {
        code: solution,
        user_uuid: user_uuid
    }

    http.post(`http://localhost:7800/programming-api/submissions/1`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submission)
    });

}
