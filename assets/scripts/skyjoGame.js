let skyjoGame = {
    currentGame: null,
    roundObj: {
        scores: {},
        firstToFinish: "",
      },
    getGameId: function () {
        let currentDate = new Date();
        let year = String(currentDate.getFullYear());
        let month = String(currentDate.getMonth() + 1);
        let day = String(currentDate.getDate());
        let hour = String(currentDate.getHours());
        let minute = String(currentDate.getMinutes());

        return `game-${year}${month}${day}${hour}${minute}`;
    },
    getGame: function () {
        skyjoGame.currentGame = JSON.parse(window.localStorage.skyjo);
        console.log(skyjoGame.currentGame['game2025']);
    },
    saveGame: function () {
        window.localStorage.skyjo = JSON.stringify(skyjoGame.currentGame);
    },
    initialiseGame: function () {
        window.localStorage.skyjo = JSON.stringify({
            game2025: {
                players: [],
                rounds: [skyjoGame.roundObj],
            },
        });
    },

    addPlayer: function (player) {
        skyjoGame.getGame();
        skyjoGame.currentGame["game2025"].players.push(player);
        skyjoGame.currentGame["game2025"].rounds[0].scores[player] = 0;

        // players.forEach((name) => {
        //   skyjoGame.currentGame["game2025"].rounds[0].scores[name] = 0;
        // });
        skyjoGame.saveGame();
    },

    addRound: function (gameKey) {
        skyjoGame.currentGame["game2025"].players.forEach((player) => {
            skyjoGame.roundObj.scores[player] = 0;
        });
        skyjoGame.currentGame[gameKey].rounds.push(skyjoGame.roundObj);
        skyjoGame.saveGame();
    },

    setScore: function (gameKey, round, name, score) {
        skyjoGame.currentGame[gameKey].rounds[round].scores[name] = score;
        skyjoGame.saveGame();
    },

    setFirstToFinish: function (gameKey, round, name) {
        skyjoGame.currentGame[gameKey].rounds[round].firstToFinish = name;
        skyjoGame.saveGame();
    }
}

// let game = {
//     currentGame: null,
//     roundObj: {
//       scores: {},
//       firstToFinish: "",
//     },
//     getGame: function () {
//       game.currentGame = JSON.parse(window.localStorage.skyjo);
//     },
  
//     saveGame: function () {
//       window.localStorage.skyjo = JSON.stringify(game.currentGame);
//     },
  
//     initialiseGame: function () {
//       window.localStorage.skyjo = JSON.stringify({
//         game2025: {
//           players: [],
//           rounds: [game.roundObj],
//         },
//       });
//     },
  
//     addPlayers: function (players) {
//       game.currentGame["game2025"].players = players;
//       players.forEach((name) => {
//         game.currentGame["game2025"].rounds[0].scores[name] = 0;
//       });
//       game.saveGame();
//     },
  
//     addRound: function (gameKey) {
//       game.currentGame["game2025"].players.forEach((player) => {
//           game.roundObj.scores[player] = 0;
//       });
//       game.currentGame[gameKey].rounds.push(game.roundObj);
//       game.saveGame();
//     },
  
//     setScore: function (gameKey, round, name, score) {
//       game.currentGame[gameKey].rounds[round].scores[name] = score;
//       game.saveGame();
//     },
  
//     setFirstToFinish: function (gameKey, round, name) {
//       game.currentGame[gameKey].rounds[round].firstToFinish = name;
//       game.saveGame();
//     },
//   };
  
//   localStorage.clear();
//   game.initialiseGame();
//   game.getGame();
//   console.log(game.currentGame["game2025"]);
  
//   game.addPlayers(["eme", "chris"]);
//   console.log(game.currentGame["game2025"].rounds[0].scores);
  
//   game.setScore("game2025", 0, "chris", 5);
//   console.log(game.currentGame["game2025"].rounds[0].scores);
  
//   game.setFirstToFinish("game2025", 0, "chris");
//   console.log(game.currentGame["game2025"].rounds[0]);
  
//   game.addRound("game2025");
//   console.log(game.currentGame["game2025"].rounds);
  
//   game.setScore("game2025", 1, "chris", 5);
//   game.setScore("game2025", 1, "eme", 2);
//   game.setFirstToFinish("game2025", 1, "chris");
//   console.log(game.currentGame);