function Scale(fifthsCircle, quality) {
    //this constructor is a fucking mess. makes a scale object, major minor
    //fifthsCircle is number of fifths away from middle c. <0 for flat keys,
    // quality is minor = 'm', major = 'M'
    this.fifthsCircle = String(fifthsCircle);
    var findRelMajFromFifths = {'0': 0, '-5': 1, '2': 2, '-3': 3, '4': 4, '-1': 5, '6': 6, '1': 7, '-4': 8, '3': 9, '-2':10, '5': 11};
    this.quality = quality 
    var relativeMajorNumber = findRelMajFromFifths[this.fifthsCircle]
    if (quality == 'm')
        this.tonicNumber = (relativeMajorNumber + 9)%12
    else this.tonicNumber = relativeMajorNumber
    var tonicConverterforStep = {9: 'A', 10: 'B', 11: 'B', 0:'C', 1:'D', 2:'D', 3:'E', 4:'E', 5:'F', 7:'G',8:'A'}   
    var relativeMajor = tonicConverterforStep[relativeMajorNumber]
    this.step = tonicConverterforStep[this.tonicNumber]
    var reversedict = {0: 'C', 2: 'D', 4:'E', 5:'F', 7:'G', 9:'A', 11:'B'}
    var notesList = ['C','D','E','F','G','A','B']
    this.majorScaleArray = [0,2,4,5,7,9,11]
    var ind = notesList.indexOf(relativeMajor)
    for (var i = 0; i<ind; i++){
        notesList.push(notesList.shift())  
    }
    this.stepNums = []
    this.stepNames = {}
    for (var i=0; i<7; i++)
        this.stepNums.push((this.majorScaleArray[i]+relativeMajorNumber)%12)
    if (quality == 'm'){
        for (var i=0; i<5; i++){
            this.stepNums.push(this.stepNums.shift())
            notesList.push(notesList.shift())
            } 
        }   
    for (var i=0; i<7; i++) {
        //TODO: fix f# major and c# major bugs.
        if (!reversedict[this.stepNums[i]] && this.fifthsCircle > 0)
            this.stepNames[i+1] = notesList[i] + '#'
        else if (!reversedict[this.stepNums[i]] && this.fifthsCircle < 0)
            this.stepNames[i+1] = notesList[i] + 'b'
        else
            this.stepNames[i+1] = reversedict[this.stepNums[i]]       
        }    
}

function NextStepDegree(currentScaleDegree) {
    //for five finger position only. gives you the next scale degree, based on a current one. 
    // up a step, down a step, or repeat
    var randNum = Math.random()
    if (currentScaleDegree == 1) return randNum < 0.2 ? currentScaleDegree : currentScaleDegree+1;
    else if (currentScaleDegree == 5) return randNum < 0.2 ? currentScaleDegree : currentScaleDegree-1;
    else {
        if (randNum <= 0.4) return currentScaleDegree-1;
        else if (0.4<randNum<0.6) return currentScaleDegree;
        else return currentScaleDegree + 1;
    }
}

