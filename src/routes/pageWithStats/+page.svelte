<script>
    import { onMount } from 'svelte';
    import Header from '$lib/components/header.svelte';
    let sortDirection = 'asc';
    let sortColumn = '';
    let sheetData = [];
    let teamStats = [];

    onMount(() => {
        const storedSheetData = localStorage.getItem('sheetData');
        if (storedSheetData) {
            sheetData = JSON.parse(storedSheetData);
            calculateTeamStats();
        } else {
            console.error('No sheet data found in localStorage.');
        }
    });

    function calculateTeamStats() {
        const teamData = {};

        for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const team = row[2];
            console.log(team);

            if (!team) continue;

            const autoPoints =
                2 * (parseFloat(row[3]) || 0) +
                3 * (parseFloat(row[4]) || 0) +
                4 * (parseFloat(row[6]) || 0) +
                6 * (parseFloat(row[8]) || 0) +
                7 * (parseFloat(row[10]) || 0) +
                4 * (parseFloat(row[22]) || 0) +
                2 * (parseFloat(row[24]) || 0);

            const telePoints =
                2 * (parseFloat(row[12]) || 0) +
                3 * (parseFloat(row[14]) || 0) +
                4 * (parseFloat(row[16]) || 0) +
                5 * (parseFloat(row[18]) || 0) +
                4 * (parseFloat(row[28]) || 0) +
                2 * (parseFloat(row[30]) || 0);

            const endgamePoints =
                12 * (parseFloat(row[35]) || 0) +
                6 * (parseFloat(row[37]) || 0) +
                2 * (parseFloat(row[39]) || 0);

            const autoCoral =
                (parseFloat(row[4]) || 0) +
                (parseFloat(row[6]) || 0) +
                (parseFloat(row[8]) || 0) +
                (parseFloat(row[10]) || 0);

            const teleCoral =
                (parseFloat(row[12]) || 0) +
                (parseFloat(row[14]) || 0) +
                (parseFloat(row[16]) || 0) +
                (parseFloat(row[18]) || 0);

            const net = (parseFloat(row[28]) || 0) + (parseFloat(row[22]) || 0);
            const processor = (parseFloat(row[24]) || 0) + (parseFloat(row[30]) || 0);

            const totalCoral = autoCoral + teleCoral;

            const cycles =
                (parseFloat(row[4]) || 0) +
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
                (parseFloat(row[30]) || 0);

            const defense = parseFloat(row[32]) || 0;

            if (!teamData[team]) {
                teamData[team] = {
                    totalPoints: 0,
                    autoPoints: 0,
                    telePoints: 0,
                    endgamePoints: 0,
                    autoCoral: 0,
                    teleCoral: 0,
                    totalCoral: 0,
                    cycles: 0,
                    defense: 0,
                    matchCount: 0,
                    net: 0,
                    processor: 0
                };
            }

            teamData[team].totalPoints += autoPoints + telePoints + endgamePoints;
            teamData[team].autoPoints += autoPoints;
            teamData[team].telePoints += telePoints;
            teamData[team].endgamePoints += endgamePoints;
            teamData[team].autoCoral += autoCoral;
            teamData[team].teleCoral += teleCoral;
            teamData[team].totalCoral += totalCoral;
            teamData[team].cycles += cycles;
            teamData[team].defense += defense;
            teamData[team].net += net;
            teamData[team].processor += processor;
            teamData[team].matchCount += 1;
        }

        teamStats = Object.entries(teamData).map(([team, data]) => ({
            team,
            averagePoints: (data.totalPoints / data.matchCount).toFixed(2),
            autoAverage: (data.autoPoints / data.matchCount).toFixed(2),
            teleAverage: (data.telePoints / data.matchCount).toFixed(2),
            endgameAverage: (data.endgamePoints / data.matchCount).toFixed(2),
            totalCoralAverage: (data.totalCoral / data.matchCount).toFixed(2),
            autoCoralAverage: (data.autoCoral / data.matchCount).toFixed(2),
            teleCoralAverage: (data.teleCoral / data.matchCount).toFixed(2),
            cycles: (data.cycles / data.matchCount).toFixed(2),
            defense: (data.defense / data.matchCount).toFixed(2),
            net: (data.net / data.matchCount).toFixed(2),
            processor: (data.processor / data.matchCount).toFixed(2)
        }));

        teamStats.sort((a, b) => b.averagePoints - a.averagePoints);
        localStorage.setItem('teamStats', JSON.stringify(teamStats));
    }

    function sortTable(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'desc';
        }

        const sortedStats = [...teamStats].sort((a, b) => {
            const valueA = parseFloat(a[column]) || a[column];
            const valueB = parseFloat(b[column]) || b[column];

            if (sortDirection === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        teamStats = sortedStats;
    }
</script>

<style>
    .nothing {
        z-index: 1;
        position: relative;
        margin: 0;
        padding: 0;
        background-color: none;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 1rem;
        text-align: left;
    }

    .data-table th,
    .data-table td {
        border: 1px solid #ddd;
        padding: 8px;
    }

    .data-table th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    .data-table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    .data-table tr:nth-child(odd) {
        background-color: #f9f9f9;
    }

    .data-table tr:hover {
        background-color: #f1f1f1;
    }
    
    .tablebg {
        max-height: 80vh;
        overflow-y: auto;
        margin: 1rem;
        margin-top: 0rem;
    }

    thead {
        position: sticky;
        top: 0;
        background-color: white;
    }

    tbody {
        position: relative;
        z-index: -2;
    }
</style>

<div class="nothing">
    <Header/>
</div>

<div class="tablebg">
    {#if teamStats.length > 0}
        <table class="data-table">
            <thead>
                <tr>
                    <th style="text-decoration: underline;" on:click={() => sortTable('team')}>Team</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('averagePoints')}>Total Average Points</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('autoAverage')}>Auto Average Points</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('teleAverage')}>Tele Average Points</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('endgameAverage')}>Endgame Average Points</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('totalCoralAverage')}>Total Coral Average</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('autoCoralAverage')}>Auto Coral Average</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('teleCoralAverage')}>Tele Coral Average</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('cycles')}>Average Cycles</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('defense')}>Defense Time</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('net')}>Net Average</th>
                    <th style="text-decoration: underline;" on:click={() => sortTable('processor')}>Processor Average</th>
                </tr>
            </thead>
            <tbody>
                {#each teamStats as { team, averagePoints, autoAverage, teleAverage, endgameAverage, totalCoralAverage, autoCoralAverage, teleCoralAverage, cycles, defense, net, processor}}
                    <tr>
                        <td>{team}</td>
                        <td>{averagePoints}</td>
                        <td>{autoAverage}</td>
                        <td>{teleAverage}</td>
                        <td>{endgameAverage}</td>
                        <td>{totalCoralAverage}</td>
                        <td>{autoCoralAverage}</td>
                        <td>{teleCoralAverage}</td>
                        <td>{cycles}</td>
                        <td>{defense}</td>
                        <td>{net}</td>
                        <td>{processor}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    {:else}
        <p>No data available. Please ensure you have logged in and fetched the data.</p>
    {/if}
</div>
