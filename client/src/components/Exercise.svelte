<script>
  import { onMount } from "svelte";

  export let exerciseId;

  let answer = "";
  let characters = 0;
  let ifs = 0;
  let exercise = { title: "", description: "" };

  const getExoInfo = async () => {
    const response = await fetch(`/api/exercises/${exerciseId}`);
    if (response.ok) {
      exercise = await response.json();
      console.log("Fetched exercise:", exercise);
    } else {
      console.error("Failed to fetch exercise, HTTP", response.status);
    }
  };

  function updateTextarea() {
    characters = answer.length;
    ifs = (answer.match(/if/g) || []).length;
  }

  onMount(() => {
    getExoInfo();
  });
</script>

<h2>{exercise.title}</h2>
<p>{exercise.description}</p>

<textarea bind:value={answer}></textarea>
<button on:click={updateTextarea}>Submit</button>
<p>Characters: {characters}</p>
<p>ifs: {ifs}</p>
