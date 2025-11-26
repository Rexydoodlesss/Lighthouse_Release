<script>
    import { onMount } from "svelte";
    let spreadsheetID = ''; 
    let sidebarOpen = false;
    let sheetData = []; 
    let teamStats = []; 

    onMount(() => {
        spreadsheetID = localStorage.getItem('spreadsheetID');
        sheetData = JSON.parse(localStorage.getItem('sheetData')) || []; 
        document.addEventListener('click', handleClickOutside);
    });

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    async function reloadData() {
        try {
            if (!spreadsheetID) {
                alert('Spreadsheet ID is missing. Please log in again.');
                return;
            }

            const response = await fetch(`/api/fetchMatchData?spreadsheetID=${spreadsheetID}`);
            const result = await response.json();

            if (result.data) {
                const sheetDat = result.data; 
                sheetData = sheetDat;
                localStorage.setItem('sheetData', JSON.stringify(sheetDat));
                calculateTeamStats()
                location.reload(); 
            } else {
                console.error('Error fetching data:', result.error);
                alert('Failed to fetch data from Google Sheets.');
            }
        } catch (error) {
            console.error('Error fetching data from API:', error);
            alert('An error occurred while fetching data.');
        }
    }

    function calculateTeamStats() {
        const teamData = {}; 
        for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const team = row[2]; 
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
    
    import { onDestroy } from "svelte";

    function handleClickOutside(event) {
        const sidebar = document.querySelector('.sidebar');
        const menuButton = document.querySelector('.menu-button');
        if (sidebar && !sidebar.contains(event.target) && menuButton && !menuButton.contains(event.target)) {
            sidebarOpen = false;
        }
    }


    onDestroy(() => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            document.removeEventListener('click', handleClickOutside);
        }
    });
</script>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #1e293b;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 1rem;
        margin: 1rem;
        margin-top: 1rem;
    }

    .menu-button,
    .reload-button {
        background: none;
        border: none;
        color: white;
        font-size: 4rem;
        cursor: pointer;
    }

    .menu-button:hover,
    .reload-button:hover {
        color: #38bdf8;
    }

    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 250px;
        background-color: #1e293b;
        color: white;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
    }

    .sidebar.open {
        transform: translateX(0);
    }

    .sidebar ul {
        list-style: none;
        padding: 1rem;
    }

    .sidebar ul li {
        margin: 1rem 0;
        font-size: 1.5rem
    }
</style>

<header>
    <button class="menu-button" on:click={toggleSidebar}>☰</button>
    <h1>Lighthouse</h1>
    <button class="reload-button" on:click={reloadData}>⟳</button>
</header>



<div class="sidebar {sidebarOpen ? 'open' : ''}">
    <h1 style="font-size: 2rem; margin: 1rem; margin-top: 4rem;">Menu</h1>
    <ul>
        <li style="cursor: {typeof window !== 'undefined' && window.location.pathname === '/pageWithStats' ? 'default' : 'pointer'}; display: flex; align-items: center; color: {typeof window !== 'undefined' && window.location.pathname === '/pageWithStats' ? 'grey' : 'white'};" on:click={() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/pageWithStats') window.location.href = "/pageWithStats";
        }}>
            <span style="margin-right: 0.5rem;">🏆</span> Ranking
        </li>
        <li style="cursor: {typeof window !== 'undefined' && window.location.pathname === '/bars' ? 'default' : 'pointer'}; display: flex; align-items: center; color: {typeof window !== 'undefined' && window.location.pathname === '/bars' ? 'grey' : 'white'};" on:click={() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/bars') window.location.href = "/bars";
        }}>
            <span style="margin-right: 0.5rem;">📊</span> Bar Charts
        </li>
        <li style="cursor: {typeof window !== 'undefined' && window.location.pathname === '/teamView' ? 'default' : 'pointer'}; display: flex; align-items: center; color: {typeof window !== 'undefined' && window.location.pathname === '/teamView' ? 'grey' : 'white'};" on:click={() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/teamView') window.location.href = "/teamView";
        }}>
            <span style="margin-right: 0.5rem;">👥</span> Team Viewer
        </li>
        <li style="cursor: {typeof window !== 'undefined' && window.location.pathname === '/matchPlanner' ? 'default' : 'pointer'}; display: flex; align-items: center; color: {typeof window !== 'undefined' && window.location.pathname === '/matchPlanner' ? 'grey' : 'white'};" on:click={() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/matchPlanner') window.location.href = "/matchPlanner";
        }}>
            <span style="margin-right: 0.5rem;">📅</span> Match Planner
        </li>
        <li style="cursor: {typeof window !== 'undefined' && window.location.pathname === '/allianceSim' ? 'default' : 'pointer'}; display: flex; align-items: center; color: {typeof window !== 'undefined' && window.location.pathname === '/allianceSim' ? 'grey' : 'white'};" on:click={() => {
            if (typeof window !== 'undefined' && window.location.pathname !== '/allianceSim') window.location.href = "/allianceSim";
        }}>
            <span style="margin-right: 0.5rem;">🤝</span> Alliance Sim
        </li>
    </ul>
    <button style="margin: 1rem; padding: 0; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; margin-left: 1rem" on:click={toggleSidebar}>
        Close
    </button>
    <button style="margin: 1rem; padding: 0; background: none; border: none; color: crimson; font-size: 2rem; cursor: pointer; margin-left: 1rem" on:click={() => {
        localStorage.clear();
        window.location.href = "/";
    }}>
        Log Out
    </button>

</div>