let sound; // Переменная где будет находится аудио-дорожка
let isInitialised; // Состояние, которое обозначает инициализированы ли значения или нет
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
    soundFormats('mp3', 'wav'); // Определяем аудио форматы, поддерживаемые плеером
    sound = loadSound('audio.mp3', () =>{
        console.log("sound is loaded!"); // Загружаем музыку и при успешной загрузке выводим в консоль сообщение, что музыка загрузилась
        isLoaded = true;
    });
    isInitialised = false; 
    sound.setVolume(0.2); // Устанавливаем громкость на 20%
}

function setup()
{
    createCanvas(1024, 1024);
    textAlign(CENTER); // Центрируем следующий текст по центру
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
        text("Press any key for play sound", width/2, height/2);
    else if (sound.isPlaying())
    {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text('Press Z on yellow circles to get points!', width/2, 40);
        
        let freqs = fft.analyze();
        noStroke();

        osu();  
    }  
}

function keyPressed()
{
    if (!isInitialised)
    {
        isInitialised = true;
        
        r = map(mouseX, 0, width, 0.5, 4.0); // r - скорость воспроизведения звука, которую мы расчитываем в зависимость от положения мыши по x. Чем правее - тем быстрее запускается воспроизведение
        if (isLoaded)
            sound.play(0, r); // loop - функция для зацикливания. 0 -  откуда начинается зацикливание по времени r - rate - playback rate
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

function osu()
{       
    let energy = fft.getEnergy("bass");
    fill("#FF0000");
    circle(125, height/2 - energy * 2, 50, 50);
    circle(125, height/2 + energy * 2, 50, 50);
    
    let low_energy = fft.getEnergy("lowMid");
    fill("#FF0000");
    circle(325, height/2 - low_energy * 2, 50, 50);
    circle(325, height/2 + low_energy * 2, 50, 50);
    
    let mid_energy = fft.getEnergy("mid");
    fill("#FF0000");
    circle(525, height/2 - mid_energy * 2, 50, 50);
    circle(525, height/2 + mid_energy * 2, 50, 50);

    let high_energy = fft.getEnergy("highMid"); 
    fill("#FF0000");
    circle(725, height/2 - high_energy * 2, 50, 50);
    circle(725, height/2 + high_energy * 2, 50, 50);
      
    let treble_energy = fft.getEnergy("treble");
    fill("#FF0000");
    circle(925, height/2 - treble_energy * 2, 50, 50);
    circle(925, height/2 + treble_energy * 2, 50, 50);

    let energies = [energy, low_energy, mid_energy, high_energy, treble_energy];
    
    let px = mouseX;
    let py = mouseY;
    
    fill("#FFFF00");
    text("Touches: " + count, 100, 50);
    text("Rate: " + parseFloat(r).toFixed(2), 100, 100);
    text("Score: " + Math.floor(count*r), 100, 150);
    
    if (clicked == true){    
        by = Math.floor(Math.random() * 4);
        bx = 125 + 200 * by;
        if (Math.random()>0.5){
            updown = 1;
        }else{
            updown = -1;
        }
        clicked = false;
    }
    
    if ((clicked == false) && (key == 'z') && (px > (bx - 25)) && (px < (bx + 25)) && (py > (height/2 + updown * energies[by] * 2)-25) && (py < (height/2 + updown * energies[by] * 2)+25)){
        clicked = true;
        count++;  
    }
    
    fill("#FFFF00");
    circle(bx, height/2 + updown * energies[by] * 2, 50, 50);
    key = 'x';
}
