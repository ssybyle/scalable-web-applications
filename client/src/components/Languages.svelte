<script>
  import { onMount } from "svelte";
  
  let languages = [];

  const getLanguages = async () => {
    const response = await fetch(`/api/languages`);
    if (response.ok) {
      languages = await response.json();
    } else {
      console.error("Failed to fetch languages, HTTP", response.status);
    }
  };

  onMount(() => {
    getLanguages();
  });
</script>

<h2>Select a language</h2>

<ul>
  {#each languages as lang}
    <li>
      <a href={`/languages/${lang.id}`}>{lang.name}</a>
    </li>
  {/each}
</ul>
