<script>
  import { onMount } from "svelte";
  
  export let languageId;
  let exercises = [];

  const getExercises = async () => {
    const response = await fetch(`/api/languages/${languageId}/exercises`);
    if (response.ok) {
      exercises = await response.json();
    } else {
      console.error("Failed to fetch exercises, HTTP", response.status);
    }
  };

  onMount(() => {
    getExercises();
  });
</script>

<ul>
  {#each exercises as ex}
    <li>
      <a href={`/exercises/${ex.id}`}>{ex.title}</a>
    </li>
  {/each}
</ul>
