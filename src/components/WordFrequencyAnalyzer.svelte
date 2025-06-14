<script>
  import { onMount } from 'svelte';
  let input = '';
  let frequencies = [];
  let chart;
  let chartCanvas;
  let ChartModule = null;

  // Helper: clean and split text
  function getWords(text) {
    return text
      .replace(/[^ -\x7F\w\s'-]/g, '')    // remove punctuation except hyphens/apostrophes
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  function analyze() {
    const words = getWords(input);
    const freqMap = {};
    for (const word of words) {
      freqMap[word] = (freqMap[word] || 0) + 1;
    }
    frequencies = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }

  // Only run analyze when input changes
  $: input, analyze();

  // Chart.js integration
  async function updateChart() {
    if (!chartCanvas) return;
    if (chart) chart.destroy();
    if (!frequencies.length) return;
    if (!ChartModule) {
      ChartModule = (await import('chart.js/auto')).default;
    }
    const labels = frequencies.map(f => f[0]);
    const data = frequencies.map(f => f[1]);
    chart = new ChartModule(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Frequency',
          data,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } }
        }
      }
    });
  }

  // Update chart only when frequencies change
  $: if (frequencies && chartCanvas) updateChart();

  onMount(() => {
    return () => { if (chart) chart.destroy(); };
  });

  function clearAll() {
    input = '';
    frequencies = [];
    if (chart) chart.destroy();
  }
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <label for="input-textarea" class="font-semibold text-gray-700 mb-2 block">Input Text:</label>
  <textarea
    id="input-textarea"
    class="w-full border border-gray-300 rounded-lg px-4 py-3 text-base bg-white text-gray-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    rows="8"
    bind:value={input}
    placeholder="Paste or type your text here..."
  ></textarea>
  <div class="flex gap-4 mb-4">
    <button class="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg transition hover:bg-blue-50"
      on:click={clearAll}
      type="button">
      Clear
    </button>
  </div>

  {#if frequencies.length}
    <h3 class="font-bold text-lg mb-2 text-blue-700">Top Words</h3>
    <div class="my-6">
      <canvas bind:this={chartCanvas} class="w-full max-w-xl mx-auto h-60"></canvas>
    </div>
    <div class="overflow-x-auto mb-6">
      <table class="min-w-full text-left border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-2 px-3 border-b border-gray-300">Word</th>
            <th class="py-2 px-3 border-b border-gray-300">Count</th>
          </tr>
        </thead>
        <tbody>
          {#each frequencies as [word, count]}
            <tr class="hover:bg-blue-50">
              <td class="py-2 px-3 border-b border-gray-300 font-mono">{word}</td>
              <td class="py-2 px-3 border-b border-gray-300">{count}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
