import fetch from 'node-fetch';

export async function GET({ url }) {
    const eventKey = url.searchParams.get('eventKey'); // Get the event key from the query string
    const apiKey = 'wlltR8jyjHBcLG0tA7Zg6EEMRs6qLmBtYr9euIr9NzvyOr7PaLlpedreymRQA7dY'; // Replace with your TBA API key

    if (!eventKey) {
        return new Response(JSON.stringify({ error: 'Missing eventKey parameter' }), { status: 400 });
    }

    try {
        const response = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`, {
            headers: {
                'X-TBA-Auth-Key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`TBA API error: ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching rankings:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch rankings' }), { status: 500 });
    }
}