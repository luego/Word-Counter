<script>
  import { onMount } from 'svelte';
  import AppTextarea from './AppTextarea.svelte';
  
  let text = '';
  let wordFrequency = [];
  let copySuccess = false;
  let chartCanvas;
  let chart;

  function analyzeText(currentText) {
    console.log('analyzeText called, text:', currentText);
    if (!currentText.trim()) {
      wordFrequency = [];
      return;
    }

    // Clean and split text into words
    const words = currentText
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 0);

    // Count word frequency
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Convert to array and sort by frequency
    wordFrequency = Object.entries(frequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 words
  }

  // Analyze on text change
  $: console.log('text changed:', text);
  $: analyzeText(text);

  async function copyToClipboard() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      copySuccess = true;
      setTimeout(() => (copySuccess = false), 1500);
    } catch (error) {
      console.error('Failed to copy text:', error);
      copySuccess = false;
    }
  }

  function clearText() {
    text = '';
    wordFrequency = [];
  }

  // Chart.js integration
  onMount(async () => {
    // Dynamically import Chart.js
    const { Chart, registerables } = await import('chart.js/auto');
    Chart.register(...registerables);
    
    // Create chart when component mounts
    if (chartCanvas) {
      chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Word Frequency',
            data: [],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  });

  // Update chart when word frequency changes
  $: if (chart && wordFrequency.length > 0) {
    chart.data.labels = wordFrequency.slice(0, 10).map(item => item.word);
    chart.data.datasets[0].data = wordFrequency.slice(0, 10).map(item => item.count);
    chart.update();
  }
</script>

<div class="bg-white rounded-2xl shadow-lg p-6 mb-8 transition-colors">
  <div class="flex flex-wrap justify-end items-center mb-4 gap-2">
    <button
      type="button"
      class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-blue-100 disabled:opacity-50"
      on:click={copyToClipboard}
      aria-label="Copy text"
      disabled={!text}
    >
      {#if copySuccess}
        Copied!
      {:else}
        Copy
      {/if}
    </button>
    <button
      type="button"
      class="px-3 py-1 rounded-lg border text-sm font-semibold transition border-gray-300 bg-gray-100 text-gray-700 hover:bg-red-100 disabled:opacity-50"
      on:click={clearText}
      aria-label="Clear text"
      disabled={!text}
    >
      Clear
    </button>
  </div>

  <AppTextarea
    bind:value={text}
    placeholder="Paste or type your text here to analyze word frequency..."
    rows={8}
    ariaLabel="Text to analyze"
  />

  {#if wordFrequency.length > 0}
    <div class="mt-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Word Frequency Analysis</h3>
      
      <!-- Chart -->
      <div class="mb-6">
        <div class="h-64">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </div>

      <!-- Frequency Table -->
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-gray-700">Rank</th>
              <th class="px-4 py-2 text-left text-gray-700">Word</th>
              <th class="px-4 py-2 text-left text-gray-700">Count</th>
              <th class="px-4 py-2 text-left text-gray-700">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {#each wordFrequency as item, index}
              <tr class="border-t border-gray-200 hover:bg-gray-50">
                <td class="px-4 py-2 text-gray-900">{index + 1}</td>
                <td class="px-4 py-2 font-medium text-gray-900">{item.word}</td>
                <td class="px-4 py-2 text-blue-600 font-semibold">{item.count}</td>
                <td class="px-4 py-2 text-gray-600">
                  {Math.round((item.count / wordFrequency.reduce((sum, w) => sum + w.count, 0)) * 100)}%
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Summary Stats -->
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-blue-600">
            {wordFrequency.length}
          </div>
          <div class="text-gray-600">Unique Words</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-green-600">
            {wordFrequency.reduce((sum, w) => sum + w.count, 0)}
          </div>
          <div class="text-gray-600">Total Words</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-purple-600">
            {wordFrequency[0]?.word || '-'}
          </div>
          <div class="text-gray-600">Most Frequent</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-lg font-bold text-orange-600">
            {wordFrequency[0]?.count || 0}
          </div>
          <div class="text-gray-600">Max Count</div>
        </div>
      </div>
    </div>
  {/if}
</div> 