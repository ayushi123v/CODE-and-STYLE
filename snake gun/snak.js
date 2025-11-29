// ======= Game Classes (OOP) =======
console.log("snak.js loaded");

class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
        this.currentChoice = null;
    }

    setChoice(choice) {
        this.currentChoice = choice;
    }

    incrementScore() {
        this.score++;
    }

    reset() {
        this.score = 0;
        this.currentChoice = null;
    }
}

class Game {
    constructor(maxRounds = 10) {
        this.player1 = new Player("Player 1");
        this.player2 = new Player("Player 2");
        this.maxRounds = maxRounds;
        this.currentRound = 1;
        this.draws = 0;
        this.gameOver = false;

        this.choiceEmojiMap = {
            gun: "Gun 🔫",
            water: "Water 💧",
            snake: "Snake 🐍"
        };

        this.initDOMRefs();
        this.updateRoundInfo();
        this.updateScoreboard();
        this.attachEventListeners();
    }

    initDOMRefs() {
        // Choice buttons
        this.p1Buttons = document.querySelectorAll(".p1-choice");
        this.p2Buttons = document.querySelectorAll(".p2-choice");

        // Displays
        this.p1ChoiceDisplay = document.getElementById("player1-choice-display");
        this.p2ChoiceDisplay = document.getElementById("player2-choice-display");

        this.p1ScoreDisplay = document.getElementById("player1-score");
        this.p2ScoreDisplay = document.getElementById("player2-score");
        this.drawScoreDisplay = document.getElementById("draw-score");

        this.currentRoundDisplay = document.getElementById("current-round");
        this.totalRoundsDisplay = document.getElementById("total-rounds");

        this.roundMessage = document.getElementById("round-message");
        this.finalMessage = document.getElementById("final-message");

        // Control buttons
        this.nextRoundBtn = document.getElementById("next-round-btn");
        this.resetGameBtn = document.getElementById("reset-game-btn");

        // Debugging: warn about missing DOM refs
        if (!this.p1Buttons.length) console.warn("No Player 1 choice buttons found (.p1-choice)");
        if (!this.p2Buttons.length) console.warn("No Player 2 choice buttons found (.p2-choice)");
        if (!this.p1ChoiceDisplay) console.warn("Missing #player1-choice-display");
        if (!this.p2ChoiceDisplay) console.warn("Missing #player2-choice-display");
        if (!this.p1ScoreDisplay) console.warn("Missing #player1-score");
        if (!this.p2ScoreDisplay) console.warn("Missing #player2-score");
        if (!this.drawScoreDisplay) console.warn("Missing #draw-score");
        if (!this.currentRoundDisplay) console.warn("Missing #current-round");
        if (!this.totalRoundsDisplay) console.warn("Missing #total-rounds");
    }

