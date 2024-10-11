let sound; // sound line
let isInitialised; 
let isLoaded = false;
let amplitude;
let amplitudes = [];

let fft;
let clicked = true;
let bx;
let by;
let updown;
let count = 0;
let miss = 0;
let r;

function preload()
{
    soundFormats('mp3', 'wav'); // audio formats
    sound = loadSound('audio.mp3', () =>{
        console.log("sound is loaded!"); // load the music and print in the console
        isLoaded = true;
    });
    isInitialised = false; 
    sound.setVolume(0.2); // set volume 20%
}

function setup()
{
    createCanvas(1024, 1024);
    textAlign(CENTER);
    textSize(32);
    
    amplitude = new p5.Amplitude();
    
    for (let i = 0; i < 512; i++)
        amplitudes.push(0);
    
    fft = new p5.FFT();
}

function draw()
{
    background(0);
    fill(255);
    
    if (isInitialised && !sound.isPlaying())
        text("Press any key for play sound", width/2, height/2); // mini rulebook before the game start
    else if (sound.isPlaying())
    {
        // music playing logic
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text('Press Z on yellow circles to get points!', width/2, 40); // rules above the game field
        noStroke();

        osu();  // maing game
    }  
}

function keyPressed() // starting the code
{
    if (!isInitialised)
    {
        isInitialised = true;
        
        r = map(mouseX, 0, width, 0.5, 4.0); // r - the speed of the sound, that depends on the mouse position by X
        if (isLoaded)
            sound.play(0, r);
    }
    else
    {
        if (key == ' ')
        {
            if (sound.isPaused())   sound.play();
            else                    sound.pause();
        }
    }
}

// main function with the game
function osu()
{       
    // drawing main circles
    let energy = fft.getEnergy("bass"); // bass circles
    fill("#FF0000");
    circle(125, height/2 - energy * 2, 50, 50);
    circle(125, height/2 + energy * 2, 50, 50);
    
    let low_energy = fft.getEnergy("lowMid"); // lowmid circles
    fill("#FF0000");
    circle(325, height/2 - low_energy * 2, 50, 50);
    circle(325, height/2 + low_energy * 2, 50, 50);
    
    let mid_energy = fft.getEnergy("mid"); // mid circles
    fill("#FF0000");
    circle(525, height/2 - mid_energy * 2, 50, 50);
    circle(525, height/2 + mid_energy * 2, 50, 50);

    let high_energy = fft.getEnergy("highMid"); // highmid circles
    fill("#FF0000");
    circle(725, height/2 - high_energy * 2, 50, 50);
    circle(725, height/2 + high_energy * 2, 50, 50);
      
    let treble_energy = fft.getEnergy("treble"); // treble circles
    fill("#FF0000");
    circle(925, height/2 - treble_energy * 2, 50, 50);
    circle(925, height/2 + treble_energy * 2, 50, 50);

    let energies = [energy, low_energy, mid_energy, high_energy, treble_energy]; //all types of circles for loop
    
    // current mouse position
    let px = mouseX;
    let py = mouseY;
    
    // statistics
    fill("#FFFF00");
    text("Touches: " + count, 100, 50); // all number of touches
    text("Rate: " + parseFloat(r).toFixed(2), 100, 100); // the speed of the music
    text("Score: " + Math.floor(count*r), 100, 150); // the points depend on the speed
    
    // game logic
    if (clicked == true){    // making parameters for new circle
        by = Math.floor(Math.random() * 4);
        bx = 125 + 200 * by;
        if (Math.random()>0.5){
            updown = 1;
        }else{
            updown = -1;
        }
        clicked = false;
    }
    
    // cheching if the player hit the yellow circle
    if ((clicked == false) && (key == 'z') && (px > (bx - 25)) && (px < (bx + 25)) && (py > (height/2 + updown * energies[by] * 2)-25) && (py < (height/2 + updown * energies[by] * 2)+25)){
        clicked = true;
        count++;  
    }
    
    // change the next circle
    fill("#FFFF00");
    circle(bx, height/2 + updown * energies[by] * 2, 50, 50);
    key = 'x'; // key for the fix
}
