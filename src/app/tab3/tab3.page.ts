import { Component} from '@angular/core';
import * as $ from 'jquery';
import { Storage } from '@ionic/storage';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ImageOcrService } from '../services/image-ocr.service';
import { WordListService } from '../services/word-list.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  photo: SafeResourceUrl;
  lineLength: number;
  noSpacesLength: number;
  fullPuzzleString: string;
  fullPuzzleArrayAnswer;

  constructor(public storage: Storage, private imageOcr: ImageOcrService, private wordList: WordListService) {
  }

  ngOnInit() {
    $(".wordSearch").empty();
    $(".solveButton").hide();
    $(".looksGood2").show();
    let testString;

    //alert(result.text);
    let wordArray: Array<string> = [];
    testString = this.imageOcr.wordSearch.toUpperCase();

    //looks for misleading 0's and converts them to what they are supposed to be (an O)
    testString = testString.split("0").join("O");

    testString = testString.split("|").join("I");

    testString = testString.split("2").join("Z");

    //separates by lines
    wordArray = testString.split("\n");
    
    for (let i = 0; i < wordArray.length; i++) {
      if (wordArray[i] != "") {
        $(".wordSearch").append('<ion-input spellcheck="false" value="' + wordArray[i] + '"></ion-input>');
        //numLines++;
      }
    } 
    //$(".wordSearch").append(result.text);    
  }

  looksGood() {
    if ($("ion-input").val() != null) {
      $(".looksGood2").hide();
    }

    let fullPuzzleString = "";
    
    //length of firstLine when word search is ready to be calculated
    let firstLine;
    firstLine = $("ion-input").val();
    let lineLength = firstLine.length;
    this.lineLength = firstLine.length;

    let firstLineNoSpaces = firstLine.replace(/\s/g, '');
    this.noSpacesLength = firstLineNoSpaces.length;

    
    $("ion-input").each(function() {
      fullPuzzleString += ($(this).val());
    }); 

    this.fullPuzzleString = fullPuzzleString;
    this.fullPuzzleArrayAnswer = this.stringSimplify(fullPuzzleString);
    
    let whereAt: number = 1;
    $(".wordSearch").empty();
    
    $(".wordSearch").append('<ion-row class="ion-nowrap" id="1">')
    for (let i = 0 ; i < fullPuzzleString.length; i++) {
      $("#" + whereAt).append('<ion-col size="auto" class="ion-no-padding">' + fullPuzzleString[i] + '</ion-col>');
      for (let j = 0; j < (fullPuzzleString.length)/lineLength; j++) {
        if (i === ((lineLength * j) + lineLength - 1)) {
          whereAt++;
          $(".wordSearch").append('<ion-row class="ion-nowrap" id="' + (j + 2) + '">');
        }
      }
    }
    $(".solveButton").show();
  }

  solvePuzzleLoop() {
    //retrieves words array inputted from the 'search' tab
    let wordList = this.wordList.wordList;

    if (wordList != null) {
      for (let i = 0; i < wordList.length; i++) {
        this.solvePuzzle(wordList[i]);
      }
      this.highlightWords();
    } else {
      alert("No words submitted!");
    }
    // for (let i = 0; i < inputtedList.length; ) {
    //   this.solvePuzzle(inputtedList[i]);
    // }
  }
  
  solvePuzzle(testWordString: string) {
    let fullPuzzleString = this.fullPuzzleString;
    let fullPuzzleArray = [];
    let testWordArray = [];

    length = this.noSpacesLength;

    //simplifies
    fullPuzzleArray = this.stringSimplify(fullPuzzleString);
    testWordArray = this.stringSimplify(testWordString)

    //word in reverse order
    let testWordArrayReverse = testWordArray.slice().reverse();

    //cross-checks word left-right (forwards)
    let numCorrectLR = 0;
    //iterates through all of the puzzle array updating numCorrect when a match is found and continuing to do so if the match continues, otherwise resets numCorrect to 0
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectLR = 0;
      for (let j = 0; j < testWordArray.length; j++) {
        if (fullPuzzleArray[i + j] === testWordArray[j]) {
          numCorrectLR++;
          if (numCorrectLR === testWordArray.length) {
            for (let k = 0; k < testWordArray.length; k++) {
              this.fullPuzzleArrayAnswer[i + k] = fullPuzzleArray[i + k].toLowerCase();
            }
          }
        } else {
          numCorrectLR = 0;
        }
      }
    }

   //cross-checks word right-left (backwards)
   let numCorrectRL = 0;
   //iterates through all of the puzzle array updating numCorrect when a match is found and continuing to do so if the match continues, otherwise resets numCorrect to 0
   for (let i = 0; i < fullPuzzleArray.length; i++) {
     numCorrectRL = 0;
     for (let j = 0; j < testWordArrayReverse.length; j++) {
       if (fullPuzzleArray[i + j] === testWordArrayReverse[j]) {
        numCorrectRL++;
         if (numCorrectRL === testWordArrayReverse.length) {
           for (let k = 0; k < testWordArrayReverse.length; k++) {
            this.fullPuzzleArrayAnswer[i + k] = fullPuzzleArray[i + k].toLowerCase();
          }
         }
       } else {
        numCorrectRL = 0;
       }
     }
    }

    //cross-checks word top-bottom (vertical: chronological)
    let numCorrectTB = 0;
    //iterates through entire puzzle array updating numCorrect when top-botom match is found
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectTB = 0;
      for (let j = 0; j < testWordArray.length; j++) {
        if (fullPuzzleArray[i + (j * length)] === testWordArray[j]) {
          numCorrectTB++;
          if (numCorrectTB === testWordArray.length) {
            for (let k = 0; k < testWordArray.length; k++) {
              this.fullPuzzleArrayAnswer[i + (k * length)] = fullPuzzleArray[i + (k * length)].toLowerCase();
            }
          }
        } else {
          numCorrectTB = 0;
        }
      }
    }

    //cross-checks word bottom-top (vertical: reverse)
    let numCorrectBT = 0;
    //iterates through entire puzzle array updating numCorrect when bottom-top match is found
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectBT = 0;
      for (let j = 0; j < testWordArrayReverse.length; j++) {
        if (fullPuzzleArray[i + (j * length)] === testWordArrayReverse[j]) {
          numCorrectBT++;
          if (numCorrectBT === testWordArrayReverse.length) {
            for (let k = 0; k < testWordArrayReverse.length; k++) {
              this.fullPuzzleArrayAnswer[i + (k * length)] = fullPuzzleArray[i + (k * length)].toLowerCase();
            }
          }
        } else {
          numCorrectBT = 0;
        }
      }
    }

    //cross-checks word diagonally (top-bottom: chronological)
    let numCorrectDTB = 0;
    //iterates through entire puzzle array updating numCorrect when a top-bottom, diagonal match is found
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectDTB = 0;
      for (let j = 0; j < testWordArray.length; j++) {
        if (fullPuzzleArray[i + (j * (length + 1))] === testWordArray[j]) {
          numCorrectDTB++;
          if (numCorrectDTB === testWordArray.length) {
            for (let k = 0; k < testWordArray.length; k++) {
              this.fullPuzzleArrayAnswer[i + (k * (length + 1))] = fullPuzzleArray[i + (k * (length + 1))].toLowerCase();
            }
          }
        } else {
          numCorrectDTB = 0;
        }
      }
    }

    //cross-checks word diagonally (top-bottom: reverse)
    let numCorrectDTBR = 0;
    //iterates through entire puzzle array updating numCorrect when a top-bottom, diagonal (reverse) match is found
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectDTBR = 0;
      for (let j = 0; j < testWordArrayReverse.length; j++) {
        if (fullPuzzleArray[i + (j * (length + 1))] === testWordArrayReverse[j]) {
          numCorrectDTBR++;
          if (numCorrectDTBR === testWordArrayReverse.length) {
            for (let k = 0; k < testWordArrayReverse.length; k++) {
              this.fullPuzzleArrayAnswer[i + (k * (length + 1))] = fullPuzzleArray[i + (k * (length + 1))].toLowerCase();
            }
          }
        } else {
          numCorrectDTBR = 0;
        }
      }
    }

    //cross-checks word diagonally (bottom-top: chronological)
    let numCorrectDBT = 0;
    //iterates through entire puzzle array updating numCorrect when a bottom-top, diagonal match is found
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectDBT = 0;
      for (let j = 0; j < testWordArray.length; j++) {
        if (fullPuzzleArray[i - (j * (length - 1))] === testWordArray[j]) {
          numCorrectDBT++;
          if (numCorrectDBT === testWordArray.length) {
            for (let k = 0; k < testWordArray.length; k++) {
              this.fullPuzzleArrayAnswer[i - (k * (length - 1))] = fullPuzzleArray[i - (k * (length - 1))].toLowerCase();
            }
          }
        } else {
          numCorrectDBT = 0;
        }
      }
    }

    //cross-checks word diagonally (bottom-top: reverse)
    let numCorrectDBTR = 0;
    //iterates through entire puzzle array updating numCorrect when a bottom-top, diagonal (reverse) match is found
    for (let i = 0; i < fullPuzzleArray.length; i++) {
      numCorrectDBTR = 0;
      for (let j = 0; j < testWordArrayReverse.length; j++) {
        if (fullPuzzleArray[i - (j * (length - 1))] === testWordArrayReverse[j]) {
          numCorrectDBTR++;
          if (numCorrectDBTR === testWordArrayReverse.length) {
            for (let k = 0; k < testWordArrayReverse.length; k++) {
              this.fullPuzzleArrayAnswer[i - (k * (length - 1))] = fullPuzzleArray[i - (k * (length -  1))].toLowerCase();
            }
          }
        } else {
          numCorrectDBTR = 0;
        }
      }
    }
      // for (let j = 0; j < 50; j++) {
      //   //re-splits and "pastes" word search with original row lengths
      //   if (answersString.substring(j * length, (j + 1) * length) != "") {
      //     $(".wordSearch").append('<ion-input spellcheck="false" value="' + answersString.substring(j * length, (j + 1) * length) + '"></ion-input>');
      //   }
      // }
  }


  highlightWords() {
    let length = this.noSpacesLength;
    let answersString = this.fullPuzzleArrayAnswer;

    let whereAt: number = 1;
    $(".wordSearch").empty();
    
    $(".wordSearch").append('<ion-row class="ion-nowrap" id="1">')
    for (let i = 0 ; i < answersString.length; i++) {
      if (answersString[i] === answersString[i].toLowerCase()) {
        answersString[i] = answersString[i].toUpperCase();
        $("#" + whereAt).append('<ion-col size="auto" class="ion-no-padding" style="background-color:#FFFF00;">' + answersString[i] + '</ion-col>');
        for (let j = 0; j < (answersString.length)/length; j++) {
          if (i === ((length * j) + length - 1)) {
            whereAt++;
            $(".wordSearch").append('<ion-row class="ion-nowrap" id="' + (j + 2) + '">');
          }
        }
      } else {
        $("#" + whereAt).append('<ion-col size="auto" class="ion-no-padding">' + answersString[i] + '</ion-col>');
        for (let j = 0; j < (answersString.length)/length; j++) {
          if (i === ((length * j) + length - 1)) {
            whereAt++;
            $(".wordSearch").append('<ion-row class="ion-nowrap" id="' + (j + 2) + '">');
          }
        }
      }
    }
  }

  //function that removes spaces, converts to array - simplifies to one format
  stringSimplify(needSimplified: string) {
    let simplified = [];
    
    //removes spaces
    if (/\s/.test(needSimplified)) {
      needSimplified = needSimplified.replace(/\s+/g, '');
    }
    //capitalizes
    needSimplified = needSimplified.toUpperCase(); 

    //converts to array
    simplified = needSimplified.split("");

    return simplified;
  }
}