    attachEventListeners() {
        // Player 1 choice buttons
        this.p1Buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                if (this.gameOver) return;
                const choice = btn.dataset.choice;
                this.player1.setChoice(choice);
                this.p1ChoiceDisplay.textContent = this.choiceEmojiMap[choice];
                this.roundMessage.textContent = "Player 2, choose your option.";
                // Enable Next Round button only when both players have selected
                if (this.player1.currentChoice && this.player2.currentChoice) {
                    this.nextRoundBtn.disabled = false;
                }
            });
        });

        // Player 2 choice buttons
        this.p2Buttons.forEach(btn => {
            btn.addEventListener("click", () => {
                if (this.gameOver) return;
                const choice = btn.dataset.choice;
                this.player2.setChoice(choice);
                this.p2ChoiceDisplay.textContent = this.choiceEmojiMap[choice];
                this.roundMessage.textContent = "Click 'Next Round' to see the result.";
                // Enable Next Round button only when both players have selected
                if (this.player1.currentChoice && this.player2.currentChoice) {
                    this.nextRoundBtn.disabled = false;
                }
            });
        });

        // Next Round button
        this.nextRoundBtn.addEventListener("click", () => {
            if (this.gameOver) return;
            this.playRound();
        });

        // Reset Game button
        this.resetGameBtn.addEventListener("click", () => {
            this.resetGame();
        });
    }

    updateScoreboard() {
        this.p1ScoreDisplay.textContent = this.player1.score;
        this.p2ScoreDisplay.textContent = this.player2.score;
        this.drawScoreDisplay.textContent = this.draws;
    }

    updateRoundInfo() {
        this.currentRoundDisplay.textContent = this.currentRound;
        this.totalRoundsDisplay.textContent = this.maxRounds;
    }

    getRoundResult(choice1, choice2) {
        if (choice1 === choice2) return "draw";

        const winMap = {
            gun: "snake",  // Gun kills Snake
            snake: "water", // Snake drinks Water
            water: "gun"   // Water douses Gun
        };

        if (winMap[choice1] === choice2) {
            return "player1";
        } else {
            return "player2";
        }
    }

    playRound() {
        if (!this.player1.currentChoice || !this.player2.currentChoice) {
            this.roundMessage.textContent = "Both players must select their choices!";
            return;
        }

        const result = this.getRoundResult(
            this.player1.currentChoice,
            this.player2.currentChoice
        );

        if (result === "draw") {
            this.draws++;
            this.roundMessage.textContent = `Round ${this.currentRound}: It's a draw!`;
        } else if (result === "player1") {
            this.player1.incrementScore();
            this.roundMessage.textContent = `Round ${this.currentRound}: Player 1 wins this round! 🎉`;
        } else {
            this.player2.incrementScore();
            this.roundMessage.textContent = `Round ${this.currentRound}: Player 2 wins this round! 🎉`;
        }

        this.updateScoreboard();

        if (this.currentRound >= this.maxRounds) {
            this.endGame();
        } else {
            this.currentRound++;
            this.updateRoundInfo();
        }

        // Clear round choices for next round
        this.player1.currentChoice = null;
        this.player2.currentChoice = null;
        this.p1ChoiceDisplay.textContent = "-";
        this.p2ChoiceDisplay.textContent = "-";
        // Disable Next Round until players re-select to avoid accidental extra clicks
        this.nextRoundBtn.disabled = true;
    }

    endGame() {
        this.gameOver = true;
        this.disableChoiceButtons();

        if (this.player1.score > this.player2.score) {
            this.finalMessage.textContent = `🏆 Player 1 wins the game with ${this.player1.score} points!`;
        } else if (this.player2.score > this.player1.score) {
            this.finalMessage.textContent = `🏆 Player 2 wins the game with ${this.player2.score} points!`;
        } else {
            this.finalMessage.textContent = `🤝 The game is a draw! Both scored ${this.player1.score}.`;
        }

        this.roundMessage.textContent = "Game over! Click 'Reset Game' to play again.";
    }

    disableChoiceButtons() {
        this.p1Buttons.forEach(btn => (btn.disabled = true));
        this.p2Buttons.forEach(btn => (btn.disabled = true));
        this.nextRoundBtn.disabled = true;
    }

    enableChoiceButtons() {
        this.p1Buttons.forEach(btn => (btn.disabled = false));
        this.p2Buttons.forEach(btn => (btn.disabled = false));
        // Keep Next button disabled until both players make a choice
        this.nextRoundBtn.disabled = true;
    }

    resetGame() {
        this.player1.reset();
        this.player2.reset();
        this.draws = 0;
        this.currentRound = 1;
        this.gameOver = false;

        this.updateScoreboard();
        this.updateRoundInfo();

        this.p1ChoiceDisplay.textContent = "-";
        this.p2ChoiceDisplay.textContent = "-";

        this.roundMessage.textContent = "Make your choices to start the game.";
        this.finalMessage.textContent = "The overall winner will be shown here after 10 rounds.";

        this.enableChoiceButtons();
    }
}

// ======= Initialize Game After DOM Loads =======
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded — initializing Game");
    new Game(10); // 10 rounds
});
