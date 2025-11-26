<script>
    import { onMount } from "svelte";
    import Header from "$lib/components/header.svelte";
    let sheetData = [];
    let teamStats = [];
    let teams = [];
    let tems = [0, 0, 0, 0, 0, 0];

    onMount(() => {
        const storedData = localStorage.getItem("sheetData");
        teamStats = JSON.parse(localStorage.getItem("teamStats"));

        if (storedData) {
            sheetData = JSON.parse(storedData); 
            extractTeams(); 
        } else {
            console.error("No data found in localStorage.");
        }
    });

    function extractTeams() {
        const teamSet = new Set(); 
        for (let i = 1; i < sheetData.length; i++) {
            const team = sheetData[i][2]; 
            if (team) {
                teamSet.add(team);
            }
        }
        teams = Array.from(teamSet).sort((a, b) => a - b);
    }
</script>

<Header />
<h1>i got too lazy to finish this so heres a parrot instead</h1>
<marquee behavior="" direction=""><img src="parrot.gif" alt=""></marquee>


<style>
    .box {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .dropdown {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .dropdown:focus {
        outline: none;
        border-color: #4e54c8;
        box-shadow: 0 0 5px rgba(78, 84, 200, 0.5);
    }
</style>
