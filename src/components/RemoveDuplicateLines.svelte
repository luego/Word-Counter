<script>
  import AppTextarea from './AppTextarea.svelte';

  let input = '';
  let output = '';
  let trimEmpty = false;
  let sortMode = 'none'; // 'none', 'az', 'za'
  let copySuccess = false;
  let preserveCase = false; // Whether to preserve case when comparing
  let trimWhitespace = true; // Whether to trim whitespace from lines
  let processing = false;

  function processText() {
    if (!input.trim()) {
      output = '';
      return;
    }

    processing = true;
    
    try {
      let lines = input.split('\n');

      // Optionally trim whitespace from lines
      if (trimWhitespace) {
        lines = lines.map(line => line.trim());
      }

      // Optionally trim empty lines
      if (trimEmpty) {
        lines = lines.filter(line => line.length > 0);
      }

      // Remove duplicate lines
      const seen = new Set();
      lines = lines.filter(line => {
        const key = preserveCase ? line : line.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Optionally sort
      if (sortMode === 'az') {
        lines = [...lines].sort((a, b) => a.localeCompare(b));
      }
      if (sortMode === 'za') {
        lines = [...lines].sort((a, b) => b.localeCompare(a));
      }

      output = lines.join('\n');
    } catch (error) {
      console.error('Error processing text:', error);
      output = 'Error: Unable to process text';
    } finally {
      processing = false;
    }
  }

  // Reactively process on changes with debouncing
  let debounceTimer;
  $: {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(processText, 200);
  }

  // --- Copy text to clipboard ---
  async function copyText() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      copySuccess = true;
      setTimeout(() => (copySuccess = false), 1500);
    } catch (e) {
      console.error('Failed to copy text:', e);
      copySuccess = false;
    }
  }

  function clearAll() {
    input = '';
    output = '';
  }

  // Calculate statistics
  $: inputLines = input.split('\n').length;
  $: outputLines = output.split('\n').filter(line => line.trim().length > 0).length;
  $: duplicatesRemoved = inputLines - outputLines;
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <div class="mb-4">
    <label for="input-textarea" class="font-semibold text-gray-700 mb-2 block">Input Text:</label>
    <AppTextarea
      id="input-textarea"
      bind:value={input}
      placeholder="Paste your text here, one item per line..."
      rows={8}
      ariaLabel="Input Text"
    />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
    <div class="space-y-2">
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" bind:checked={trimEmpty} class="form-checkbox rounded text-blue-700" />
        <span class="text-gray-700 text-sm">Remove empty lines</span>
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" bind:checked={trimWhitespace} class="form-checkbox rounded text-blue-700" />
        <span class="text-gray-700 text-sm">Trim whitespace</span>
      </label>
      <label class="inline-flex items-center gap-2">
        <input type="checkbox" bind:checked={preserveCase} class="form-checkbox rounded text-blue-700" />
        <span class="text-gray-700 text-sm">Preserve case</span>
      </label>
    </div>
    
    <div class="flex items-center gap-2">
      <span class="text-gray-700 text-sm">Sort:</span>
      <select bind:value={sortMode} class="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900">
        <option value="none">No Sort</option>
        <option value="az">A–Z</option>
        <option value="za">Z–A</option>
      </select>
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
        on:click={processText}
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Process'}
      </button>
    </div>
  </div>

  <!-- Statistics -->
  {#if inputLines > 0}
    <div class="mb-4 grid grid-cols-3 gap-4 text-sm text-gray-600 border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div class="text-center">
        <span class="text-lg text-blue-700 font-bold block">{inputLines}</span>
        <span class="text-xs">Input Lines</span>
      </div>
      <div class="text-center">
        <span class="text-lg text-green-700 font-bold block">{outputLines}</span>
        <span class="text-xs">Output Lines</span>
      </div>
      <div class="text-center">
        <span class="text-lg text-red-700 font-bold block">{duplicatesRemoved}</span>
        <span class="text-xs">Duplicates Removed</span>
      </div>
    </div>
  {/if}

  <div class="mb-4">
    <label for="output-textarea" class="font-semibold text-gray-700 mb-2 block">Output (No Duplicates):</label>
    <AppTextarea
      id="output-textarea"
      value={output}
      placeholder="Output (No Duplicates)"
      rows={8}
      ariaLabel="Output (No Duplicates)"
      readonly={true}
    />
  </div>
  
  <div class="flex gap-4 justify-center">
    <button 
      class="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50"
      on:click={copyText}
      aria-label="Copy text"
      disabled={!output}
      type="button"
    >
      {#if copySuccess}
        Copied!
      {:else}
        Copy Result
      {/if}
    </button>
    <button 
      class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg transition hover:bg-gray-200"
      on:click={clearAll}
      type="button"
    >
      Clear All
    </button>
  </div>
</div>
