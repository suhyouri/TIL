const express = require("express");
const { Client } = require('@notionhq/client');
const cors = require("cors");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();


const app = express();

app.use(cors());

const PORT = 4000;
const HOST = "localhost";

const notion = new Client({
  auth: "secret_8CT1XwtZMKgL8HNgn1jWeNcXhCJxqoJOVrs8HcqBcc3",
});

const databaseId = "779d06b58bd543e19dc733d146ed7d3c";

app.post("/submitFormToNotion", jsonParser, async (req, res) => {
  //req.body
  // {
  //     name: "Do",
  //     phoneNumber: "Do",
  //     extraInfo: "Do",
  // }
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const extraInfo = req.body.extraInfo;

    try {
        const response = await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: name,
                  },
                },
              ],
            },
            "Phone Number": {
              rich_text: [
                {
                  text: {
                    content: phoneNumber,
                  },
                },
              ],
            },
          },
          "Extra Info": {
            rich_text: [
              {
                text: {
                  content: extraInfo,
                },
              },
            ],
          },
        });
        console.log(response);
        console.log("Success!");
    } catch (err) {
        console.log(err);
    }
});

app.listen(PORT, HOST, () => {
    console.log("Starting proxy at " + HOST + ":" + PORT);
});

