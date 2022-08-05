
class BoggleGame {
    constructor(boardId, secs = 60) {
        this.secs = secs; //length of game
        this.showTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $('#' + boardId);
        
        //tick timer
        this.timer = setInterval(this.tick.bind(this), 1000);

        //show word from words.txt
        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }

    //score in html
    showScore() {
        $(".score", this.board).text(this.score);
    }

    //show game stats

    showMessage(msg, cls) {
        $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }

    //handle when a word is submitted, if valid set score and show it

    async handleSubmit(evt){
        evt.preventDefault();
        const$word = $(".word", this.board);

        let word = $word.val();
        if(!word) return;

        if(this.words.has(word)) {
            this.showMessage(`Already found ${word}`, "err");
            return
        }

        //check server for word validity
        const resp = await axiois.get("/check-word", { params: { word: word }});
        if(resp.data.result === "not-word") {
            this.showMessage(`${word} is not a valid word`, "err");
        } else if(resp.data.result === "not-on-board") {
            this.showMessage(`${word} is not a valid word on the board`, "err")
        } else {
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(words);
            this.showMessage(`Added: ${word} to board`, "ok");
        }

        $word.val("").focus();
    }

    // Update timer in DOM
    showTimer(){
        $(".timer", this.board).text(this.secs);
    }

    //Tick timer: handles the seconds passing in current game session

    async tick(){
        this.secs = 1;
        this.showTimer();

        if (this.secs === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    //end of game: show update of score and message

    async scoreGame() {
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokenRecord) {
            this.showMessage(`New record: ${this.score}!`, "ok");
        } else {
            this.showMessage(`Final Score: ${this.score}`, "ok")
        }
    }
}


