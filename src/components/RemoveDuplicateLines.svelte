<script>
  let input = '';
  let output = '';
  let trimEmpty = false;
  let sortMode = 'none'; // 'none', 'az', 'za'
  let copySuccess = false;

  function processText() {
    let lines = input.split('\n');

    // Optionally trim empty lines
    if (trimEmpty) {
      lines = lines.filter(line => line.trim().length > 0);
    }

    // Remove duplicate lines
    const seen = new Set();
    lines = lines.filter(line => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    });

    // Optionally sort
    if (sortMode === 'az') lines = [...lines].sort((a, b) => a.localeCompare(b));
    if (sortMode === 'za') lines = [...lines].sort((a, b) => b.localeCompare(a));

    output = lines.join('\n');
  }

  // Reactively process on changes
  $: processText();

  // --- Copy text to clipboard ---
  async function copyText() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      copySuccess = true;
      setTimeout(() => (copySuccess = false), 1500);
    } catch (e) {
      copySuccess = false;
    }
  }
  function clearAll() {
    input = '';
    output = '';
  }
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <label for="input-textarea" class="font-semibold text-gray-700 mb-2 block">Input Text:</label>
  <textarea
    id="input-textarea"
    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    rows="8"
    bind:value={input}
    placeholder="Paste your text here, one item per line..."
  ></textarea>

  <div class="flex flex-wrap gap-4 mb-4 items-center">
    <label class="inline-flex items-center gap-2">
      <input type="checkbox" bind:checked={trimEmpty} class="form-checkbox rounded text-blue-700" />
      <span class="text-gray-700 text-sm">Trim empty lines</span>
    </label>
    <label class="flex items-center gap-2">
      <span class="text-gray-700 text-sm">Sort:</span>
      <select bind:value={sortMode} class="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900">
        <option value="none">No Sort</option>
        <option value="az">A–Z</option>
        <option value="za">Z–A</option>
      </select>
    </label>
    <button
      type="button"
      class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100"
      on:click={processText}
    >
      Remove Duplicates
    </button>
  </div>

  <label for="output-textarea" class="font-semibold text-gray-700 mb-2 block">Output (No Duplicates):</label>
  <textarea
    id="output-textarea"
    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-gray-50 text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    rows="8"
    value={output}
    readonly
  ></textarea>
  <div class="flex gap-4">
    <button class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition"
      on:click={copyText}
      aria-label="Copy text"
      disabled={!output}
      type="button">
      {#if copySuccess}
        Copied!
      {:else}
        Copy
      {/if}
    </button>
    <button class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg transition"
      on:click={clearAll}
      type="button">
      Clear
    </button>
  </div>
</div>
