const express = require("express");
const cheerio = require("cheerio");

const app = express();
const port = 3001;

app.get("/competitions/:competitionId", async (req, res) => {
  const competitionId = req.params.competitionId;
  // Fetch the HTML from the URL

  extractPersonLinks(
    `https://worldcubeassociation.org/competitions/${competitionId}/registrations`
  )
    .then((links) =>
      res.status(200).json(links.map((link) => link.split("/").pop()))
    )
    .catch((err) => res.status(500).json({ error: err.message }));
  // Load the HTML into cheerio
  // Extract the data you need
  // Send the extracted data as JSON
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const puppeteer = require("puppeteer");

async function extractPersonLinks(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" }); // Wait for rendering

  // Example: Extract links using page.evaluate (runs in the browser context)
  const links = await page.evaluate(() => {
    const personLinks = [];
    const aTags = document.querySelectorAll("a");
    aTags.forEach((a) => {
      if (a.href.includes("/persons/")) {
        personLinks.push(a.href);
      }
    });
    return personLinks;
  });

  await browser.close();
  return links;
}
