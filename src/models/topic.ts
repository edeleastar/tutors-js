import * as sh from 'shelljs';
import { CompositeLearningObject, LearningObject } from './learningobjects';
import { publishLos, reapLos } from '../utils/loutils';
import { copyFileToFolder } from '../utils/futils';
import * as fs from 'fs';
import { Unit } from './unit';

export class Topic extends CompositeLearningObject {
  units: Array<LearningObject>;
  panelVideos: Array<LearningObject>;
  panelTalks: Array<LearningObject>;
  standardLos: Array<LearningObject>;
  allLos: LearningObject[] = [];

  constructor(parent: LearningObject) {
    super(parent);
    super.los = reapLos(this);
    this.reap('topic');
    this.link = 'index.html';
    this.lotype = 'topic';
    this.setDefaultImage();

    this.los.forEach(lo => this.allLos.push(lo));

    this.units = this.los.filter(lo => lo.lotype == 'unit');
    this.panelVideos = this.los.filter(lo => lo.lotype == 'panelvideo');
    this.panelTalks = this.los.filter(lo => lo.lotype == 'paneltalk');
    this.standardLos = this.los.filter(lo => lo.lotype !== 'unit' && lo.lotype !== 'panelvideo' && lo.lotype !== 'paneltalk');
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

  toJson (url: string, jsonObj: any) {
    super.toJson(url, jsonObj);
    jsonObj.los = [];
    this.los.forEach(lo => {
      let loJson: any = {};
      lo.toJson( url + this.folder + '/' + lo.folder, loJson,)
      jsonObj.los.push(loJson);
    });

  }
}
