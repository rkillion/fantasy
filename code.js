const mySetting = {title: "settingTitle",worlds: []}; //an array of Worlds with their populations
const basePopulation = 100000000;
const basePantheon = 110;
const world = {title: "worldTitle",population: basePopulation,continents: [],tags: []}
const continent = {title: "continentTitle",population: 0,kingdoms: [],linkedTags: [],tags: []}
const mapTypes = ["world","continent","subcontinent","kingdom","province"]
const gridMapFrameHeight = 601;
const gridMapFrameWidth = 1201;

let gridUnitChangeColor = "lightblue";

let places = {};
let placeHandles;

//create a function paired with a button on the page, then you can write your code in that function and run it after you load the places
function runButtonFunction() {
    generateGrid();
}

function createPlace(name,handle,numOfSubMaps=0,population=basePopulation,parentMap="",placeReference="",tags=[]) { //place reference is the array index of the submap that you want to use
    let newPlace = {};
    newPlace.title = name;
    if(parentMap) {newPlace.parentMap = parentMap.title};
    newPlace.type = parentMap ? mapTypes[mapTypes.indexOf(parentMap.type)+1] : "world";
    let thisPlaceReference; 
    if (placeReference || newPlace.type==="world") {
        thisPlaceReference = placeReference;
    } else {
        let freePlaces = filterPlaces(parentMap.subMap,"assigned",false);
        let highestReference = searchPopulation(freePlaces,"greatest");
        thisPlaceReference = freePlaces[highestReference].title.slice(-1);
    }
    newPlace.population = newPlace.type==="world" ? population : parentMap.subMap[thisPlaceReference].population;
    let submapArray = [];
    subMapCount = numOfSubMaps || randomIntBetween(6,18);
    let remainingPopulation = newPlace.population;
    for (let i=0;i<subMapCount;i++) {
        let thisSubMap = {};
        thisSubMap.title = `${mapTypes[mapTypes.indexOf(newPlace.type)+1]}${i}`;
        thisSubMap.type = mapTypes[mapTypes.indexOf(parentMap.type)+1]
        if (i===subMapCount-1){
            thisSubMap.population = remainingPopulation;
        } else {
            thisSubMap.population = Math.round(remainingPopulation/((subMapCount-i)/2) * Math.random());
        }
        remainingPopulation = remainingPopulation-thisSubMap.population;
        thisSubMap.assigned = false;
        submapArray = [...submapArray,thisSubMap];
    }
    newPlace.subMap = submapArray;
    newPlace.tags = [...tags,name,handle];
    if(parentMap) {parentMap.subMap[thisPlaceReference].title = newPlace.title;}
    if(parentMap) {parentMap.subMap[thisPlaceReference].assigned = true;}
    places = {...places,[handle]: newPlace};
    return newPlace;
}

function filterPlaces(arrayOfPlaces,key,value) { // filters for items that match that value
    let returnArray = [];
    for (const place of arrayOfPlaces) {
        if (place[key]===value) {
            returnArray=[...returnArray,place];
        }
    }
    return returnArray;
}

function searchPopulation(arrayOfPlaces,rule) {
    let answer;
    switch (rule) {
        case "greatest" :
            answer = 0;
            for (const place of arrayOfPlaces) {
                if (place.population>arrayOfPlaces[answer].population) {
                    answer=arrayOfPlaces.indexOf(place);
                }
            }
            break;
    }
    return answer;
}

function randomIntBetween(start,end) {
    return Math.round((end-start)*Math.random())+start;
}

function getPyramid(numOfLevels,totalValue) {
    let items = 0;
    for (let i=1;i<=numOfLevels;i++) {
        items+=i;
    }
    let x = totalValue/items;
    for (let i=1;i<=numOfLevels;i++) {
        let thisLevel = i*x
        console.log(`${Math.round(thisLevel)}% and ${Math.round(thisLevel*1.1)}`);
    }
}

function checkPopulation(aWorld){
    let total=0;
    for(const element of aWorld.continents){
        total = total + element.population;
}
    return total;
}

function subMapDimensionsFromGenerated(map,percentToUse,height=2000,width=4000,subMapType="continents") {
    return Math.round((width*height)*(percentToUse/100)*(1/map[subMapType].length))
}

