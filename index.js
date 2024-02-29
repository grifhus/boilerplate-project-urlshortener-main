require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()

const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html")
})

const originalUrls = []
const shortUrls = []
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url
  const foundIndex = originalUrls.indexOf(url)

  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: "invalid url" })
  }
  if (foundIndex < 0) {
    originalUrls.push(url)
    shortUrls.push(shortUrls.length)

    return res.json({ original_url: url, short_url: shortUrls.length - 1 })
  }
})

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = req.params.shorturl
  const shortUrlIndex = parseInt(shorturl)

  if (
    isNaN(shortUrlIndex) ||
    shortUrlIndex >= shortUrls.length ||
    shortUrlIndex < 0
  ) {
    return res.status(404).json({ error: "Short URL not found" })
  }

  const originalUrl = originalUrls[shortUrlIndex]
  if (!originalUrl) {
    return res.status(404).json({ error: "Original URL not found" })
  }

  res.redirect(originalUrl)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
