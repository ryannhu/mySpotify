export async function GET() {
    return Response.json({client_id: process.env.CLIENT_ID, url: process.env.CURRENT_URL}, {status: 200})
}