//---------GRID MAP
let changeColorOnMouseOver = false;

function generateGrid() {
    for (let p=1;p<=60;p++){
    for (let i=1;i<=120;i++) {
    let gridUnit = document.createElement("div");
    gridUnit.id = `${p}-${i}`;
    gridUnit.style.left=`${(i-1)*10}px`;
    gridUnit.style.top=`${(p-1)*10}px`;
    gridUnit.style.display= "block";
    gridUnit.style.position="absolute";
    gridUnit.style.border = "1px solid grey";
    gridUnit.style.background = "lightblue";
    gridUnit.style.borderLeft = "0px";
    gridUnit.style.borderTop = "0px";
    gridUnit.style.height = "9px";
    gridUnit.style.width = "9px";
    gridUnit.addEventListener("mousedown", function() {changeColorOnMouseOver=true});
    gridUnit.addEventListener("mouseup",function() {changeColorOnMouseOver=false});
    gridUnit.addEventListener("mouseover",mouseoverGridBoxColor);
    gridUnit.addEventListener("click",changeGridBoxColor);
    document.getElementById("gridMapFrame").appendChild(gridUnit);
    }}
}

function changeGridBoxColor(event) {
    let thisGridBox = event.target;
    thisGridBox.style.background = gridUnitChangeColor;
}

function mouseoverGridBoxColor(event) {
    if(changeColorOnMouseOver) {
        let thisGridBox = event.target;
        thisGridBox.style.background = gridUnitChangeColor;
    }
}

function loadMap() {
    let map = document.getElementById("mapHandleInput").value;
    for (let p=1;p<=60;p++){
        for (let i=1;i<=120;i++) {
            let thisGridUnit = document.getElementById(`${p}-${i}`);
            thisGridUnit.style.background = places[map].grid[`${p}-${i}`];
        }
    }
}

function saveMap() {
    let map = document.getElementById("mapHandleInput").value;
    let thisMap = {};
    for (let p=1;p<=60;p++){
        for (let i=1;i<=120;i++) {
            let thisGridUnit = document.getElementById(`${p}-${i}`);
            thisMap[`${p}-${i}`] = thisGridUnit.style.background;
        }
    }
    places[map].grid = thisMap;
}

function drawSea() {
    clearButtons();
    gridUnitChangeColor = "lightblue";
    document.getElementById("seaButton").style.background = "lightgreen";
}

function drawLand() {
    clearButtons();
    gridUnitChangeColor = "green";
    document.getElementById("landButton").style.background = "lightgreen";
}

function clearButtons() {
    let drawButtons = document.getElementsByClassName("drawButton");
    for (const element of drawButtons) {
        element.style.background = "lightcyan";
    }
}
//---------FILE SAVER


function saveStaticDataToFile() {
    var blob = new Blob([JSON.stringify(places)],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, "places.txt");
}

var reader; //GLOBAL File Reader object for demo purpose only

/**
* Check for the various File API support.
*/
function checkFileAPI() {
    generateGrid();
if (window.File && window.FileReader && window.FileList && window.Blob) {
    reader = new FileReader();
    return true; 
} else {
    alert('The File APIs are not fully supported by your browser. Fallback required.');
    return false;
}
}

/**
* read text input
*/
function readText(filePath) {
var output = ""; //placeholder for text output
if(filePath.files && filePath.files[0]) {           
    reader.onload = function (e) {
        output = e.target.result;
        loadPlaces(output);
    };//end onload()
    reader.readAsText(filePath.files[0]);
}//end if html5 filelist support
else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
    try {
        reader = new ActiveXObject("Scripting.FileSystemObject");
        var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
        output = file.ReadAll(); //text contents of file
        file.Close(); //close file "input stream"
        loadPlaces(output);
    } catch (e) {
        if (e.number == -2146827859) {
            alert('Unable to access local files due to browser security settings. ' + 
             'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
             'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
        }
    }       
}
else { //this is where you could fallback to Java Applet, Flash or similar
    return false;
}       
return true;
}   

function loadPlaces(txt) {
    places = JSON.parse(txt);
    placeHandles = Object.keys(places);
    autocomplete(document.getElementById("mapHandleInput"), placeHandles);
    console.log("Places imported, see below.");
    console.log(places);
}

//--------Auto Complete Input

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }