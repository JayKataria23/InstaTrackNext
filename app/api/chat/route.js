import fetch from 'node-fetch';

const url = "https://api.langflow.astra.datastax.com/lf/6363df7d-de21-40a8-b966-c4ef62c2f1d3/api/v1/run/analysis?stream=false";
const token = process.env.CHAT_TOKEN;

export async function POST(req) {
    try {
        const body = await req.json(); // Parse the request body
        const { message } = body;

        const data = {
            input_value: message,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
                "Prompt-9k3UN": {},
                "AstraDB-q1Bpb": {},
                "ParseData-pBfdP": {},
                "File-EFUKH": {},
                "SplitText-4GXFo": {},
                "AstraDB-bsz27": {},
                "Agent-QgWXI": {},
                "Agent-f6G93": {},
                "Agent-iTR1e": {},
                "AstraDBToolComponent-NhzYK": {},
                "TextInput-u101s": {},
                "TextInput-wpayk": {}
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        return new Response(JSON.stringify(result.outputs[0].outputs[0].results.message.text), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);

        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function GET() {
    return new Response(
        JSON.stringify({ error: 'GET method not allowed' }),
        {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
