// Constant
FIGURE_SIZE = 600;
FIGURE_BKG_COLOR = "#bbaa9c";
FIGURE_BDR_RADIUS = "15px";
BLOCK_SIZE = 130;
BLOCK_COUNT = 4;
BLOCK_PADDING_SIZE = (FIGURE_SIZE - BLOCK_COUNT * BLOCK_SIZE) / (BLOCK_COUNT + 1);
BLOCK_BKG_COLOR = "#ccbdaf";
TITLE_FONT_SIZE = 45;
BLOCK_FONT_SIZE = 60;
ARROW_LEFT = "ArrowLeft";
ARROW_RIGHT = "ArrowRight";
ARROW_UP = "ArrowUp";
ARROW_DOWN = "ArrowDown";



// GLobal Utility Functions
rand_int = function (a, b) {
    return a + Math.floor(Math.random() * (b + 1 - a));
}
rand_choice = function (arr) {
    if (arr.length >= 1) {
        return arr[rand_int(0, arr.length - 1)];
    }
    else {
        return []
    }
}
get_block_color = function (content) {
    switch (content) {
        case 2 ** 1:
            block_color = "#f1e4d8";
            block_font_color = "#756d62";
            break;
        case 2 ** 2:
            block_color = "#eedcc2";
            block_font_color = "#756d62";
            break;
        case 2 ** 3:
            block_color = "#ffaf71";
            block_font_color = "#ffffff";
            break;
        case 2 ** 4:
            block_color = "#ff9059";
            block_font_color = "#ffffff";
            break;
        case 2 ** 5:
            block_color = "#ff7653";
            block_font_color = "#ffffff";
            break;
        case 2 ** 6:
            block_color = "#ff4d29";
            block_font_color = "#ffffff";
            break;
        case 2 ** 7:
            block_color = "#f3cd62";
            block_font_color = "#ffffff";
            break;
        case 2 ** 8:
            block_color = "#81cd43";
            block_font_color = "#ffffff";
            break;
        case 2 ** 9:
            block_color = "#64bdfd";
            block_font_color = "#ffffff";
            break;
        case 2 ** 10:
            block_color = "#00a9cc";
            block_font_color = "#ffffff"
            break;
        case 2 ** 11:
            block_color = "#c3a3d4";
            block_font_color = "#ffffff";
            break;
        default:
            block_color = "#ccbdaf";
            block_font_color = "#444444";
            break;
    }

    return [block_color, block_font_color];

}


// Model
class GameModel {
    constructor() {
        this.data = [];
        this.init_data();
    }