function makeRhythms(numMeasures, beatsPer) {
    // 4/4 or 3/4 time only. quarter notes only on syncopated beats. returns 
    //a nested array with the rhythms in each measure
    if (beatsPer == undefined) var beatsPer = 4;
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
        if (beat == 0 || beat == beatsPer/2) {
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
    return rhythms
}

function makeSteps(rhythms_nested) {
    //combines the rhythms and generates a bunch of scale degrees to go along with,
    // returned in a nested array
    var numnotes = 0
    for (var i=0; i<rhythms_nested.length; i++) {
        numnotes += rhythms_nested[i].length    //find out how many total notes there are in rhythms array
    }
    var notes = [1] // this ensures melody will always end on tonic. necessary?
    for (var i=1; i<numnotes; i++)
        notes.push(NextStepDegree(notes[i-1]))  //build simple array of scale degrees
    notes.reverse()
    var notes_with_meter = []
    // put the steps in nested arrays, each inner array for a single measure
    var ind = 0;
    for (var i=0; i<rhythms_nested.length; i++) {
        notes_with_meter.push([])
        for (var j=0; j<rhythms_nested[i].length; j++) {
            notes_with_meter[i].push(notes[j+ind])
        }
        ind += rhythms_nested[i].length
    }
    return notes_with_meter
}

function changeEach(array_of_arrays, func) {
    //helper function for later. takes a nested array and applies a function
    // to each inner element
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

function stepsWithScale(fifthsCircle,rhythms_nested, RH_or_LH, quality) {
    // makes scale degrees and applies the rhythm and tonality to them
    if (RH_or_LH == 'LH' && octave == undefined) var octave = 2;
    else if (octave == undefined) var octave = 4;
    var scale = new Scale(fifthsCircle, quality);
    var step = scale.step
    function convertNumToScale(num) {
        return scale.stepNames[num]
    }
    var notes = makeSteps(rhythms_nested)
    var readnotes = changeEach(notes,convertNumToScale)
    function convertScaleDegreeToKeyboardNumber(num){
        return 12*octave + scale.majorScaleArray[num-1] + scale.tonicNumber     
    }
    var notesNumbers = changeEach(notes,convertScaleDegreeToKeyboardNumber)   
    return {noteNumbers: notesNumbers, readnotes: readnotes}
}

function combineNotesRhythms(fifthsCircle, numMeasures, RH_or_LH, beatsPer, quality) {
    // returns an object with notes, rhythms, staff based on which hand, and accidentals for each note
    var rhythms_nested = makeRhythms(numMeasures, beatsPer);
    var notes = stepsWithScale(fifthsCircle,rhythms_nested, RH_or_LH, quality);
    var notesReadable = notes['readnotes']
    var notesNumbers = notes['noteNumbers']
    function shaveNote(note) {
        return note[0]
    } 
    function findAlter(note) {
        if (note[1] == '#') var alter = '1';
        else if (note[1] == 'b') var alter = '-1';
        else var alter = '0';
        return alter
    }
    function findOctave(note) {
        return Math.floor((note)/12)
    }
    function convertRhythm(rhythm) {
        if (rhythm == 1) return 'quarter';
        else if (rhythm == 2) return 'half';
    }
    var rhythmsConverted = changeEach(rhythms_nested,convertRhythm)
    var alters = changeEach(notesReadable,findAlter)
    var notesShaved = changeEach(notesReadable,shaveNote)
    var octaves = changeEach(notesNumbers,findOctave)
    if (RH_or_LH == 'RH') {var staff = '1'}
    else var staff = '2'
    function makeStaffs() {return staff}
    var staffs = changeEach(rhythms_nested, makeStaffs)
    var result = {rhythms: rhythmsConverted, notes: notesShaved, octaves: octaves, alters: alters, staff: staffs}
    return result
}

function make_for_xml(fifthsCircle,numMeasures,beats,quality) {
    // generates the xml string. see functions at the bottom of this document for how
    // it makes the xml objects
    var notes_rhythms_LH = combineNotesRhythms(fifthsCircle+1,numMeasures/2,'LH',beats,quality)
    var notes_rhythms_RH = combineNotesRhythms(fifthsCircle,numMeasures/2,'RH', beats,quality)
    function addNestedArrays(arr1, arr2) {
        for (var i=0; i<arr2.length; i++) {arr1.push(arr2[i])}
        return arr1
    }
    var notes = addNestedArrays(notes_rhythms_RH['notes'],notes_rhythms_LH['notes'])
    var rhythms = addNestedArrays(notes_rhythms_RH['rhythms'],notes_rhythms_LH['rhythms'])
    var alters = addNestedArrays(notes_rhythms_RH['alters'],notes_rhythms_LH['alters'])
    var octaves = addNestedArrays(notes_rhythms_RH['octaves'],notes_rhythms_LH['octaves'])
    var staffs = addNestedArrays(notes_rhythms_RH['staff'],notes_rhythms_LH['staff'])
    console.log(staffs)

    var firstNotes = []
    for (var i=0; i<notes[0].length; i++)
        firstNotes.push(makenote(notes[0][i],String(octaves[0][i]),rhythms[0][i],staffs[0][i],alters[0][i])) 
    var first = firstmeasure(String(fifthsCircle),String(beats),firstNotes,'2')
    var combined = [first]
    for (var k=1; k<notes.length; k++) {
        var measureNotes = [];
        for (var i=0; i<notes[k].length; i++) {
            measureNotes.push(makenote(notes[k][i],String(octaves[k][i]),rhythms[k][i],staffs[k][i],alters[k][i]))      
        }
        var measure = normalMeasure(measureNotes,'2')
        combined.push(measure)     
    }
    var doc = XMLDoc(combined)
    return renderHTML(doc)
}

// var m = make_for_xml(5,8,3)   

// console.log(m)
// console.log(String(m))
// var xml = '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' + String(m)

// var encodedXML = encodeURIComponent(xml);
// document.getElementById('downloadLink').setAttribute('href','data:text/xml,' + encodedXML);

// console.log(xml)


//here's the part that makes the link. i don't compeltely understand it.

var genXML = function(){
    // the xml variable contains the string header to the xml file + the part generated in the code above
    var xml = '<?xml version="1.0" encoding="UTF-8"?> <!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 2.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">' 
    + String(make_for_xml(-2,8,4,'M'))
    var encodedXML = encodeURIComponent(xml);               
    document.getElementById('downloadLink').setAttribute('href','data:text/xml,' + encodedXML);
};
 
document.getElementById("downloadLink").onClick = genXML;
genXML();


//below is a bunch of functions borrowed from eloquent javascript

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

// these are the functions i made for making the musicXML file. generic functions for dealing with
// input notes and making a piano score that can take a time signature, key signature and shit 
// like that
 
function XMLDoc(bodyContent) {
  return tag('score-partwise',[tag('part-list',[tag('score-part',[],{'id':'P1'})]),tag('part',bodyContent,{'id':'P1'})],{'version': '2.0'})
} 



function makenote(step,octave,type,staff,alter) {
  return tag('note',[tag('pitch',[tag('step',[step]),
    tag('octave',[octave]),tag('alter',[alter])]),tag('type',[type]),tag('staff',[staff])])
}


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

