import { Component } from '@angular/core';
import * as $ from 'jquery';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { WordListService } from '../services/word-list.service';
import { Tab3Page } from '../tab3/tab3.page';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ImageOcrService } from '../services/image-ocr.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [Tab3Page]
})

export class Tab2Page {

  words = [];
  photo: SafeResourceUrl;

  constructor(public storage: Storage, private router: Router, private wordList: WordListService, public tab3: Tab3Page, private imageOcr: ImageOcrService) {}

  enterWord() {
    let word = $("#word").val()

    if (word === "") {
      alert("Empty!");
    } else {
      //empties word on enter
      $("#word").val("");
      this.words.push(word);
    
      $(".wordList").append("<ion-item class='word'>" + "<b>" + word + "</b>" + "</ion-item>");
      //console.log(this.word);
    }
  }

  onSubmit() {
    this.wordList.wordList = this.words;
    this.router.navigateByUrl("/tabs/tab3");
  }

  clearLast() {
    this.words.pop();
    $(".wordList").children().last().remove();
    this.wordList.wordList = this.words;
  }

  async uploadWords() {
    $(".editList").empty();

    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.photo = image.dataUrl;
    
    //"./assets/Images/wordlisttest.jpg"
    await this.imageOcr.imageOcrWords(this.photo)
    let wordString = this.imageOcr.wordList;

    wordString = wordString.replace(/\s+/g, '\n');
    //console.log(wordString);
    
    $(".editList").append(wordString);

    $(".check").css('visibility','visible');
    // //removes empty elements
    // wordStringArray = wordStringArray.filter(el => {
    //   return el != null && el != '';
    // });
    // console.log(wordStringArray);
  }

  looksGood() {

    let wordString = $(".editList").text();

    $(".editList").empty();
    $(".check").hide();

    let wordStringArray = wordString.split("\n");
    for (let i = 0; i < wordStringArray.length; i++) {
      if (wordStringArray[i] != "") {
        $(".wordList").append("<ion-item class='word'>" + "<b>" + wordStringArray[i] + "</b>" + "</ion-item>");
        this.words.push(wordStringArray[i]);
      }
    }
  }
}
