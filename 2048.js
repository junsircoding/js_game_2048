// Constant
FIGURE_SIZE = 600;
FIGURE_BAK_COLOR = "D4DFE6";
FIGURE_BDR_RADIUS = "15px";
BLOCK_SIZE = 130;
BLOCK_COUNT = 4;
BLOCK_PADDING_SIZE = (FIGURE_SIZE - BLOCK_COUNT * BLOCK_SIZE) / (BLOCK_COUNT+1);
BLOCK_BAK_COLOR = "CADBE9";



// GLobal Utility Functions



// Model
class GameModel {

}



// View
class GameView {
    constructor(container) {
        this.container = container;
        this.init_container();
    }

    init_container() {
        this.container.style.width = FIGURE_SIZE;
        this.container.style.height = FIGURE_SIZE;
        this.container.style.backgroundColor = FIGURE_BAK_COLOR;
        this.container.style.borderRadius = FIGURE_BDR_RADIUS;
        this.container.style.position = "relative";
    }

    block_num_to_location(row_index, col_index) {
        // num  top     left
        // 1    z       z
        // 2    z       2z+x    
        // 3    z       3z+2x
        // 4    z       4z+3x
        // 5    2z+x    z
        // 6    2z+x    2z+x
        // 7    2z+x    3z+2x
        // 8    2z+x    4z+3x
        // 9    3z+2x   z
        // 10   3z+2x   2z+x
        // 11   3z+2x   3z+2x
        // 12   3z+2x   4z+3x
        // 13   4z+3x   z
        // 14   4z+3x   2z+x
        // 15   4z+3x   3z+2x
        // 16   4z+3x   4z+3x
        //
        // num  row_index * z + (row_index - 1) * x col_index * z + (col_index - 1) * x

        let location_top = row_index * BLOCK_PADDING_SIZE + (row_index-1) * BLOCK_SIZE
        let location_left = col_index * BLOCK_PADDING_SIZE + (col_index - 1) * BLOCK_SIZE;

        return [location_top, location_left];
    }

    draw_game() {
        for (let row_index = 1; row_index <= BLOCK_COUNT; row_index++) {
            for (let col_index = 1; col_index <= BLOCK_COUNT; col_index++) {
                let location = this.block_num_to_location(row_index, col_index);
                this.draw_block(location);
            }
        }
    }

    draw_block(location) {
        let block = document.createElement("div");
        block.style.width = BLOCK_SIZE;
        block.style.height = BLOCK_SIZE;
        block.style.backgroundColor = BLOCK_BAK_COLOR;
        block.style.borderRadius = "5px";
        block.style.position = "absolute";
        block.style.top = location[0];
        block.style.left = location[1];
        this.container.append(block);
    }

}



// Controller
game_container = document.getElementById("game_container");
game_view = new GameView(game_container)
game_view.draw_game()


// Test