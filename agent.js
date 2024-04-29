ARROW_LEFT = "ArrowLeft";
ARROW_RIGHT = "ArrowRight";
ARROW_UP = "ArrowUp";
ARROW_DOWN = "ArrowDown";

class GameEval extends GameModel {
    constructor(game_model) {
        super();
        this.data = JSON.parse(JSON.stringify(game_model.data));
        this.children = {};
        this.parent = null;
        this.points = game_model.points;
        this.best_children = null;
        this.move = null;

    }

    copy() {
        let ret = new GameEval(this);
        return ret;
    }

    eval_next_step(){
        for (let command of [ARROW_DOWN, ARROW_UP, ARROW_LEFT, ARROW_RIGHT]) {
            let next = this.copy();
            let fusion_result = next.fusion_batch(command);
            if (fusion_result.valid_flag == true) {
                this.children[command] = next;
                next.parent = this;
                next.move = command;
            }
            else{
                this.children[command] = null;
            }
        }
    }

    back_propagate(){
        let node = this;
        let points = this.points;
        while (node.parent) {
            if (node.parent.best_children == null || node.parent.best_children < points) {
                node.parent.best_children = {
                    "move": node.move,
                    "points": points
                }
            }
            node = node.parent;
        }
    }
}

class GameAgent{
    constructor(game_model) {
        this.game_model = game_model;
    }

    evalulate(depth = 4) {
        let curr_game = new GameEval(this.game_model);
        let queue = [curr_game];
        let next_queue = [];
        for (let i = 0;i < depth; i++) {
            for (let g of queue) {
                g.eval_next_step();
                for (let cmd in g.children) {
                    if (g.children[cmd]) {
                        next_queue.push(g.children[cmd]);
                    }
                }
            }
            queue = next_queue;
            next_queue = [];
        }
        for (let g of queue){
            g.back_propagate();
        }
        return curr_game.best_children;
    }

    issue_command(command) {
        var e = new KeyboardEvent("keydown", {"key": command});
        document.dispatchEvent(e);
    }

    play(rounds = 10) {
        if (rounds > 0) {
            let result = this.evalulate();
            this.issue_command(result.move);
            setTimeout(() => {
                this.play(rounds - 1);
            }, 200)

        }

    }
}