import * as sh from 'shelljs';
import { CompositeLearningObject, LearningObject } from './learningobjects';
import { publishLos, reapLos } from '../utils/loutils';
import { copyFileToFolder } from '../utils/futils';
import * as fs from 'fs';

export class Topic extends CompositeLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    super.los = reapLos(this);
    this.reap('topic');
    this.link = 'index.html';
    this.lotype = 'topic';
    this.setDefaultImage();
  }

  setDefaultImage(): void {
    if (!this.img && this.los.length > 0) {
      const img = this.los[0].folder!! + '/' + this.los[0].img;
      if (fs.existsSync(img)) {
        this.img = img;
      }
    }
  }

  publish(path: string): void {
    console.log('::', this.title);
    sh.cd(this.folder!);
    const topicPath = path + '/' + this.folder;
    copyFileToFolder(this.img!, topicPath);
    publishLos(topicPath, this.los);
    sh.cd('..');
  }

  toJson(url: string, jsonObj: any) {
    const topicUrl = `${url}${this.folder}`;
    super.toJson(topicUrl, jsonObj);
    jsonObj.route = `#topic/${topicUrl}`;
    jsonObj.los = [];
    this.los.forEach(lo => {
      let loJson: any = {};
      lo.toJson(`${topicUrl}/${lo.folder}`, loJson);
      jsonObj.los.push(loJson);
    });
  }
}
