const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3001;
const axiosInstance = axios.create({
    baseURL: 'https://www.worldcubeassociation.org',
});

app.get('/competitions/:competitionId', async (req, res) => {
    console.time("scrape");
    const competitionId = req.params.competitionId;
    try {
        // Fetch the HTML from the URL
        const response = await axiosInstance.get(`/competitions/${competitionId}/registrations`);
        const html = response.data;
        // Load the HTML into Cheerio
        const $ = cheerio.load(html);

        // Extract the data you need
        let idArr = []
        $('table tbody tr').each((index, element) => {
            const href = $(element).find('td').children("a").attr("href");
            if (href != undefined) {
                const id = href.split("/").pop();
                idArr.push(id);
            }


        });

        // Send the extracted data as JSON
        res.json(idArr);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the data');
    }
    console.timeEnd("scrape")
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