    init_data() {
        this.data = [];
        for (let row_index = 0; row_index < BLOCK_COUNT; row_index++) {
            let row_tmp = [];
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                row_tmp.push(null);
            }
            this.data.push(row_tmp);
        }
        // first start game, 2 blocks shown
        this.gen_new_block();
        this.gen_new_block();
    }

    trans_data() {
        for (let row_index = 0; row_index < BLOCK_COUNT; row_index++) {
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                const tmp = this.data[row_index][col_index];
                this.data[row_index][col_index] = this.data[col_index][row_index];
                this.data[col_index][row_index] = tmp;
            }
        }
    }

    gen_new_block() {
        let null_content_locations = [];
        for (let row_index = 0; row_index < BLOCK_COUNT; row_index++) {
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                if (this.data[row_index][col_index] == null) {
                    null_content_locations.push([row_index, col_index]);
                }
            }
        }

        let location = rand_choice(null_content_locations);
        if (location.length == 2) {
            this.data[location[0]][location[1]] = 2;
        }
    }

    fusion_row(row, reverse = false) {
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
        //             *head += 1 && *tail += 1

        let head = 0;
        let tail = 1;
        let incr = 1;

        if (reverse == true) {
            head = row.length - 1;
            tail = head - 1;
            incr = -1;
        }

        while (0 <= tail && tail < row.length) {
            if (row[tail] == null) {
                tail += incr;
            }
            else {
                if (row[head] == null) {
                    row[head] = row[tail];
                    row[tail] = null;
                    tail += incr;
                }
                else {
                    if (row[head] == row[tail]) {
                        row[head] *= 2;
                        row[tail] = null;
                        tail += incr;
                        head += incr;
                    }
                    else {
                        head += incr;
                        tail += incr;
                    }
                }
            }
        }
    }

    fusion_batch(event_key) {
        let reverse = (event_key == ARROW_RIGHT || event_key == ARROW_DOWN);
        let valid_flag = true;
        if (event_key == ARROW_LEFT || event_key == ARROW_RIGHT) {
            for (let row of this.data) {
                this.fusion_row(row, reverse);
            }
        }
        else if (event_key == ARROW_UP || event_key == ARROW_DOWN) {
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                let tmp = [];
                for (let row_index = 0; row_index < BLOCK_COUNT; row_index++) {
                    tmp.push(this.data[row_index][col_index]);
                }
                this.fusion_row(tmp, reverse);
                for (let row_index = 0; row_index < BLOCK_COUNT; row_index++) {
                    this.data[row_index][col_index] = tmp[row_index];
                }
            }
        }
        else {
            valid_flag = false;
        }

        return valid_flag;
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

        let location_top = row_index * BLOCK_PADDING_SIZE + (row_index - 1) * BLOCK_SIZE
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
        for (let row_index = 0; row_index < BLOCK_COUNT; row_index++) {
            for (let col_index = 0; col_index < BLOCK_COUNT; col_index++) {
                let new_location = this.block_num_to_location(row_index + 1, col_index + 1);
                let new_content = this.data[row_index][col_index];
                let block_color_options = get_block_color(new_content);
                if (new_content != null) {
                    this.draw_block(new_location, new_content, block_color_options[1]);
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

    draw_block(location, content, font_color) {
        let block_options = get_block_color(content);
        let block = this.draw_bkg_block(location, block_options[0]);

        let span = document.createElement("span");
        let text = document.createTextNode(content);
        span.appendChild(text);

        span.style.fontFamily = '"Archivo Black", sans-serif';
        span.style.fontSize = BLOCK_FONT_SIZE;
        span.style.color = font_color;
        span.style.position = "relative";
        span.style.textAlign = "center";
        span.style.top = (BLOCK_SIZE - span.offsetHeight) / 4;

        block.appendChild(span);
    }

}


title = document.getElementById("title");
title.style.fontFamily = '"Archivo Black", sans-serif';
title.style.fontSize = TITLE_FONT_SIZE;
// Controller
game_model = new GameModel();
game_container = document.getElementById("game_container");
game_view = new GameView(game_model.data, game_container);
game_view.draw_game();


document.onkeydown = function (event) {
    let valid_flag = game_model.fusion_batch(event.key);
    if (valid_flag == true) {
        game_model.gen_new_block();
        game_view.draw_game();
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
    static test_fusion_row() {
        let game_model = new GameModel();
        let test_cases = [
            [[2, null, 4, null], [2, 4, null, null]],
            [[null, null, null, null], [null, null, null, null]],
            [[2, 2, 2, 2], [4, 4, null, null]],
            [[2, 2, null, null], [4, null, null, null]],
            [[4, 4, 4, null], [8, 4, null, null]],
            [[2, null, 4, null], [2, 4, null, null]],
            [[2, 2, 4, 4], [4, 8, null, null]],
            [[2, 8, null, null], [2, 8, null, null]],
            [[2, 8, 2, null], [2, 8, 2, null]],
            [[2, 16, 4, null], [2, 16, 4, null]],
            [[4, 8, 4, 2], [4, 8, 4, 2]],
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
                console.log("Error!", input_origin, input, output);
            }
        }

        if (!errFlag) {
            console.log("Pass ^_^");
        }
    }
}

// UnitTest.test_fusion_row()
