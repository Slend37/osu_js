let sound; // var for audio
let isInitialised; // initialized audio or not
let isLoaded = false;
let amplitude; // for waves
let amplitudes = []; // for waves
let fft; // for waves
let clicked = true; // for game, is the circle clicked or not
let bx; // circle position
let by; // circle position
let updown; // the 'stage' of the yellow circle
let count = 0; // counting touches
let miss = 0; // not available now
let r; // audio speed
let loops = 0; // for checking when song was started and already finished
let RatingData; // data with the records
let cmax = 0; // max score in data


function preload()
{
    RatingData = loadTable('rating.csv', 'csv', 'header'); // loading data
    soundFormats('mp3', 'wav'); // formats that are okay
    sound = loadSound('audio.mp3', () =>{
        console.log("sound is loaded!"); // music loading and pushing in console if it is true
        isLoaded = true;
    });
    isInitialised = false; 
    sound.setVolume(0.2); // volume - 20%
    
}

function setup()
{
    createCanvas(1024, 1024);
    textAlign(CENTER);
    textSize(32);
    
    // for waves that contain circles
    amplitude = new p5.Amplitude();
    
    for (let i = 0; i < 512; i++)
        amplitudes.push(0);
    
    fft = new p5.FFT();
    
    // creating the scale to choose the speed mode
    rate_slider = createSlider(0.5, 5, 1, 0.1);
    rate_slider.position(width / 2 - 50, height / 2 + 100);
    
    // counting max score in data
    let max_score = RatingData.getColumn("score");
    for (var i = 0; i < max_score.length; i++){
        if (max_score[i] > cmax){
            cmax = max_score[i];
        }
    }
}

function draw()
{
    cursor("https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSIYhY_9XEDYOMNRBsMoGuuOgceXob50kaxV_PHjMO1MHaEqgEgoNamuha2GU-jncTiqXcC7ff7OfZrdvWQDz7Flrp3teMxFyjgxUtx42XRmNr9bzvJOdmnyEaK/96fx96fdpx2x", 48, 48);
    background(0);
    fill(255);
    text("Speed rate: " + rate_slider.value(), width / 2, height / 2 + 50); // choosing the speed
    
    if (isInitialised && !sound.isPlaying() && !sound.isPaused()){
        if (loops > 0){ // if the game was finished
            let newRow = RatingData.addRow(); // new row in data
            newRow.setString('duration', sound.duration() / r); // set the duration of the song
            newRow.setString('score', Math.floor(count * r * 1000 / sound.duration())); // set the score that was just made
            loops = 0; // reset loops to not spam
            save(RatingData, "rating.csv"); // saving new data
        }
        text("Choose the speed and press P", width / 2, height / 2);
        rate_slider.position(width / 2 - 50, height / 2 + 100);
    }
    else if (sound.isPlaying())
    {
        // making waves
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text('Press Z and X on yellow circles to get points!', width / 2, 40);
        rate_slider.position(1500, 1500);
        
        let freqs = fft.analyze();
        noStroke();

        // game code
        osu();  
    }  
}

function keyPressed()
{
    if (!isInitialised)
    {
        isInitialised = true;
        loops += 1;
        console.log("loops was added");
        
        r = rate_slider.value();
        if (isLoaded)
            sound.play(0, r); // starting the music with the setted speed
    }
    else
    {
        if (key == 'p')
        {
            if (!sound.isPlaying()){ // starting next try
                if (cmax < Math.floor(count * r * 1000 / sound.duration())){
                    cmax = Math.floor(count * r * 1000 / sound.duration()); // checking was the record updated or not
                }
                else{
                    count = 0; // reset touches
                    r = rate_slider.value(); // set new music speed
                    sound.play(0, r); // here we go
                }
            }
            else{
                sound.pause();
            }
        }
    }
}

function osu()
{       
    // vertical lines with circles
    let energy = fft.getEnergy("bass");
    fill("#FF0000");
    circle(125, height / 2 - energy * 2, 50, 50);
    circle(125, height / 2 + energy * 2, 50, 50);
    
    let low_energy = fft.getEnergy("lowMid");
    fill("#FF0000");
    circle(325, height / 2 - low_energy * 2, 50, 50);
    circle(325, height / 2 + low_energy * 2, 50, 50);
    
    let mid_energy = fft.getEnergy("mid");
    fill("#FF0000");
    circle(525, height / 2 - mid_energy * 2, 50, 50);
    circle(525, height / 2 + mid_energy * 2, 50, 50);

    let high_energy = fft.getEnergy("highMid"); 
    fill("#FF0000");
    circle(725, height / 2 - high_energy * 2, 50, 50);
    circle(725, height / 2 + high_energy * 2, 50, 50);
      
    let treble_energy = fft.getEnergy("treble");
    fill("#FF0000");
    circle(925, height / 2 - treble_energy * 2, 50, 50);
    circle(925, height / 2 + treble_energy * 2, 50, 50);

    let energies = [energy, low_energy, mid_energy, high_energy, treble_energy];
    
    // getting mouse coordinates to check was the circle clicked or not
    let px = mouseX;
    let py = mouseY;
    
    // live stats
    fill("#FFFF00");
    text("Touches: " + count, 100, 50);
    text("Score: " + Math.floor(count * r * 1000 / sound.duration()), 100, 100);
    text("Goal: " + cmax, 100, 150);
    
    // random position for the next circle
    if (clicked == true){    
        by = Math.floor(Math.random() * 4);
        bx = 125 + 200 * by;
        if (Math.random() > 0.5){
            updown = 1;
        }else{
            updown = -1;
        }
        clicked = false;
    }
    // checking if the yellow circle was clicked
    if ((clicked == false) && ((key == 'z') || (key == 'я') || (key == 'x') || (key == 'ч')) && (px > (bx - 25)) && (px < (bx + 25)) && (py > (height / 2 + updown * energies[by] * 2) - 25) && (py < (height / 2 + updown * energies[by] * 2) + 25)){
        clicked = true;
        count++;  
    }
    
    // new circle spawn
    fill("#FFFF00");
    circle(bx, height / 2 + updown * energies[by] * 2, 50, 50);
    key = 'c'; // reset the pressed key to disallow bugs with spamming
}
