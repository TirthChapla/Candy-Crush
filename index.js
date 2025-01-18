
var candies = ["Blue","Orange","Green","Yellow","Red","Purple"];

var board = [];

var row =9;
var column = 9;

var score = 0;

var currTile;
var otherTile;

window.onload = function()
{
    startGame();
    playBackgroundMusic();
    //after every 100ms it will call this function
    window.setInterval(function()
    {
        crushCandy();
        slideCandy();
        generateCandy();
    },100)
}


function playBackgroundMusic() {
    var audio = document.getElementById("background-music");
    audio.volume = 0.5; // Set volume to 50%

    function startMusic() 
    {
        audio.play().catch(function (error) {
            console.log("Autoplay was prevented. Click anywhere on the page to start the music.");
        });
        document.body.removeEventListener('click', startMusic); // Remove event listener after playing
    }

    // If music was playing before the refresh, attempt to play
    if (localStorage.getItem("musicPlaying") === "true") {
        startMusic();
    }

    // Add a click event listener to play music on user interaction
    document.body.addEventListener('click', startMusic);

    // Update localStorage when the music state changes
    audio.addEventListener('play', function () {
        localStorage.setItem("musicPlaying", "true");
    });

    audio.addEventListener('pause', function () {
        localStorage.setItem("musicPlaying", "false");
    });
}


function randomCandy()
{
    // aaya aapde upper candy no array banayo ne ae ma the value return kar se 
    // 0 index pr blue che to ae aav se 
    return candies[Math.floor(Math.random()*candies.length)]; //range 0 to 5.99
}

function startGame()
{
    score = 0; // Initialize score to zero
    document.getElementById("score").innerText = score; // Update the score display
    for(var r=0; r<row ; r++)
    {
        let row = [];
        for (var c = 0; c < column; c++)
        {
            // <img id = 0 - 0>
            let tile = document.createElement("img");

            tile.id = r.toString() + "-" + c.toString();

            tile.src = "./images/"+randomCandy() +".png";
            

            //Drag Functionality 
            tile.addEventListener("dragstart",dragStart); // click on candy : inilize drag process
            tile.addEventListener("dragover",dragOver);//clicking on candy , moving move to drag the candy
            tile.addEventListener("dragenter",dragEnter);//draging candy to the another candy
            tile.addEventListener("dragleave",dragLeave);//leave the candy over another candy
            tile.addEventListener("drop",dragDrop);//droping a candy over another candies
            tile.addEventListener("dragend",dragEnd);//after drag process complerted , we swap candies


            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row)
    }
    console.log(board);
}

function dragStart()
{
    // this shows to the tile that was clicked on and dragging
    currTile = this;
}

function dragOver(e)
{
    e.preventDefault();
}

function dragEnter(e)
{
    e.preventDefault();
}

function dragLeave()
{
    
}

function dragDrop()
{
    //this is the tile on which we drop our tile
    otherTile = this;
}

function dragEnd()
{
    if(currTile.src.includes("blank") || otherTile.src.includes("blank"))
    {
        return; 
    }

    let currCords = currTile.id.split("-");
    let r = parseInt(currCords[0]);
    let c = parseInt(currCords[1]);


    let otherCords = otherTile.id.split("-");
    let r2 = parseInt(otherCords[0]);
    let c2 = parseInt(otherCords[1]);

    let moveLeft = c2 == c-1 && r ==r2;
    let moveright= c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjecent = moveLeft || moveright || moveUp || moveDown ;



    if (isAdjecent)
    {
        
        let validmove = checkValid();
        {
            if(!validmove)
            {
                let curImg = currTile.src;
                let otherImg = otherTile.src;
            
                currTile.src = otherImg;
                otherTile.src = curImg; 
            }
        }

    }

}

function crushCandy()
{
    crushThree();
    document.getElementById("score").innerText = score
}

function crushThree()
{
    //check for rows
    for(let r =0 ; r<row ; r++)
    {
        for(let c = 0 ; c < column-2 ; c++)
        {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank"))
            {
                candy1.src ="./images/blank.png";
                candy2.src ="./images/blank.png";
                candy3.src ="./images/blank.png";
                score += 3;
            }
        }
    }


    //check for column
    for(let c =0 ; c<column ; c++)
    {
        for(let r = 0 ; r <row-2 ; r++)
        {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank"))
            {
                candy1.src ="./images/blank.png";
                candy2.src ="./images/blank.png";
                candy3.src ="./images/blank.png";
                score += 3;
            }
        }
    }
}

function checkValid()
{
    //check for rows
    for(let r =0 ; r<row ; r++)
    {
        for(let c = 0 ; c < column-2 ; c++)
        {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];

            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank"))
            {
                return true;
            }
        }
    }
    
    
    //check for column
    for(let c =0 ; c<column ; c++)
    {
        for(let r = 0 ; r <row-2 ; r++)
        {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];

            if(candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank"))
            {
                return true;
            }
        }
    }
    return false;
}

function slideCandy() {
    for (let c = 0; c < column; c++) {
        let ind = row - 1;
        for (let r = row - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }
        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy()
{
     for(let c =0; c<column ; c++ )
     {
        if(board[0][c].src.includes("blank"))
        {
            board[0][c].src = "./images/"+randomCandy()+".png";
        }
     }
}