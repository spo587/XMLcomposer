
function MajorScale(tonic, quality) {
    //tonic as 0-11, 0=a major
    // quality is minor = 'm', major = 'M'
    //TODO: change it so it's indexed to c major, not a?
    // make so it works for c# major and f# major??
    this.quality = quality 
    this.tonic = tonic
    var tonicConverterforStep = {0: 'A', 1: 'B', 2: 'B', 3:'C', 4:'D', 5:'D', 6:'E', 7:'E', 8:'F', 10:'G',11:'A'}   
    if (quality == 'm')
        var temptonic = tonic + 3
    else var temptonic = tonic
    var step = tonicConverterforStep[temptonic]
    //use step variable and temptonic for the relative major to get steps and key signature
    this.step = tonicConverterforStep[this.tonic]
    var tonicConverterforFifthsCircle = {0: 3, 1: 10, 2: 5, 3:0, 4:7, 5:2, 6:9, 7:4, 8:11, 10:1, 11:8}
    this.fifthsCircle = tonicConverterforFifthsCircle[temptonic]
    var reversedict = {0: 'A', 2: 'B', 3:'C', 5:'D', 7:'E', 8:'F', 10:'G'}
    var notesList = ['A','B','C','D','E','F','G']
    var majorScaleArray = [0,2,4,5,7,9,11]
    var ind = notesList.indexOf(step)
    for (var i = 0; i<ind; i++){
        notesList.push(notesList.shift())  
    }
    this.stepNums = []
    this.stepNames = {}
    for (var i=0; i<7; i++)
        this.stepNums.push((majorScaleArray[i]+temptonic)%12)
    if (quality == 'm'){
        for (var i=0; i<5; i++){
            this.stepNums.push(this.stepNums.shift())
            notesList.push(notesList.shift())
            } 
        }   
    console.log(notesList)
    for (var i=0; i<7; i++) {
        //TODO: fix f# major and c# major bugs.
        if (!reversedict[this.stepNums[i]] && this.fifthsCircle <= 6)
            this.stepNames[i+1] = notesList[i] + '#'
        else if (!reversedict[this.stepNums[i]] && this.fifthsCircle > 6)
            this.stepNames[i+1] = notesList[i] + 'b'
        else
            this.stepNames[i+1] = reversedict[this.stepNums[i]]       
        }    
}


function NextStepDegree(currentScaleDegree) {
    //for five finger position only
    var randNum = Math.random()
    if (currentScaleDegree == 1)
        return randNum < 0.2 ? currentScaleDegree : currentScaleDegree+1
    else if (currentScaleDegree == 5)
        return randNum < 0.2 ? currentScaleDegree : currentScaleDegree-1
    else {
        if (randNum <= 0.4)
            return currentScaleDegree-1
        else if (0.4<randNum<0.6)
            return currentScaleDegree
        else return currentScaleDegree + 1
    }
}

function makeRhythms(numMeasures, beatsPer) {
    if (beatsPer == undefined)
        var beatsPer = 4
    // 4/4 time only
    var rhythms = [];
    for (var i=0; i<numMeasures; i++)
        rhythms.push([])
    var beat = 0;
    var measures = 0;
    while (measures < numMeasures-1) {
        if (beat > beatsPer-1) {
            beat = beat % beatsPer;
            measures += 1;
        }
        if (beat == 0 || beat == beatsPer%2) {
            randNum = Math.random();
            if (randNum < 0.5) {
                rhythms[measures].push(1);
                beat += 1;
            }
            else {
                rhythms[measures].push(2);
                beat += 2;
            }
        }
        else {
            rhythms[measures].push(1)
            beat += 1
        }
    }
    console.log(rhythms)
    return rhythms
}


function makeSteps(rhythms, rhythms_nested) {
    console.log(rhythms)
    console.log(rhythms_nested)

    var numnotes = rhythms.length

    var notes = [1]
    for (var i=1; i<numnotes; i++)
        notes.push(NextStepDegree(notes[i-1]))
    notes.reverse()
    console.log(notes)
    var notes_with_meter = []
    var ind = 0
    for (var i=0; i<rhythms_nested.length; i++) {
        notes_with_meter.push([])
        for (var j=0; j<rhythms_nested[i].length; j++) {
            notes_with_meter[i].push(notes[j+ind])
        }
        ind += rhythms_nested[i].length
    }
    console.log(notes_with_meter)
    return notes_with_meter

}

//need function that takes an array like [[1,3],[2,4],[5,6,7]] 
//and another array of arrays [[2,3],[4,5],[6,4,3]] and makes 
// new array with same structure as second but with a function of each
// element on the first one

// function combineArrays(arrays) {
//     var len = arguments.length
//     var result = []
//     var ind = 0
//     for (var k=0; k<arguments[0].length; k++){
//         result.push([])
//         for (var i=0; i<arguments.length; i++){
//             result[k].push(arguments[i][k])
//         }
//     }
//     return result

// }

//[[3,4],[5,1]],    [[6,7],[8,9]],   [[10,11],[12,13]]

function changeEach(array_of_arrays, func) {
    var result = []
    var ind = 0
    for (var k=0; k<array_of_arrays.length; k++) {
        result.push([])
        for (var i=0; i<array_of_arrays[k].length; i++){
            result[k].push(func(array_of_arrays[k][i]))
        }
        ind += array_of_arrays[k].length
    }
    return result
}



function stepsWithScale(tonic,rhythms,rhythms_nested, RH_or_LH) {

    //var rhythms = makeRhythms(numMeasures);
    if (RH_or_LH == 'LH')
        var octave = 3
    else var octave = 4
    console.log(rhythms);
    var scale = new MajorScale(tonic);
    var fifthsCircle = scale.fifthsCircle
    var step = scale.step
    function convertNumToScale(num) {
        return scale.stepNames[num]
    }
    console.log(scale)
    var notes = makeSteps(rhythms, rhythms_nested)
    console.log(notes)
    readnotes = changeEach(notes,convertNumToScale)
    function convertScaleDegreeToKeyboardNumber(num){
        var majorScale =  [0,2,4,5,7,9,11]
        return 12*octave + majorScale[num-1] + tonic
        
        
    }
    notesNumbers = changeEach(notes,convertScaleDegreeToKeyboardNumber)   
    console.log(notesNumbers)
    return {noteNumbers: notesNumbers, readnotes: readnotes}
    // console.log(readnotes)
    

    // // var readnotes = []
    // // var ind = 0
    // // for (var k=0; k<notes.length; k++){
    // //     readnotes.push([])
    // //     for (var i=0; i<notes[k].length; i++) {
    // //         readnotes[k].push(scale.stepNames[notes[k][i]])
    // //     }
    // //     ind += notes[k].length
    // // }
    // console.log(readnotes)
    // return readnotes
}

function combineNotesRhythms(tonic,numMeasures, RH_or_LH, beatsPer) {
    var rhythms_nested = makeRhythms(numMeasures, beatsPer);
    var rhythms = []
    for (var i=0; i<rhythms_nested.length; i++) {
        for (var j=0; j<rhythms_nested[i].length; j++)
            rhythms.push(rhythms_nested[i][j])
    }
    console.log(rhythms)
        

    var notes = stepsWithScale(tonic,rhythms,rhythms_nested, RH_or_LH);
    var notesReadable = notes['readnotes']
    var notesNumbers = notes['noteNumbers']
    // function changeNoteToNoteRhythmAlter(note){
    //     if (note)
    // }
     
    function shaveNote(note) {
        return note[0]
    }
    
    function findAlter(note) {
        if (note[1] == '#')
            var alter = '1'
        else if (note[1] == 'b')
            var alter = '-1'
        else var alter = '0'
        return alter
    }
    function findOctave(note) {
        return Math.floor((note+9)/12)-1

    }
    function convertRhythm(rhythm) {
        if (rhythm == 1)
            return 'quarter'
        else if (rhythm == 2)
            return 'half'
    }
    var rhythmsConverted = changeEach(rhythms_nested,convertRhythm)
    var alters = changeEach(notesReadable,findAlter)
    var notesShaved = changeEach(notesReadable,shaveNote)
    var octaves = changeEach(notesNumbers,findOctave)
    var result = {rhythms: rhythmsConverted, notes: notesShaved, octaves: octaves, alters: alters}
    console.log(result)
    return result

}


console.log(combineNotesRhythms(2,4,'LH',4))

function make_for_xml(tonic,numMeasures,beats) {
    //okay let's make nummeasures divisible by 2, so we can start with one hand and then do the other
    var notes_rhythms_LH = combineNotesRhythms((tonic+7)%12,numMeasures/2,'LH',beats)
    var notes_rhythms_RH = combineNotesRhythms(tonic,numMeasures/2,'RH', beats)

    var notes_RH = notes_rhythms_RH['notes']
    var notes_LH = notes_rhythms_LH['notes']
    var rhythms_RH = notes_rhythms_RH['rhythms']
    var rhythms_LH = notes_rhythms_LH['rhythms']
    var alters_RH = notes_rhythms_RH['alters']
    var alters_LH = notes_rhythms_LH['alters']
    var octaves_LH = notes_rhythms_LH['octaves']
    var octaves_RH = notes_rhythms_RH['octaves']
    console.log(notes_rhythms_RH)
    console.log(notes_rhythms_LH)

    var tonicConverterforFifthsCircle = {0: 3, 1: 10, 2: 5, 3:0, 4:7, 5:2, 6:9, 7:4, 8:11, 10:1, 11:8}
    var fifthsCircle = tonicConverterforFifthsCircle[tonic]
    //firstNotes = makenote(notes_rhythms[0][0][0],'4',notes_rhythms[0][0][1],'1',notes_rhythms[0][0][2])
    var firstNotes = []
    for (var i=0; i<notes_RH[0].length; i++)
        firstNotes.push(makenote(notes_RH[0][i],String(octaves_RH[0][i]),rhythms_RH[0][i],'1',alters_RH[0][i])) 
    var first = firstmeasure(String(fifthsCircle),String(beats),firstNotes,'2')
    var combined = [first]
    for (var k=1; k<notes_RH.length; k++) {
        var measureNotes = [];
        for (var i=0; i<notes_RH[k].length; i++) {
            measureNotes.push(makenote(notes_RH[k][i],String(octaves_RH[k][i]),rhythms_RH[k][i],'1',alters_RH[k][i]))
            console.log(measureNotes.length)
            
        }
        var measure = normalMeasure(measureNotes,'2')
        combined.push(measure)     
    }
    for (var k=0; k<notes_LH.length; k++) {
        var measureNotes = [];
        for (var i=0; i<notes_LH[k].length; i++) {
            measureNotes.push(makenote(notes_LH[k][i],String(octaves_LH[k][i]),rhythms_LH[k][i],'2',alters_LH[k][i]))
            console.log(measureNotes.length)
            
        }
        var measure = normalMeasure(measureNotes,'2')
        combined.push(measure)     
    }

    var doc = XMLDoc(combined)
    console.log(renderHTML(doc))
    return renderHTML(doc)
}

var m = make_for_xml(5,8,3)   

console.log(m)
console.log(String(m))
// var xml = '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' + String(m)

// var encodedXML = encodeURIComponent(xml);
// document.getElementById('downloadLink').setAttribute('href','data:text/xml,' + encodedXML);

// console.log(xml)

var genXML = function(){
    var xml = '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' + String(make_for_xml(5,8,4))
    var encodedXML = encodeURIComponent(xml);               
    document.getElementById('downloadLink').setAttribute('href','data:text/xml,' + encodedXML);
};
 
document.getElementById("downloadLink").onClick = genXML;
genXML();


// function download() {
//    var data = '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' + String(make_for_xml(5,8,4))
//    document.location = 'data:text/xml,' + encodeURIComponent(data);
// }

// function selectNextStep(scale, currentStep) {
//     index = scale.indexOf(currentStep);
//     var randNum = Math.random();
//     if (index == 0) 
//         return randNum < 0.5 ? scale[index] : scale[index+1]
//     else if (index == scale.length-1)
//         return randNum < 0.5 ? scale[index] : scale[index-1]
//     else {
//         if (randNum < 0.33)
//             return scale[index-1]
//         else if (0.33 <= randNum < 0.66)
//             return scale[index]
//         else return scale[index+1]
//     }
// }

function setNodeAttribute(node, attribute, value) {
  if (attribute == "class")
    node.className = value;
  else if (attribute == "checked")
    node.defaultChecked = value;
  else if (attribute == "for")
    node.htmlFor = value;
  else if (attribute == "style")
    node.style.cssText = value;
  else
    node.setAttribute(attribute, value);
}

function forEach(arr, func) {
    for (var i=0; i<arr.length; i++)
        func(arr[i])
}


function dom(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    forEachIn(attributes, function(name, value) {
      setNodeAttribute(node, name, value);
    });
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

function forEachIn(object, func) {
    for (var property in object) {
        if (object.hasOwnProperty(property))
            func(property, object[property])
    }
}


// function escapeHTML(text) {
//   var replacements = [[/&/g, "&amp;"], [/"/g, "&quot;"],
//                       [/</g, "&lt;"], [/>/g, "&gt;"]];
//   forEach(replacements, function(replace) {
//     text = text.replace(replace[0], replace[1]);
//   });
//   return text;
// }

function renderHTML(element) {
  var pieces = [];

  function renderAttributes(attributes) {
    var result = [];
    if (attributes) {
      for (var name in attributes) 
        result.push(" " + name + "='" +
                    (attributes[name]) + "'");
    }
    return result.join("");
  }

  function render(element) {
    // Text node
    if (typeof element == "string") {
      pieces.push((element));
    }
    else if (element == null) {}
    // Empty tag
    else if (!element.content || element.content.length == 0) {
      pieces.push("<" + element.name +
                  renderAttributes(element.attributes) + "/>");
    }
    // Tag with content
    else {
      pieces.push("<" + element.name +
                  renderAttributes(element.attributes) + ">");
      forEach(element.content, render);
      pieces.push("</" + element.name + ">");
    }
  }

  render(element);
  return pieces.join("");
}

function tag(name, content, attributes) {
  return {name: name, attributes: attributes, content: content};
}

 
function XMLDoc(bodyContent) {
  return tag('score-partwise',[tag('part-list',[tag('score-part',[],{'id':'P1'})]),tag('part',bodyContent,{'id':'P1'})],{'version': '2.0'})
} 



function makenote(step,octave,type,staff,alter) {
  return tag('note',[tag('pitch',[tag('step',[step]),
    tag('octave',[octave]),tag('alter',[alter])]),tag('type',[type]),tag('staff',[staff])])
}

// function makeNoteFromArray(notearray) {
//   //for an array that's a single note only
//   var step = notearray[0][0]
//   if (notearray[0][1] == '#')
//     var alter = '1'
//   else if (notearray[0][1] == 'b')
//     var alter = '-1'
//   else 
//     var alter = '0'
//   if (notearray[1] == 1)
//     var type = 'quarter'
//   else if (notearray[1] == 2)
//     var type = 'half'
//   var octave = '4'
//   var staff = '1'
//   return makenote(step, octave, type, staff, alter)

// }


function padNotes(notes) {
    //makes the first element null to be filled in later if it's the first measure
  copynotes = [];
  for (var i=0; i<notes.length;i++)
    copynotes.push(notes[i])
  if (copynotes[0]!=null) {
    for (var i=copynotes.length; i>0; i--) {
      copynotes[i] = copynotes[i-1];     
    }
    copynotes[0] = null
  }
  return copynotes
    
}



function firstmeasure(keyFifths,beats,notes,numStaves) {
  newnotes = padNotes(notes)
  newnotes[0] = tag('attributes',[clef('G','1','2'),clef('F','2','4'),
    tag('key',[tag('fifths',[keyFifths])]),
    tag('staves',[numStaves]),tag('time',[tag('beats',[beats])])])
  return tag('measure',newnotes,{'number':'1'})
  
}

function normalMeasure(notes,number) {
  console.log(renderHTML(tag('measure',notes,{'number':number})))
  return tag('measure',notes,{'number':number})
}

function clef(clefType, number, lineNumber) {
  return tag('clef',[tag('sign',[clefType]),tag('line',[lineNumber])],{'number':number})
}

