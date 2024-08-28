<script>
    import { score_sum } from "../stores/stores";
    import { onMount } from "svelte";

    onMount(() => {
        console.log("header");
    });
</script>

<div
    class="navbar flex flex-row items-center justify-center border-b border-grey bg-base-100"
>
    <div class="navbar-start ml-5">
        <h3 class="text-xl font-bold">ProGrammer</h3>
    </div>

    <div class="navbar-center">
        <h3 class="text-xl font-bold">Total score: {$score_sum}</h3>
    </div>
    <div class="navbar-end mr-5"></div>
</div>
