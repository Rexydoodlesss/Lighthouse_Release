<script>
    import { onMount } from 'svelte';
    import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

    let chart;
    let chartCanvas;
    let selectedField = 'Coral'; 
    export let sheetData = [];
    export let selectedTeam = ''; 

    let chartData = {
        labels: [], 
        datasets: [
            {
                label: selectedField,
                data: [], 
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                tension: 0.4, 
            },
        ],
    };

    $: if (selectedField && chart) {
        calculateFieldData();
        chart.update();
    }

    $: if (selectedTeam && chart) {
        calculateFieldData();
        chart.update();
    }

    let chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Team Performance',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Match Key',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: selectedField,
                },
            },
        },
    };

    function calculateFieldData() {
        const teamData = sheetData
            .filter((row) => row[2] === selectedTeam) 
            .sort((a, b) => {
            const matchNumberA = parseInt(a[1].match(/qm(\d+)/)?.[1] || 0, 10);
            const matchNumberB = parseInt(b[1].match(/qm(\d+)/)?.[1] || 0, 10);
            return matchNumberA - matchNumberB;
            }); 
        chartData.labels = teamData.map((row) => row[1]); 

        chartData.datasets[0].data = teamData.map((row) => {
            switch (selectedField) {
                case 'Coral':
                    return (
                        (parseFloat(row[4]) || 0) +
                        (parseFloat(row[6]) || 0) +
                        (parseFloat(row[8]) || 0) +
                        (parseFloat(row[10]) || 0) +
                        (parseFloat(row[12]) || 0) +
                        (parseFloat(row[14]) || 0) +
                        (parseFloat(row[16]) || 0) +
                        (parseFloat(row[18]) || 0)
                    );
                case 'Points':
                    return (
                        2 * (parseFloat(row[3]) || 0) +
                        3 * (parseFloat(row[4]) || 0) +
                        4 * (parseFloat(row[6]) || 0) +
                        6 * (parseFloat(row[8]) || 0) +
                        7 * (parseFloat(row[10]) || 0) +
                        4 * (parseFloat(row[22]) || 0) +
                        2 * (parseFloat(row[24]) || 0) +
                        2 * (parseFloat(row[12]) || 0) +
                        3 * (parseFloat(row[14]) || 0) +
                        4 * (parseFloat(row[16]) || 0) +
                        5 * (parseFloat(row[18]) || 0) +
                        4 * (parseFloat(row[28]) || 0) +
                        2 * (parseFloat(row[30]) || 0) +
                        12 * (parseFloat(row[35]) || 0) +
                        6 * (parseFloat(row[37]) || 0) +
                        2 * (parseFloat(row[39]) || 0)
                    );
                case 'Climb':
                    return (
                        (parseFloat(row[35]) || 0) +
                        (parseFloat(row[37]) || 0)
                    );
                case 'Cycles':
                    return((parseFloat(row[4]) || 0) +  
                (parseFloat(row[6]) || 0) +  
                (parseFloat(row[8]) || 0) +  
                (parseFloat(row[10]) || 0) + 
                (parseFloat(row[12]) || 0) + 
                (parseFloat(row[14]) || 0) + 
                (parseFloat(row[16]) || 0) + 
                (parseFloat(row[18]) || 0) + 
                (parseFloat(row[22]) || 0) + 
                (parseFloat(row[24]) || 0) + 
                (parseFloat(row[28]) || 0) + 
                (parseFloat(row[30]) || 0));  
                case 'Defense':
                    return parseFloat(row[32]) || 0; 
                case 'Broke':
                    return parseFloat(row[33]) || 0; 
                default:
                    return 0;
            }
        });

        chartData.datasets[0].label = `${selectedField} for ${selectedTeam}`; 
        chartOptions.scales.y.title.text = selectedField; 
    }

    onMount(() => {
        const ctx = chartCanvas.getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });

        return () => {
            chart.destroy();
        };
    });

    $: if (chart) {
        calculateFieldData();
        chart.update();
    }
</script>

<style>
    .chart-container {
        width: 100%; 
        height: 15rem; 
        display: flex;
        justify-content: center; 
        align-items: center;
    }

    canvas {
        width: 100%; 
        height: 100%;
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
    <option value="Coral">Coral</option>
    <option value="Points">Points</option>
    <option value="Climb">Climb</option>
    <option value="Defense">Defense</option>
    <option value="Broke">Broke</option>
    <option value="Cycles">Cycles</option>
</select>
</center>   
<div class="chart-container">
    <canvas bind:this={chartCanvas}></canvas>
</div>