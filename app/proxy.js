export default async function handler(req, res) {
    const response = await fetch('https://sportshub.perfectgym.com' + req.url.replace('/api/proxy', ''), {
        method: req.method,
        headers: {
            ...req.headers,
            Referer: 'https://sportshub.perfectgym.com/clientportal2/',
            Origin: 'https://sportshub.perfectgym.com',
        },
        body: req.method === 'POST' ? req.body : undefined,
    });

    res.status(response.status).send(await response.text());
}
