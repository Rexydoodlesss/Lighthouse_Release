            <script>
                import { onMount } from "svelte";
                import Header from "$lib/components/header.svelte";
                import { browser } from "$app/environment";
                import Chart from "$lib/components/chart.svelte";
                let sheetData = [];
                let pitData = [];
                let teams = [];
                let teamStats = [];
                let selectedTeam = "";
                let canProcessor = false;
                let canClimb = false;
                let climbReliability = 0;
                let reliability = 0;
                let imgSrc = "sadparrot.gif";
                let name = "";
                let avgpoints = 0;
                let autoPoints = 0;
                let telePoints = 0;
                let avgcoral = 0;
                let maxcoral = 0;
                let cycles = 0;
                let avgpointsrank = 0;
                let autoPointsrank = 0;
                let telePointsrank = 0;
                let avgcoralrank = 0;
                let maxcoralrank = 0;
                let cyclesrank = 0;
                let totalTeams = 0;

                let dimensions = "";
                let weight = 0;
                let drivetrain = "";
                let notes = "";
                let canScore = "";
                let alignment = "";
                let processor = "";
                let camera = "";
                let arch = "";

                function checkPitData() {
                    if (pitData.length > 0) {
                        const teamRow = pitData.find(row => row[2] === selectedTeam);
                        if (teamRow) {
                            dimensions = teamRow[3] || "";
                            weight = teamRow[5] || 0;
                            drivetrain = teamRow[6] || "";
                            notes = teamRow[9] || "";
                            canScore = teamRow[10] || "";
                            alignment = teamRow[13] || "";
                            processor = teamRow[17] || "";
                            camera = teamRow[18] || "";
                            arch = teamRow[20] || "";
                        } else {
                            dimensions = weight = drivetrain = notes = canScore = alignment = processor = camera = "N/A";
                        }
                    } else {
                        dimensions = weight = drivetrain = notes = canScore = alignment = processor = camera = "N/A";
                    }
                }
                async function fetchTeamMedia(teamKey) {
                    const year = 2025;
                    const apiUrl = `https://www.thebluealliance.com/api/v3/team/${teamKey}/media/${year}`;
                    const apiKey = "wlltR8jyjHBcLG0tA7Zg6EEMRs6qLmBtYr9euIr9NzvyOr7PaLlpedreymRQA7dY";

                    try {
                        const response = await fetch(apiUrl, {
                            headers: {
                                "X-TBA-Auth-Key": apiKey,
                            },
                        });

                        if (!response.ok) {
                            throw new Error("Failed to fetch media data");
                        }

                        const data = await response.json();
                        console.log(data);

                        if (data.length > 1) {
                            imgSrc = data[1].view_url+".jpg";
                        } else {
                            imgSrc = 'sadparrot.gif';
                        }
                    } catch (error) {
                        console.error("Error fetching media data:", error);
                        imgSrc = 'sadparrot.gif';
                    }
                }
                async function fetchName(teamKey) {
                    const year = 2025;
                    const apiUrl = `https://www.thebluealliance.com/api/v3/team/${teamKey}`;
                    const apiKey = "wlltR8jyjHBcLG0tA7Zg6EEMRs6qLmBtYr9euIr9NzvyOr7PaLlpedreymRQA7dY";

                    try {
                        const response = await fetch(apiUrl, {
                            headers: {
                                "X-TBA-Auth-Key": apiKey,
                            },
                        });

                        if (!response.ok) {
                            throw new Error("Failed to fetch media data");
                        }

                        const data = await response.json();
                        console.log(data);

                        name = data.nickname;
                    } catch (error) {
                        console.error("Error fetching media data:", error);
                    }
                }
                onMount(() => {
                    const storedData = localStorage.getItem("sheetData");
                    teamStats = JSON.parse(localStorage.getItem("teamStats"));

                    if (storedData) {
                        sheetData = JSON.parse(storedData);
                        extractTeams();
                    } else {
                        console.error("No data found in localStorage.");
                    }
                    const storedPitData = localStorage.getItem('pitData');
                    if (storedPitData) {
                        pitData = JSON.parse(storedPitData);
                    } else {
                        console.error('No pit data found in localStorage.');
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
                    if (teams.length > 0) {
                        selectedTeam = teams[0];
                        checkProcessor();
                        totalTeams = teams.length;
                    }
                }

                function checkProcessor() {
                    canProcessor = sheetData.some(
                        (row) =>
                            row[2] === selectedTeam &&
                            (parseFloat(row[24]) > 0 || parseFloat(row[30]) > 0),
                    );
                }
                function checkClimb() {
                    canClimb = sheetData.some(
                        (row) =>
                            row[2] === selectedTeam &&
                            parseFloat(row[35]) > 0,
                    );
                    let totalSuccessfulClimbs = 0;
                    let totalClimbAttempts = 0;

                    sheetData.forEach((row) => {
                        if (row[2] === selectedTeam) {
                            totalSuccessfulClimbs += parseFloat(row[35]) || 0;
                            totalClimbAttempts +=
                                (parseFloat(row[35]) || 0) + (parseFloat(row[36]) || 0);
                        }
                    });

                    climbReliability =
                        totalClimbAttempts > 0
                            ? ((totalSuccessfulClimbs / totalClimbAttempts) * 100).toFixed(
                                2,
                            )
                            : 0;
                }

                function checkReliability() {
                    let totalMatches = 0;
                    let matchesNotBroken = 0;

                    for (const row of sheetData) {
                        if (row[2] === selectedTeam) {
                            totalMatches++;
                            matchesNotBroken += parseFloat(row[33]) || 0;
                        }
                    }

                    reliability =
                        100 -
                        (totalMatches > 0
                            ? ((matchesNotBroken / totalMatches) * 100).toFixed(2)
                            : 0);
                            reliability = reliability.toFixed(2);
                }
                function calculateAvgPoints() {
                    const teamStat = teamStats.find((stat) => stat.team === selectedTeam);
                    avgpoints = teamStat ? parseFloat(teamStat.averagePoints) : 0;
                }

                function calculateAutoPoints() {
                    const teamStat = teamStats.find((stat) => stat.team === selectedTeam);
                    autoPoints = teamStat ? parseFloat(teamStat.autoAverage) : 0;
                }

                function calculateTelePoints() {
                    const teamStat = teamStats.find((stat) => stat.team === selectedTeam);
                    telePoints = teamStat ? parseFloat(teamStat.teleAverage) : 0;
                }

                function calculateAvgCoral() {
                    const teamStat = teamStats.find((stat) => stat.team === selectedTeam);
                    avgcoral = teamStat ? parseFloat(teamStat.totalCoralAverage) : 0;
                }

                function calculateMaxCoral() {
                    const teamRows = sheetData.filter((row) => row[2] === selectedTeam);
                    maxcoral = teamRows.length > 0
                        ? Math.max(
                            ...teamRows.map(
                                (row) =>
                                    (parseFloat(row[4]) || 0) +
                                    (parseFloat(row[6]) || 0) +
                                    (parseFloat(row[8]) || 0) +
                                    (parseFloat(row[10]) || 0) +
                                    (parseFloat(row[12]) || 0) +
                                    (parseFloat(row[14]) || 0) +
                                    (parseFloat(row[16]) || 0) +
                                    (parseFloat(row[18]) || 0)
                            )
                        )
                        : 0;
                }

                function calculateCycles() {
                    const teamStat = teamStats.find((stat) => stat.team === selectedTeam);
                    cycles = teamStat ? parseFloat(teamStat.cycles) : 0;
                }

                $: if (selectedTeam) {
                    checkProcessor();
                    checkClimb();
                    checkReliability();
                    fetchTeamMedia(`frc${selectedTeam}`);
                    fetchName(`frc${selectedTeam}`);
                    calculateAvgPoints();
                    calculateAutoPoints();
                    calculateTelePoints();
                    calculateAvgCoral();
                    calculateMaxCoral();
                    calculateCycles();
                    calculateAvgPointsRank();
                    calculateAutoPointsRank();
                    calculateTelePointsRank();
                    calculateAvgCoralRank();
                    calculateMaxCoralRank();
                    calculateCyclesRank();
                    checkPitData();
                }
                function calculateAvgPointsRank() {
                    if (!teamStats || teamStats.length === 0) {
                        avgpointsrank = 0;
                        return;
                    }
                    const sortedTeams = [...teamStats].sort((a, b) => b.averagePoints - a.averagePoints);
                    avgpointsrank = sortedTeams.findIndex((stat) => stat.team === selectedTeam) + 1;
                }

                function calculateAutoPointsRank() {
                    if (!teamStats || teamStats.length === 0) {
                        autoPointsrank = 0;
                        return;
                    }
                    const sortedTeams = [...teamStats].sort((a, b) => b.autoAverage - a.autoAverage);
                    autoPointsrank = sortedTeams.findIndex((stat) => stat.team === selectedTeam) + 1;
                }

                function calculateTelePointsRank() {
                    if (!teamStats || teamStats.length === 0) {
                        telePointsrank = 0;
                        return;
                    }
                    const sortedTeams = [...teamStats].sort((a, b) => b.teleAverage - a.teleAverage);
                    telePointsrank = sortedTeams.findIndex((stat) => stat.team === selectedTeam) + 1;
                }

                function calculateAvgCoralRank() {
                    if (!teamStats || teamStats.length === 0) {
                        avgcoralrank = 0;
                        return;
                    }
                    const sortedTeams = [...teamStats].sort((a, b) => b.totalCoralAverage - a.totalCoralAverage);
                    avgcoralrank = sortedTeams.findIndex((stat) => stat.team === selectedTeam) + 1;
                }

                function calculateMaxCoralRank() {
                    if (!sheetData || sheetData.length === 0) {
                        maxcoralrank = 0;
                        return;
                    }
                    const teamMaxCorals = sheetData.reduce((acc, row) => {
                        const team = row[2];
                        const coral = 
                            (parseFloat(row[4]) || 0) +
                            (parseFloat(row[6]) || 0) +
                            (parseFloat(row[8]) || 0) +
                            (parseFloat(row[10]) || 0) +
                            (parseFloat(row[12]) || 0) +
                            (parseFloat(row[14]) || 0) +
                            (parseFloat(row[16]) || 0) +
                            (parseFloat(row[18]) || 0);
                        acc[team] = Math.max(acc[team] || 0, coral);
                        return acc;
                    }, {});
                    const sortedTeams = Object.entries(teamMaxCorals).sort(([, a], [, b]) => b - a);
                    maxcoralrank = sortedTeams.findIndex(([team]) => team === selectedTeam) + 1;
                }

                function calculateCyclesRank() {
                    if (!teamStats || teamStats.length === 0) {
                        cycles = 0;
                        return;
                    }
                    const sortedTeams = [...teamStats].sort((a, b) => b.cycles - a.cycles);
                    cyclesrank = sortedTeams.findIndex((stat) => stat.team === selectedTeam) + 1;
                }
            </script>
            <Header />
            <div class="grid grid-rows-2 grid-cols-2 mister" style="margin: 1rem; gap: 1rem; padding-bottom: 1rem">
                <div class="box">
                    <label for="team-dropdown">Select Team:</label>
                    <select id="team-dropdown" class="dropdown" bind:value={selectedTeam}>
                        {#each teams as team}
                            <option value={team}>{team}</option>
                        {/each}
                    </select>
                    <div class="grid grid-cols-3 grid-rows-1">
                        <div class="processor-box">
                            <h3>Can Processor</h3>
                            <div class="status {canProcessor ? 'can' : 'cannot'}">
                                <img
                                    src={canProcessor ? "/parrot.gif" : "/sadparrot.gif"}
                                    alt={canProcessor
                                        ? "Can Processor"
                                        : "Cannot Processor"}
                                />
                            </div>
                        </div>
                        <div class="processor-box">
                            <h3>Climb: {climbReliability}%</h3>
                            <div class="status {canProcessor ? 'can' : 'cannot'}">
                                <img
                                    src={canClimb ? "/parrot.gif" : "/sadparrot.gif"}
                                    alt={canClimb ? "Yes" : "No"}
                                />
                            </div>
                        </div>
                        <div class="processor-box">
                            <h3>Reliability: {reliability}%</h3>
                            <img
                                src={reliability >= 80 ? "/parrot.gif" : "/sadparrot.gif"}
                                alt={reliability >= 80 ? "Reliable" : "Not Reliable"}
                            />
                        </div>
                    </div>
                </div>
                <div class="box grid grid-cols-5">
                    <div class="col-span-2">
                        <center>
                    <h2>{name}</h2>
                    <img src="{imgSrc}" alt="Robot Image" style="height: 10rem; border-radius: 0.5rem"/>
                    {#if imgSrc === 'sadparrot.gif'}
                    <h3><i>no image found...</i></h3>
                    {/if}
                </center>
                    </div>
                    {#if camera == "N/A"}
                    <div class="col-start-4 col-span-2">
                    <img src="sadparrot.gif" alt="Robot Image" style="height: 10rem; border-radius: 0.5rem; margin-top: 4rem"/>
                    <h3><i>no pit data found...</i></h3>
                    </div>
                    {:else}
                    <div class="grid grid-cols-2 col-span-3">
                        <div>
                            <h4>Arch:</h4> {arch}
                            <h4>Weight:</h4> {weight}lbs
                            <h4>Dimensions:</h4> {dimensions}
                            <h4>Drivetrain:</h4> {drivetrain}
                            <h4>Scores:</h4> {canScore}
                        </div>
                        <div>
                            <h4>Alignment:</h4> {alignment}
                            <h4>Processor:</h4> {processor}
                            <h4>Camera:</h4> {camera}
                            <h4>Notes: </h4>{notes}
                        </div>        
                     </div>
                     {/if}
                </div>
                <div class="box grid grid-cols-3 grid-rows-2">
                    <div style="text-align: center;">
                        <h2>Average Points</h2>
                        <h3 style="color: #4e54c8;">{avgpoints}</h3>
                        <h4>Rank: {avgpointsrank} out of {totalTeams}</h4>
                    </div>
                    <div style="text-align: center;">
                        <h2>Auto Points</h2>
                        <h3 style="color: #4e54c8;">{autoPoints}</h3>
                        <h4>Rank: {avgpointsrank} out of {totalTeams}</h4>
                    </div>
                    <div style="text-align: center;">
                        <h2>Tele Points</h2>
                        <h3 style="color: #4e54c8;">{telePoints}</h3>
                        <h4>Rank: {telePointsrank} out of {totalTeams}</h4>
                    </div>
                    <div style="text-align: center;">
                        <h2>Average Coral</h2>
                        <h3 style="color: #4e54c8;">{avgcoral}</h3>
                        <h4>Rank: {avgcoralrank} out of {totalTeams}</h4>
                    </div>
                    <div style="text-align: center;">
                        <h2>Highest Coral</h2>
                        <h3 style="color: #4e54c8;">{maxcoral}</h3>
                        <h4>Rank: {maxcoralrank} out of {totalTeams}</h4>
                    </div>
                    <div style="text-align: center;">   
                        <h2>Average Cycles</h2>
                        <h3 style="color: #4e54c8;">{cycles}</h3>
                        <h4>Rank: {cyclesrank} out of {totalTeams}</h4>
                    </div>
                </div>
                <div class="box">
                    <Chart bind:selectedTeam={selectedTeam} sheetData={sheetData}/>
                </div>
            </div>
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
                }

                .dropdown:focus {
                    outline: none;
                    border-color: #4e54c8;
                    box-shadow: 0 0 5px rgba(78, 84, 200, 0.5);
                }

                .processor-box {
                    margin-top: 1rem;
                    padding: 1rem;
                    text-align: center;
                    background: white;
                    border-radius: 8px;
                }

                .processor-box h3 {
                    font-size: 1.2rem;
                    color: #4e54c8;
                    margin-bottom: 0.5rem;
                }

                .processor-box .status {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #4e54c8;
                }

                .processor-box .status.can {
                    color: green;
                }

                .processor-box .status.cannot {
                    color: red;
                }

                .mister
                {
                    height: calc(100vh - 12rem);
                }
                h4
                {
                   margin:0;
                   margin-top: 0.5rem;
                }
            </style>
