const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json())
const port = 3000;
const axiosInstance = axios.create({
    baseURL: 'https://www.worldcubeassociation.org',
});

app.get('/competitors', async (req, res) => {
    // Require a competitionId param passed in the body
    console.time("scrape");
    let competitionId = req.body.competitionId;

    if (competitionId === undefined) {
        return res.status(400).json({ "error": "Missing required competitionId parameter" })
    }
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
        if (error.code === "ERR_BAD_REQUEST") {
            console.error("Bad request. competitionId parameter is probably wrong")
            return res.status(400).json({ "error": "competitionId parameter is not valid. Please check again the id of the competition" })
        }
        res.status(500).send('An error occurred while fetching the data');
    }
    console.timeEnd("scrape")
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
