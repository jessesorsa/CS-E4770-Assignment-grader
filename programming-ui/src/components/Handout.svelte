<script>
    import * as assignmentService from "../http-actions/assignmentService.js";
    import { onMount } from "svelte";
    import {
        assignmentOrder,
        assignmentStore,
        accessStore,
        nextAccess,
        scores,
        userUuid,
    } from "../stores/stores.js";

    const aStore = assignmentStore();
    const access_store = accessStore();

    import Feedback from "./Feedback.svelte";

    let duplicateSubmission = false;
    let solution = "";
    let inputField;

    let assignment = {
        title: "",
        handout: "",
    };

    const removeWarning = () => {
        duplicateSubmission = false;
    };

    const submitAssignment = async (solution) => {
        console.log("submit");
        const res = await assignmentService.submitAssignment(
            solution,
            $assignmentOrder,
            $userUuid,
        );

        console.log(res);

        if (res.data === "Duplicate submission") {
            duplicateSubmission = true;
        } else {
            duplicateSubmission = false;
        }
    };

    const nextAssignment = async () => {
        console.log("next assignment");
        inputField.value = "";
        duplicateSubmission = false;
        aStore.increment();
        console.log($assignmentOrder);
        if ($scores[$assignmentOrder - 1] !== 100) {
            access_store.set(false);
        }
        access_store.setProgress(true);
        if ($assignmentOrder <= 3) {
            const fetchedAssignment =
                await assignmentService.getAssignment($assignmentOrder);
            assignment = fetchedAssignment[0];
        }
        document.body.classList.remove("grading-completed");
    };

    const lastAssignment = async () => {
        inputField.value = "";
        duplicateSubmission = false;
        aStore.decrease();
        access_store.setProgress(true);
        access_store.set(true);
        const fetchedAssignment =
            await assignmentService.getAssignment($assignmentOrder);
        assignment = fetchedAssignment[0];
    };

    onMount(async () => {
        // delete this in the final
        //aStore.set(1);
        //aStore.defaultScoreAndSum();

        console.log($assignmentOrder);
        const fetchedAssignment =
            await assignmentService.getAssignment($assignmentOrder);
        assignment = fetchedAssignment[0];

        document.body.classList.add("ready-for-testing");
        console.log("Added ready-for-testing class");
        document.body.classList.remove("grading-completed");
    });
</script>

<div class="min-h-screen w-full bg-base-200 flex justify-center">
    <div class="card w-full bg-base-100 shadow-xl ml-20 mr-20 mt-10 mb-32">
        <div class="card-body justify-start">
            {#if $assignmentOrder > 3}
                <h2 class="card-title">Completed all assignments!</h2>
            {:else}
                <div class="flex flex-row justify-between items-center">
                    <div class="justify-start">
                        <h2 class="card-title">
                            Assignment {$assignmentOrder}
                            {assignment.title}
                        </h2>
                        <p>
                            {assignment.handout}
                        </p>
                    </div>
                    {#if duplicateSubmission === true}
                        <div class="justify-center">
                            <button
                                class="btn btn-warning mr-5"
                                on:click={removeWarning}
                                >Duplicate submission!</button
                            >
                        </div>
                    {/if}
                    <div class="justify-end">
                        <Feedback />
                    </div>
                </div>
            {/if}
            <textarea
                class="textarea textarea-bordered h-full w-full my-5"
                id="code-editor"
                placeholder="Solution"
                bind:value={solution}
                bind:this={inputField}
            ></textarea>
            <div class="card-actions flex flex-row justify-between">
                <button class="btn mr-5" on:click={submitAssignment(solution)}
                    >Submit</button
                >
                <div class="flex flex-row">
                    {#if $assignmentOrder > 1}
                        <button
                            class="btn btn-primary ml-5 justify-end"
                            on:click={lastAssignment}>Previous</button
                        >
                    {/if}
                    {#if $nextAccess === true}
                        <button
                            class="btn btn-primary ml-5 justify-end"
                            on:click={nextAssignment}>Next</button
                        >
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
