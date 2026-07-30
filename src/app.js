const express = require("express");
const path = require("path");
const cors = require("cors");
const {google} = require("googleapis");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ".." , "public")));

const spreadsheetId = process.env.SPREADSHEET_ID; // Replace with your Google Sheets ID
const headers = ["id", "name", "email", "course", "createdAt"];

if(!spreadsheetId) {
    console.error("Please set the spreadsheetId in your env");
}


const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "..", "credentials.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({version: "v4", auth});

async function getSheetRows() {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: "Sheet1!A:E",
    });

    const rows = res.data.values || [];
    return rows.slice(1).map(([id, name, email, course, createdAt]) => ({id, name, email, course, createdAt}));
}

async function saveSheetsRows(rows) {
    const values = [headers, ...rows.map((student) => {
        return [
            student.id,
            student.name,
            student.email,
            student.course,
            student.createdAt
        ];
    })];

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A:E",
        valueInputOption: "RAW",
        requestBody: { values},
    });
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/students", async(req, res) => {
    try {
        const students = await getSheetRows();
        res.json(students);
    } catch (error) {
         console.error("GET /students failed:", error);
        res.status(500).json({error: "failed to fetch students", message: error.message});
    }
});

app.post("/students", async(req, res) => {
    try{
        const students = await getSheetRows();
        const newStudent = {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            course: req.body.course,
            createdAt: new Date().toISOString(),
        };

        students.push(newStudent);
        await saveSheetsRows(students);
        res.status(201). json(newStudent);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.put("/students/:id", async (req, res) => {
    try{
        const students = await getSheetRows();
        const index  = students.findIndex((student) => student.id === req.params.id);

        if(index === -1){
            return res.status(404).json({message: "Student not found"});
        }

        students[index] = {
            ...students[index],
            ...req.body,
            id: req.params.id,
        };

        await saveSheetRows(students);
        res.json(students[index]);
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

app.delete("/students/:id", async (req, res) =>{
    try{
        const students = await getSheetRows();
        const filtered = students.filter((student) => student.id !== req.params.id);

        if(filtered.length === students.length){
            return res.status(404).json({message: "Student not found"});
        }

        await saveSheetRows(filtered);
        res.json({message: "Student deleted successfully"});
    } catch (error){
        res.status(500).json({error: error.message});
    }
});

module.exports = app;