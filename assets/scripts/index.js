let app = {
    playerInputs: null,
    scoreInputs: null,
    firstPlayerCheckboxes: null,
    totals: null,
    addPlayerButton: null,
    newRoundButton: null,
    init: function () {
        app.scoreInputs = document.querySelectorAll('td > input');
        app.playerInputs = document.querySelectorAll('th > input');
        app.totals = document.querySelectorAll('.total-score');
        app.firstPlayerCheckboxes = document.querySelectorAll('input.first-to-finish');
        app.addPlayerButton = document.getElementById('add-player');
        app.newRoundButton = document.getElementById('new-round');
        
        app.addListeners();

        skyjoGame.initialiseGame();

    },
    addListeners: function () {
        app.scoreInputs.forEach((input) => app.addScoreInputListener(input));

        app.playerInputs.forEach((input) => app.addPlayerInputListener(input));

        app.firstPlayerCheckboxes.forEach((input) => app.addfirstPlayerCheckboxesListener(input));

        app.addPlayerButton.addEventListener('click', (event) => { app.addPlayer(event) });
        app.newRoundButton.addEventListener('click', (event) => { app.newRound(event) });
    },
    addScoreInputListener: function (input) {
        input.addEventListener('keyup', (event) => { app.handleScoreChange(event) });
        input.addEventListener('change', (event) => { app.handleScoreChange(event) });
    },
    addPlayerInputListener: function (input) {
        // input.addEventListener('keyups', (event) => { app.handlePlayerChange(event) });
        input.addEventListener('change', (event) => { app.handlePlayerChange(event) });
    },
    addfirstPlayerCheckboxesListener: function (input) {
        input.addEventListener('click', (event) => { app.handleCheckBoxClick(event) });
    },
    handleScoreChange: function (e) {
        // find all values of edited columns
        let columnNumber = e.target.dataset.column;
        let playerTotal = document.querySelector(`[data-column="${columnNumber}"].total-score > .score`)

        let initialTotal = e.target.value;
        // calculate totals 
        let totalValue = app.calculatePlayerTotal(columnNumber);

        // set player total
        playerTotal.textContent = totalValue;

        let playerName = e.target.parentNode.querySelector('.player-name').textContent;
        let gameRound = parseInt(e.target.closest('tr.game-round').querySelector('.round').textContent) - 1 ;
        skyjoGame.setScore('game2025', gameRound, playerName, initialTotal);
        skyjoGame.getGame();
    },
    calculatePlayerTotal: function (columnNumber, doubled = false) {
        // calculate totals 
        let totalScore = 0;
        let playerScores = document.querySelectorAll(`[data-column="${columnNumber}"]:NOT(.total-score):NOT(.player)`)
        playerScores.forEach(function (cell) {
            let numValue = parseInt(cell.value);

            if (!doubled) {
                app.doubleIfFirstButNotLeast(cell.closest('tr'))
            }

            // add to total
            if (!isNaN(numValue)) {
                numValue = cell.classList.contains('doubled') ? numValue * 2 : numValue;
                totalScore += numValue;
            }
        })

        return totalScore;
    },
    handlePlayerChange: function (e) {
        let columnNumber = e.target.dataset.column;
        let playerName = e.target.value;
        let playerTotal = document.querySelector(`[data-column="${columnNumber}"].total-score > .player`);
        playerTotal.textContent = playerName + " : ";

        let playerRoundInput = document.querySelector(`[data-column="${columnNumber}"].player-round-score`);
        let playerRoundPlayerName = playerRoundInput.closest('td').querySelector('.player-name');
        playerRoundPlayerName.textContent = playerName;


        skyjoGame.addPlayer(playerName);

    },
    handleCheckBoxClick: function (e) {
        let parentRow = e.target.closest('tr');
        let rowCheckboxes = parentRow.querySelectorAll('input.first-to-finish');
        let playerName = e.target.closest('.first-to-finish__group').querySelector('.player-name').textContent;       
        let gameRound = parseInt(e.target.closest('tr.game-round').querySelector('.round').textContent) - 1 ;
        console.log(gameRound);
        rowCheckboxes.forEach(function (input) {
            if (input === e.target) {
                skyjoGame.setFirstToFinish('game2025', gameRound, playerName);
                skyjoGame.getGame();
                return;
            }

            let checkBoxesDisabled = e.target.checked;

            input.disabled = checkBoxesDisabled;

            app.enableScoreInputs(parentRow, !checkBoxesDisabled);


        });
    },
    enableScoreInputs: function (row, disabledStatus) {
        row.querySelectorAll('input.player-round-score').forEach(function (input) {
            input.disabled = disabledStatus;
        })
    },
    doubleIfFirstButNotLeast: function (row) {
        let allScores = row.querySelectorAll('input.player-round-score');
        let firstToFinish = row.querySelector('.first-to-finish:checked');
        let firstToFinishScore = firstToFinish.closest('td').querySelector('input.player-round-score');
        let doubleFirst = false;

        allScores.forEach(function (score) {
            currentCellScore = parseInt(score.value);
            if (firstToFinishScore !== score && !isNaN(currentCellScore) && currentCellScore <= firstToFinishScore.value) {
                doubleFirst = true;
            }
        });

        let method = doubleFirst ? 'add' : 'remove';

        firstToFinishScore.classList[method]('doubled');

        // calculate totals 
        let playerTotal = document.querySelector(`[data-column="${firstToFinishScore.dataset.column}"].total-score > .score`)
        let totalValue = app.calculatePlayerTotal(firstToFinishScore.dataset.column, true);

        // set player total
        playerTotal.textContent = totalValue;

    },
    addPlayer: function (e) {
        // add player input
        let playerInputs = document.querySelectorAll('thead th');
        let newPlayerElement = playerInputs[playerInputs.length - 2].cloneNode('true');
        let newPlayerInput = newPlayerElement.querySelector('.player');
        let newPlayerId = parseInt(newPlayerInput.dataset.column) + 1;
        let playerAction = playerInputs[playerInputs.length - 1];
        newPlayerInput.value = '';
        newPlayerInput.dataset.column = newPlayerId;
        newPlayerInput.placeholder = "Joueur " + newPlayerId;

        app.addPlayerInputListener(newPlayerElement);

        document.querySelector('thead tr').insertBefore(newPlayerElement, playerAction)

        // add score column
        let scoreColumns = document.querySelectorAll('tbody td');
        let newScoreColumn = scoreColumns[scoreColumns.length - 2].cloneNode(true);
        let newScoreInput = newScoreColumn.querySelector('input.player-round-score');
        let newScoreCheckbox = newScoreColumn.querySelector('input.first-to-finish');
        newScoreInput.dataset.column = newPlayerId;
        newScoreColumn.querySelector('.player-name').textContent = '';

        app.addScoreInputListener(newScoreInput)
        app.addfirstPlayerCheckboxesListener(newScoreCheckbox)

        document.querySelector('tbody tr.game-round').appendChild(newScoreColumn);

        // add player total
        let playerTotalScores = document.querySelectorAll('.total-score');
        let newPlayerTotalScore = playerTotalScores[playerTotalScores.length - 1].cloneNode(true);
        newPlayerTotalScore.dataset.column = newPlayerId;
        newPlayerTotalScore.querySelector('.player').textContent = '';

        document.querySelector('#totals').appendChild(newPlayerTotalScore);


    },
    newRound: function (e) {
        let roundElements = document.querySelectorAll('.game-round');
        let newRoundElement = roundElements[roundElements.length - 1].cloneNode(true);
        let oldRoundNumber = parseInt(newRoundElement.querySelector('th').textContent);
        let roundAction = document.querySelector('.round-action');
        newRoundElement.querySelector('th').textContent = oldRoundNumber + 1;

        // clean inputs 
        newRoundElement.querySelectorAll('input').forEach(function (input) {
            if (input.type == 'checkbox') {
                input.checked = false;
                input.disabled = false;
                app.addfirstPlayerCheckboxesListener(input);
            } else {
                input.value = null;
                input.disabled = true;
                input.classList.remove('doubled');
                app.addScoreInputListener(input);
            }
        });

        document.querySelector('tbody').insertBefore(newRoundElement, roundAction);

        skyjoGame.addRound('game2025')
    }
}

document.addEventListener('DOMContentLoaded', app.init);