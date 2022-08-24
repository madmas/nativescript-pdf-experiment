import { Injectable } from "@angular/core";

import { knownFolders} from "@nativescript/core";


@Injectable()
export class FileReaderService {
    
    documents = knownFolders.currentApp();

    constructor() { }

    readJSON(path: string): Promise<Object> {
        let jsonFile = this.documents.getFile(path);
        return new Promise<Object>((resolve, reject) => {
            jsonFile.readText().then((content: string) => {
                let data = <Array<Object>>JSON.parse(content);
                resolve(data);
            })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}