let move_speed = 6, gravity = 0.4;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_start = new Audio('sounds effect/Gamestart.mp3');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let bird_dy = 0; // vertical velocity for the bird

// global key handlers (add once)
document.addEventListener('keydown', (e) => {
    if ((e.key == 'ArrowUp' || e.key == ' ' || e.code == 'Space') && game_state == 'Play'){
        img.src = 'images/Bird-5.png';
        bird_dy = -7.6;
    }
});

document.addEventListener('keyup', (e) => {
    if ((e.key == 'ArrowUp' || e.key == ' ' || e.code == 'Space') && game_state == 'Play'){
        img.src = 'images/Bird-1.png';
    }
});

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    
    if(e.key == 'Enter' && game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        // re-calculate element rects in case layout changed
        bird_props = bird.getBoundingClientRect();
        background = document.querySelector('.background').getBoundingClientRect();

        img.src = 'images/Bird-1.png';
        img.style.display = 'block';
        bird.style.top = '40vh';
        bird_dy = 0;
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        sound_start.play();
        play();
    }
});

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = '<span style="color:red;">Game Over</span><br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.src = 'images/Bird-3.png';
                    sound_die.play();
                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML = Number(score_val.innerHTML) + 1;
                        element.increase_score = '0';
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity(){
        if(game_state != 'Play') return;
        // update current rect first
        bird_props = bird.getBoundingClientRect();

        bird_dy = bird_dy + gravity; // gravity applied to velocity

        // compute next position
        let next_top = bird_props.top + bird_dy;
        let next_bottom = bird_props.bottom + bird_dy;

        if(next_top <= 0 || next_bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }
        bird.style.top = next_top + 'px';
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;

    let pipe_gap = 35;

    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}
