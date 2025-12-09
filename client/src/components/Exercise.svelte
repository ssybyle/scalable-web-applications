<script>
  let answer = $state("");
  let characters = $state(0);
  let ifs = $state(0);

  function updateTextarea() {
    characters = answer.length;
    ifs = (answer.match(/if/g) || []).length;
  }
</script>

<textarea value={answer} oninput={(e) => answer = e.target.value}></textarea>
<button onclick={updateTextarea}>Submit</button>
<p>Characters: {characters}</p>
<p>ifs: {ifs}</p>