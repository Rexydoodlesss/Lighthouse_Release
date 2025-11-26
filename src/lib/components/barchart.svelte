<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    let chartInstance;
    let chartCanvas; 
    let selectedField; 
    let teamStats = [];

    onMount(() => {
        const storedTeamStats = localStorage.getItem("teamStats");
        if (storedTeamStats) {
            teamStats = JSON.parse(storedTeamStats);
        }

        if (chartCanvas) {
            drawChart();
        }
    });

    function drawChart() {
        if (!chartCanvas) {
            console.error("Canvas element is not ready.");
            return;
        }

        if (chartInstance) {
            chartInstance.destroy(); 
        }

        const sortedStats = [...teamStats].sort((a, b) => parseFloat(b[selectedField]) - parseFloat(a[selectedField]));

        const ctx = chartCanvas.getContext("2d"); 
        if (!ctx) {
            console.error("Failed to acquire canvas context.");
            return;
        }

        chartInstance = new Chart(ctx, {
            type: "bar", 
            data: {
                labels: sortedStats.map((d) => d.team), 
                datasets: [
                    {
                        label: selectedField,
                        data: sortedStats.map((d) => parseFloat(d[selectedField]) || 0), 
                        backgroundColor: "rgba(75, 0, 130, 0.8)", 
                        borderColor: "rgba(75, 0, 130, 1)", 
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: "top"
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                const team = context.label; 
                                const value = context.raw; 
                                const average = (
                                    teamStats.reduce((sum, d) => sum + parseFloat(d[selectedField] || 0), 0) /
                                    teamStats.length
                                ).toFixed(2); 
                                return `Team: ${team}, Average: ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Teams"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Value"
                        }
                    }
                }
            }
        });
    }

    $: if (chartCanvas) {
        selectedField = selectedField
            .replace("Average Coral", "averageCoral")
            .replace("Average Points", "averagePoints")
            .replace("Average Auto Points", "autoPoints")
            .replace("Average Tele Points", "telePoints")
            .replace("Average Endgame Points", "endgamePoints")
            .replace("Cycles", "cycles")
            .replace("Defense", "defense")
            .replace("Net", "net")
            .replace("Processor", "processor");
        drawChart();
    }
</script>

<style>
    .chart-container {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        background-color: white;
    }

    canvas {
        width: 100%; 
        height: 800px;
    }

    .dropdown {
        margin-bottom: 1rem;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
</style>

<center>
    <select class="dropdown" bind:value={selectedField}>
        <option value="totalCoralAverage">Average Coral</option>
        <option value="averagePoints">Average Points</option>
        <option value="autoAverage">Average Auto Points</option>
        <option value="teleAverage">Average Tele Points</option>
        <option value="endgameAverage">Average Endgame Points</option>
        <option value="cycles">Cycles</option>
        <option value="defense">Defense</option>
        <option value="net">Net</option>
        <option value="processor">Processor</option>
    </select>
</center>
<div class="chart-container">
    <canvas bind:this={chartCanvas}></canvas>
</div>