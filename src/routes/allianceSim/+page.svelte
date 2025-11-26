<script>
    import { onMount } from 'svelte';
    import Header from '$lib/components/header.svelte';
    let grid = Array.from({ length: 8 }, () => Array(3).fill(null));
    let rectangles = [];
    let draggedItem = null;
    let sheetData = [];
    let originalOrder = [];
    let eventKey = "";
    let offset = 0;
    let teamStats = [];
    
    $: minAverage = Math.min(...teamStats.map((t) => parseFloat(t.averagePoints) || 0));
    $: maxAverage = Math.max(...teamStats.map((t) => parseFloat(t.averagePoints) || 0));

    function getColorForTeam(team) {
        const teamInfo = teamStats.find((t) => t.team === team);
        if (!teamInfo) return '#cccccc';

        const score = parseFloat(teamInfo.averagePoints) || 0;
        const normalizedScore = (score - minAverage) / (maxAverage - minAverage);
        const isHighest = team === rectangles.reduce((highest, current) => {
            const currentTeamInfo = teamStats.find((t) => t.team === current);
            const highestTeamInfo = teamStats.find((t) => t.team === highest);
            const currentAverage = parseFloat(currentTeamInfo?.averagePoints) || 0;
            const highestAverage = parseFloat(highestTeamInfo?.averagePoints) || 0;
            return currentAverage > highestAverage ? current : highest;
        }, rectangles[0]);

        if (isHighest) {
            return 'black';
        }
        const red = Math.round(255 * (1 - normalizedScore));
        const green = Math.round(350 * normalizedScore);
        return `rgb(${red}, ${green}, 0)`;
    }

    onMount(() => {
        if (localStorage.getItem('sheetData')) {
            sheetData = JSON.parse(localStorage.getItem('sheetData'));
        }
        if (localStorage.getItem('teamStats')) {
            teamStats = JSON.parse(localStorage.getItem('teamStats'));
        }
        if (sheetData.length > 0 && sheetData[0].length > 1) {
            eventKey = "2025cc";
        }
        fetchRankings();
    });

    function handleDragStart(event, item) {
        draggedItem = item;
        event.dataTransfer.setData('text/plain', item);
    }

    $: rowTotals = grid.map((row) =>
    row.reduce((sum, team) => {
        if (team) {
            const teamInfo = teamStats.find((t) => t.team === team);
            return sum + (parseFloat(teamInfo?.averagePoints) || 0);
        }
        return sum;
    }, 0)
);

    function handleGridCellClick(rowIndex, colIndex) {
        const team = grid[rowIndex][colIndex];
        if (team) {
            grid[rowIndex][colIndex] = null;
            const originalIndex = originalOrder.indexOf(team);
            rectangles = [
                ...rectangles.slice(0, originalIndex),
                team,
                ...rectangles.slice(originalIndex),
            ];
        }
    }

    async function fetchRankings() {
        const url = `/api/rankings?eventKey=${eventKey}`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch rankings: ${response.statusText}`);
            }

            const data = await response.json();
            rectangles = data.rankings.map((ranking) => `${ranking.team_key.replace('frc', '')}`);
            originalOrder = [...rectangles];
        } catch (error) {
            console.error('Error fetching rankings:', error);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event, rowIndex, colIndex) {
        event.preventDefault();
        if (draggedItem !== null) {
            grid[rowIndex][colIndex] = draggedItem;
            rectangles = rectangles.filter((rect) => rect !== draggedItem);
            draggedItem = null;
            offset++;
        }
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(4, 50px);
        grid-template-rows: repeat(8, 50px);
        gap: 5px;
    }

    .grid-cell {
        width: 50px;
        height: 50px;
        border: 2px dashed #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        background-color: #f9f9f9;
    }

    .grid-cell.filled {
        border: 2px solid #4caf50;
        background-color: #e8f5e9;
    }

    .rectangles {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        justify-content: center;
        width: 50rem;
    }

    .rectangle {
        width: 3rem;
        height: 3rem;
        background-color: #2196f3;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        border-radius: 3px;
        cursor: grab;
    }

    .rectangle:active {
        cursor: grabbing;
    }
</style>
<div style="height: 100vh; margin: 0; padding: 0;">
<Header/>
<div class="container">
    <div class="grid">
        {#each grid as row, rowIndex}
            {#each row as cell, colIndex}
                <div
                    class="grid-cell {cell ? 'filled' : ''}"
                    on:dragover={handleDragOver}
                    on:drop={(event) => handleDrop(event, rowIndex, colIndex)}
                    on:click={() => handleGridCellClick(rowIndex, colIndex)}
                >
                    {cell}
                </div>
            {/each}
            <center>
                <div class="row-total">Total: {rowTotals[rowIndex]}</div>
        </center>
        {/each}
    </div>

    <div class="rectangles">
        {#each rectangles as rect}
            <div
                class="rectangle"
                draggable="true"
                on:dragstart={(event) => handleDragStart(event, rect)}
                style="background-color: {getColorForTeam(rect)}"
            >
                {rect}
            </div>
        {/each}
    </div>
</div>
</div>
