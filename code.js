getPyramid(10,100);

const mySetting = {title: "settingTitle",worlds: []}; //an array of Worlds with their populations
const basePopulation = 100000000;
const basePantheon = 110;
const world = {title: "worldTitle",population: basePopulation,continents: [],tags: []}
const continent = {title: "continentTitle",population: 0,kingdoms: [],linkedTags: [],tags: []}
const mapTypes = ["world","continent","subcontinent","kingdom","province"]

let primaryWorld = {title: "primaryWorld", type: "world",population: 100000000, continent: [],tags: ["primaryWorld","materialPlane"]}; //in the future, I should call the submaps "submaps" with a mapType property, rather than naming each one differently
primaryWorld.continent[0] = {title: "Capalon", population: 3630424, assigned: true}
primaryWorld.continent[1] = {title: "continent1", population: 8363473, assigned: false}
primaryWorld.continent[2] = {title: "continent2", population: 5975046, assigned: false}
primaryWorld.continent[3] = {title: "continent3", population: 7911199, assigned: false}
primaryWorld.continent[4] = {title: "continent4", population: 3631948, assigned: false}
primaryWorld.continent[5] = {title: "continent5", population: 4495935, assigned: false}
primaryWorld.continent[6] = {title: "continent6", population: 7403132, assigned: false}
primaryWorld.continent[7] = {title: "Elmanor", population: 19136631, assigned: true}
primaryWorld.continent[8] = {title: "continent8", population: 4048694, assigned: false}
primaryWorld.continent[9] = {title: "continent9", population: 35403518, assigned: true}

let capalon = {title:"Capalon",type: "continent",population:3630424,subcontinent:[{title:"kingdom0",population:123854,assigned:false},{title:"kingdom1",population:550074,assigned:false},{title:"kingdom2",population:338225,assigned:false},{title:"kingdom3",population:6407,assigned:false},{title:"kingdom4",population:137713,assigned:false},{title:"kingdom5",population:54169,assigned:false},{title:"kingdom6",population:385251,assigned:false},{title:"kingdom7",population:589219,assigned:false},{title:"kingdom8",population:209784,assigned:false},{title:"kingdom9",population:96837,assigned:false},{title:"kingdom10",population:336755,assigned:false},{title:"kingdom11",population:591916,assigned:false},{title:"kingdom12",population:210220,assigned:false}],linkedTags: primaryWorld.tags,tags:["Capalon"]}
let elmanor = {title:"Elmanor",type: "continent",population:19136631,subcontinent:[{title:"kingdom0",population:70944,assigned:false},{title:"kingdom1",population:2739588,assigned:false},{title:"kingdom2",population:2746923,assigned:false},{title:"kingdom3",population:201318,assigned:false},{title:"kingdom4",population:1826820,assigned:false},{title:"kingdom5",population:1925773,assigned:false},{title:"kingdom6",population:508181,assigned:false},{title:"kingdom7",population:2992805,assigned:false},{title:"kingdom8",population:859184,assigned:false},{title:"kingdom9",population:2188972,assigned:false},{title:"kingdom10",population:1266693,assigned:false},{title:"kingdom11",population:193909,assigned:false},{title:"kingdom12",population:1615521,assigned:false}],linkedTags:["primaryWorld","materialPlane"],tags:["Elmanor"]}

let places = {}//{mainWorld: primaryWorld,firstContinent: elmanor,test: "The test worked."};

function createWorld(name,population=0,numOfContinents=0) {
    let newWorld = {};
    newWorld.title = name;
    newWorld.population = population || basePopulation;
    continentArray= [];
    continentCount = numOfContinents || randomIntBetween(8,20);
    let remainingPopulation = newWorld.population;
    for (let i=0;i<continentCount;i++) {
        let thisContinent = {};
        thisContinent.title = `continent${i}`;
        if (i===continentCount-1){
            thisContinent.population = remainingPopulation;
        } else {
            thisContinent.population = Math.round(remainingPopulation/((continentCount-i)/2) * Math.random());
        }
        remainingPopulation = remainingPopulation-thisContinent.population;
        continentArray = [...continentArray,thisContinent];
    }
    newWorld.continent = continentArray;
    console.log(JSON.stringify(newWorld));
    return newWorld;
}

function createContinent(name,world,existingContinentNum,numOfKingdoms=0) {
    let newContinent = {};
    newContinent.title = name;
    newContinent.population = world.continents[existingContinentNum].population;
    kingdomArray= [];
    kingdomCount = numOfKingdoms || randomIntBetween(6,14);
    let remainingPopulation = newContinent.population;
    for (let i=0;i<kingdomCount;i++) {
        let thisKingdom = {};
        thisKingdom.title = `kingdom${i}`;
        if (i===kingdomCount-1){
            thisKingdom.population = remainingPopulation;
        } else {
            thisKingdom.population = Math.round(remainingPopulation/((kingdomCount-i)/2) * Math.random());
        }
        remainingPopulation = remainingPopulation-thisKingdom.population;
        thisKingdom.assigned = false;
        kingdomArray = [...kingdomArray,thisKingdom];
    }
    newContinent.kingdoms = kingdomArray;
    newContinent.linkedTags = world.tags;
    newContinent.tags = [name];
    world.continents[existingContinentNum].title = name;
    world.continents[existingContinentNum].assigned = true;
    console.log(JSON.stringify(newContinent));
    return newContinent;
}

function createPlace(name,numOfSubMaps=0,population=basePopulation,parentMap="",placeReference="") { //place reference is the array index of the submap that you want to use
    let newPlace = {};
    newPlace.title = name;
    newPlace.type = parentMap ? mapTypes[mapTypes.indexOf(parentMap.type)+1] : "world";
    let thisPlaceReference; 
    if (placeReference) {
        thisPlaceReference = placeReference;
    } else {
        let freePlaces = filterPlaces(parentMap[newPlace.type],"assigned",false);
        let highestReference = searchPopulation(freePlaces,"greatest");
        placeReference = freePlaces[highestReference].title.slice(-1);
    }
    newPlace.population = newPlace.type==="world" ? population : parentMap[newPlace.type][placeReference].population;
    //need to add the code to create the submaps and tags, then be sure to add the code that changes the submap title and assigned status on the parent map
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
    places = JSON.parse(txt)
    console.log("Places imported, see below.");
    console.log(places);
}