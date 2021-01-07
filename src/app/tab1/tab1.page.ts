import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Tab3Page } from '../tab3/tab3.page';
import { ImageOcrService } from '../services/image-ocr.service';
import { Router } from '@angular/router';
import { Tab2Page } from '../tab2/tab2.page';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [Tab3Page, Tab2Page]
})

export class Tab1Page {
  photo: SafeResourceUrl;
  
  constructor(public storage: Storage, public tab3: Tab3Page, public tab2: Tab2Page, private imageOcr: ImageOcrService, private router: Router) {}


  async loadPhoto () {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });

    this.photo = image.dataUrl;
    // this.storage.ready().then(() => {
    //   this.storage.set('photo', this.photo);
    // });

  }

  async onSubmit() {
    this.router.navigateByUrl("/tabs/tab2");

    //executs OCR to increase execution time
    //"./assets/Images/wordsearchtest.jpg"
    await this.imageOcr.imageOcr("./assets/Images/wordsearchtest.jpg");

    //runs tab3's ngOnInit() method.
    this.tab3.ngOnInit();

  }
}
