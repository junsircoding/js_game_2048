// Constant
FIGURE_SIZE = 600;
FIGURE_BKG_COLOR = "D4DFE6";
FIGURE_BDR_RADIUS = "15px";
BLOCK_SIZE = 130;
BLOCK_COUNT = 4;
BLOCK_PADDING_SIZE = (FIGURE_SIZE - BLOCK_COUNT * BLOCK_SIZE) / (BLOCK_COUNT+1);
BLOCK_COLOR = "CADBE9";
BLOCK_BKG_COLOR = "C4CFD6";
BLOCK_FONT_SIZE = 60;
BLOCK_FONT_COLOR = "444444";



// GLobal Utility Functions
randInt = function(a, b) {
    return a + Math.floor(Math.random() * (b + 1 - a));
}
randChoice = function(arr) {
    return arr[randInt(0, arr.length - 1)];
}


// Model
class GameModel {
    constructor() {
        this.data = [];
        this.init_data();
    }

    init_data() {
        this.data = [];
        for (let row_index = 0; row_index < BLOCK_COUNT; row_index++){
            let row_tmp = [];
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                row_tmp.push(null);
            }
            this.data.push(row_tmp);
        }
        this.gen_new_block();
    }
    
    gen_new_block() {
        let null_content_locations = [];
        for (let row_index = 0; row_index < BLOCK_COUNT; row_index++){
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                if (this.data[row_index][col_index] == null) {
                    null_content_locations.push([row_index, col_index]);
                }
            }
        }
    
        let location = randChoice(null_content_locations);
        this.data[location[0]][location[1]] = 2;
    }

    fusion_row(row) {
        // Classification discussion:
        // note: `tail` means content, `*tail` means point or index 
        // tail == null
        //     *tail += 1
        // tail != null
        //     head == null
        //         head <=> tail && *tail += 1
        //     head != null
        //         *head == *tail
        //             head *= 2 && tail = null && *tail += 1 && *head += 1
        //         *head != *tail
        //             *head += 1
        let head = 0;
        let tail = 1;

        while (tail < row.length) {
            if (row[tail] == null){
                tail += 1;
            }
            else {
                if (row[head] == null) {
                    row[head] = row[tail];
                    row[tail] = null;
                    tail += 1;
                }
                else {
                    if (row[head] == row[tail]) {
                        row[head] *= 2;
                        row[tail] = null;
                        tail += 1;
                        head += 1;
                    }
                    else {
                        head += 1;
                    }
                }
            }
        }
    }

}



// View
class GameView {
    constructor(data, container) {
        this.data = data;
        this.container = container;
        this.init_container();
    }

    init_container() {
        this.container.style.width = FIGURE_SIZE;
        this.container.style.height = FIGURE_SIZE;
        this.container.style.backgroundColor = FIGURE_BKG_COLOR;
        this.container.style.borderRadius = FIGURE_BDR_RADIUS;
        this.container.style.position = "relative";
        this.container.style.display = "inline-block";
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
        // purge old html content
        this.container.innerHTML = "";
        // draw new block background
        for (let row_index = 1; row_index <= BLOCK_COUNT; row_index++) {
            for (let col_index = 1; col_index <= BLOCK_COUNT; col_index++) {
                let location = this.block_num_to_location(row_index, col_index);
                this.draw_bkg_block(location, BLOCK_BKG_COLOR);
            }
        }
        // draw data
        for (let row_index = 0;row_index < BLOCK_COUNT; row_index++){
            for (let col_index = 0;col_index < BLOCK_COUNT; col_index++){
                let new_location = this.block_num_to_location(row_index+1, col_index+1);
                let new_content = this.data[row_index][col_index];
                if (new_content != null) {
                    this.draw_block(new_location, new_content);
                }
            }
        }
        // let location_new = [BLOCK_PADDING_SIZE, BLOCK_PADDING_SIZE];
        // this.draw_block(location_new, "5");
    }

    draw_bkg_block(location, color) {
        let block = document.createElement("div");
        block.style.width = BLOCK_SIZE;
        block.style.height = BLOCK_SIZE;
        block.style.backgroundColor = color;
        block.style.borderRadius = "5px";
        block.style.position = "absolute";
        block.style.top = location[0];
        block.style.left = location[1];
        this.container.append(block);
        return block;
    }
    
    draw_block(location, content) {
        let block = this.draw_bkg_block(location, BLOCK_COLOR);

        let span = document.createElement("span");
        let text = document.createTextNode(content);
        span.appendChild(text);

        span.style.fontFamily = '"Archivo Black", sans-serif';
        span.style.fontSize = BLOCK_FONT_SIZE;
        span.style.color = BLOCK_FONT_COLOR;
        span.style.position = "relative";
        span.style.textAlign = "center";
        span.style.top = (BLOCK_SIZE - span.offsetHeight) / 4;

        block.appendChild(span);
    }

}



// Controller
game_model = new GameModel();
game_container = document.getElementById("game_container");
game_view = new GameView(game_model.data, game_container);
game_view.draw_game();

// console.log(game_model.data);

document.onkeydown = function(event) {
    const event_key = event.key;
    switch(event_key) {
        case "ArrowLeft":
            console.log("left");
            break;
        case "ArrowRight":
            console.log("right");
            break;
        case "ArrowUp":
            console.log("up");
            break;
        case "ArrowDown":
            console.log("down");
            break;
        default:
            console.log(`do nothing: ${event_key}.`);
    }
}


// Test
class UnitTest {
    static compare_row(row_01, row_02) {
        if (row_01.length != row_02.length) {
            return false;
        }
        for (let row_index = 0; row_index < row_01.length; row_index++) {
            if (row_01[row_index] != row_02[row_index]) {
                return false;
            }
        }
        return true;
    }
    static test_fusion_row(){
        let game_model = new GameModel();
        let test_cases = [
            [[2, null, 4, null], [2, 4, null, null]],
            [[null, null, null, null], [null, null, null, null]],
            [[2, 2, 2, 2], [4, 4, null, null]],
            [[2, 2, null, null], [4, null, null, null]],
            [[4, 4, 4, null], [8, 4, null, null]],
            [[2, null, 4, null], [2, 4, null, null]],
            [[2, 2, 4, 4], [4, 8, null, null]],
        ];
        let errFlag = false;
        
        for (let test_case of test_cases) {
            let input = test_case[0].slice();
            let input_origin = test_case[0].slice();
            let output = test_case[1].slice();
            // note: fusion_row() is inplace
            game_model.fusion_row(input);
            if (!UnitTest.compare_row(input, output)) {
                errFlag = true;
                console.log("Error!", input_origin,input, output);
            }
        }

        if (!errFlag) {
            console.log("Pass ^_^");
        }
    }
}

// UnitTest.test_fusion_row()
