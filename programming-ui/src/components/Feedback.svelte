<script>
    import { onMount } from "svelte";
    import { defaultProgress, userUuid } from "../stores/stores.js";
    import { accessStore, assignmentStore } from "../stores/stores.js";
    import { scores, assignmentOrder } from "../stores/stores.js";

    const aStore = assignmentStore();
    const access_store = accessStore();

    let eventSource;
    let feedback = "";
    let data = {
        code: "",
        correct: false,
        grader_feedback: "",
        id: 0,
        last_updated: 0,
        programming_assignment_id: 0,
        status: "",
        user_uuid: "",
    };

    const statusUpdates = (event) => {
        data = JSON.parse(event.data);
        console.log(data.status);
        console.log(data);

        feedback = data.grader_feedback.replace(/\n/g, "<br>");
        if (data.status === "processed") {
            feedback_modal.showModal();
        }

        console.log($scores);
        if ($scores[$assignmentOrder - 1] !== 100 && data.correct === true) {
            console.log("new score!");
            aStore.addScore(100);
        }

        if (data.correct === true) {
            access_store.set(true);
        }
        if (data.status === "processed") {
            document.body.classList.add("grading-completed");
        }
    };

    onMount(() => {
        console.log($userUuid);
        eventSource = new EventSource(
            `http://localhost:7800/programming-api/grading/${$userUuid}`,
        );
        eventSource.onmessage = async (event) => {
            statusUpdates(event);
        };

        eventSource.onerror = (event) => {
            console.log(event);
        };

        return () => {
            if (eventSource.readyState === 1) {
                eventSource.close();
            }
        };
    });

    const closeEventStream = () => {
        eventSource.close();
    };
</script>

<div class="flex flex-row items-center">
    <div class="ml-5">
        {#if data.status === "pending"}
            <div class="flex flex-row items-center">
                <p class="ml-5">Grading...</p>
                <progress
                    class="progress progress-warning w-40 h-5 ml-5"
                    value="50"
                    max="100"
                ></progress>
            </div>
        {:else if data.correct === true}
            <div class="flex flex-row items-center">
                <p class="ml-5">Correct!</p>
                <progress
                    class="progress progress-success w-40 h-5 ml-5"
                    value="100"
                    max="100"
                ></progress>
            </div>
        {:else if data.correct === false && data.status === "processed"}
            <div class="flex flex-row items-center">
                <p class="ml-5">Incorrect</p>
                <progress
                    class="progress progress-error w-40 h-5 ml-5"
                    value="100"
                    max="100"
                ></progress>
            </div>
        {:else if $defaultProgress === true}
            <div class="flex flex-row items-center">
                <p class="ml-5">Progress</p>
                <progress
                    class="progress progress-warning w-40 h-5 ml-5"
                    value="0"
                    max="100"
                ></progress>
            </div>
        {:else}
            <div class="flex flex-row items-center">
                <p class="ml-5">Progress</p>
                <progress
                    class="progress progress-warning w-40 h-5 ml-5"
                    value="0"
                    max="100"
                ></progress>
            </div>
        {/if}
    </div>

    <div class="ml-5">
        <button class="btn" onclick="feedback_modal.showModal()">Result</button>
        <dialog id="feedback_modal" class="modal">
            <div class="modal-box max-w-5xl">
                <h3 class="font-bold text-lg">Submission feedback:</h3>
                <p class="py-4">{@html feedback}</p>
                <div class="modal-action">
                    <form method="dialog">
                        <button
                            class="btn btn-circle btn-ghost absolute right-2 top-2"
                            >✕</button
                        >
                    </form>
                </div>
            </div>
        </dialog>
    </div>
</div>
