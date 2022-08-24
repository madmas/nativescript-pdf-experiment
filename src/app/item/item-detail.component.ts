import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { registerElement } from '@nativescript/angular';

import { Item } from './item';
import { ItemService } from './item.service';
import { PDFView } from 'nativescript-pdf-view';
import { FileReaderService } from '../../fileReader.service';

import { knownFolders} from "@nativescript/core";


registerElement('PDFView', () => PDFView);

import * as permissions from "nativescript-permissions";

import * as pdfMake from 'pdfmake/build/pdfmake.js';

@Component({
    selector: 'ns-details',
    templateUrl: './item-detail.component.html',
})
export class ItemDetailComponent implements OnInit {
    src: string;
    item: Item;
    fonts: any;
    images: any;
    documents = knownFolders.currentApp();
    
    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private fr: FileReaderService
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params.id;
        this.item = this.itemService.getItem(id);

        // log the item to the console
        console.log(this.item);

        permissions.requestPermission([
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE",
        ], "We need these permissions to save pdf")
            .then(function (res) {
                console.log("Permissions granted!");
            })
            .catch(function () {
            });


       this.loadData().then( value => this.generatePDF());
      
    }

    generatePDF() {
        this.generatepdfMake();
    }

    loadData(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
         this.fr.readJSON('/app/data.json').then(
            res => {
                this.fonts = res["fonts"];
                this.images = res['images'];
                console.log('loaded data');
                resolve(res);
            },
            err => {
                console.log('Error reading json: ' + JSON.stringify(err));
                reject();
            }
        )
        });
        return promise;
    }

    generatepdfMake(): void {
        let that = this;

        var docDefinition = {

            pageOrientation: 'landscape',

            content: [

                { text: 'Certificate', fontSize: '25', italics: true, alignment: 'center' },

                { text: 'of', fontSize: '25', italics: true, alignment: 'center' },

                { text: '\nTRAINING COMPLETION', fontSize: '30', alignment: 'center' },

                { text: '\n\nThis certifies that', fontSize: '18', alignment: 'center' },

                { text: '\n' + "this.name", fontSize: '30', alignment: 'center' },

                { text: '\nhas successfully completed the training in', fontSize: '18', alignment: 'center' },

                { text: '\n' + "this.coursename", fontSize: '30', alignment: 'center' },

                { text: '\nOn ' + "this.date" + '\n\n', fontSize: '18', alignment: 'center' },

                {
                    columns: [
                        {
                            width: 150,
                            text: ''
                        },
                        {
                            image: this.images['nscripting'],
                            width: 100
                        },
                        {},
                        {
                            image: this.images['nslogojpeg'],
                            width: 80
                        }
                    ]
                },
                {
                    "canvas": [{
                        "type": "line",
                        "x1": 400,
                        "y1": 0,
                        "x2": 0,
                        "y2": 0,
                        "lineWidth": 0.5,
                        "lineColor": "#000000"
                    }]
                }
            ],

            background: function () {
                return { image: that.images['watermark'], width: 300, opacity: 0.2, absolutePosition: { x: 260, y: 150 } }
            }
        }

        pdfMake.createPdf(docDefinition, '', '', this.fonts).getDataUrl((dataUrl) => {
            console.log('PDF generated: ', dataUrl);
            this.src = dataUrl;
        });
    }

    onLoad(): void {
        console.log('PDF Loaded', this.src);
    }
}
