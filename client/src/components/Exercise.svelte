<script>
  import { onMount } from "svelte";
  import { useUserState } from "../states/userState.svelte.js";
  const userState = useUserState();

  const { exerciseId } = $props();

  let answer = $state("");
  let exercise = $state({ title: `Exercise-${exerciseId}`, description: "" });
  let submissionId = $state(null);
  let gradingStatus = $state("");
  let grade = $state(null);
  let pollingInterval = null;

  const getExoInfo = async () => {
    const response = await fetch(`/api/exercises/${exerciseId}`);
    if (response.ok) {
      exercise = await response.json();
      console.log("Fetched exercise:", exercise);
    } else {
      console.error("Failed to fetch exercise, HTTP", response.status);
    }
  };

  const submitExercise = async () => {
    const response = await fetch(`/api/exercises/${exerciseId}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source_code: answer
      })
    });

    if (!response.ok) {
      console.error("Failed to submit exercise:", response.status);
      return;
    }
    const data = await response.json();
    submissionId = data.id;
    gradingStatus = "queued";

    startPolling();
  };

  const startPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval);

    pollingInterval = setInterval(async () => {
      const res = await fetch(`/api/submissions/${submissionId}/status`);
      if (!res.ok) return;

      const statusData = await res.json();
      gradingStatus = statusData.grading_status;
      grade = statusData.grade;

      if (gradingStatus === "graded") {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    }, 500);
  };

  $effect(() => {
    getExoInfo();
  });
</script>

<h1>{exercise.title}</h1>
<p>{exercise.description}</p>

{#if userState.loading}
  <p>Loading...</p>
{:else if !userState.email}
  <p>Login or register to complete exercises.</p>
{:else}

  <textarea bind:value={answer}></textarea>
  <button onclick={submitExercise}>Submit</button>

  {#if gradingStatus}
    <p>Grading status: {gradingStatus}</p>
  {/if}

  {#if grade !== null}
    <p>Grade: {grade}</p>
  {/if}
{/if}