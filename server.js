    const express = require("express");
    const app = express();

    const http = require("http").createServer(app);
    const { Server } = require("socket.io");

    const io = new Server(http);

    const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use("/questions",
    express.static(path.join(__dirname, "questions"))
);
app.get("/final-image", (req, res) => {
    res.sendFile(
        path.join(__dirname, "Q7mX2a9KpL.jpg")
    );
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
    const teamStatus = {
        yellow: {
    used: 0,
    questions: [],
    pieces: [],
    finishTime: null,
    currentTime: "00:00"
},
        green: {
            used: 0,
            questions: [],
            pieces: [],
            finishTime: null,
            currentTime: "00:00"
        },
        blue: {
          used: 0,
            questions: [],
            pieces: [],
            finishTime: null,
            currentTime: "00:00"
        },
        red: {
        used: 0,
            questions: [],
            pieces: [],
            finishTime: null,
            currentTime: "00:00"
        }
    };

    io.on("connection", (socket) => {
    socket.on("question-used", (data) => {

        console.log("Question used:", data);

        const team = data.team;
        const question = data.question;

    if(!teamStatus[team].questions.includes(question)){

        teamStatus[team].used++;

        teamStatus[team].questions.push(question);

    }

        io.emit("admin-update", teamStatus);
    console.log(teamStatus);
    });
    socket.on("piece-opened", (data) => {

        console.log("Piece opened:", data);

        const team = data.team;
        const piece = data.piece;

        if(
            piece &&
            !teamStatus[team].pieces.includes(piece)
        ){
            teamStatus[team].pieces.push(piece);
        }

        io.emit("admin-update", teamStatus);

    });
    socket.on("team-finished", (data) => {

    teamStatus[data.team].finishTime =
        data.time;

    io.emit("admin-update", teamStatus);

    console.log(
        data.team +
        " finished in " +
        data.time
    );

});
socket.on("timer-update", (data) => {

    teamStatus[data.team].currentTime =
        data.time;

    io.emit("admin-update", teamStatus);

});
        console.log("User connected");

    });

    http.listen(3000, () => {

        console.log("Server running at http://localhost:3000");

    });     
