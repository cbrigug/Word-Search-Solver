import { Injectable } from '@angular/core';

declare var Tesseract: any;


@Injectable({
  providedIn: 'root'
})


export class ImageOcrService {
  wordSearch = "";
  length = 0;
  wordList = "";

  constructor() { }

  async imageOcr(image) {
    let text = "";

    //resets this.wordSearch
    this.wordSearch = "";

    await Tesseract.recognize(image).then(function(result: any) {
      text += result.text;
    });

    this.wordSearch += text;

    //this.length = this.wordSearch.indexOf('\n');
  }

  async imageOcrWords(image) {
    let textWords = "";

    //resets this.wordList
    this.wordList = "";

    await Tesseract.recognize(image).then(function(result: any) {
      textWords += result.text;
    });

    this.wordList += textWords;
  }
}
