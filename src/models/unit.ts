import { LearningObject } from './learningobjects';
import { Topic } from './topic';
import * as sh from 'shelljs';
import { copyFileToFolder } from '../utils/futils';
import { publishLos } from '../utils/loutils';

export class Unit extends Topic {

  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = 'unit';
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
    url = url.substring(0, url.lastIndexOf('/')) + '/';
    super.toJson(url, jsonObj);
    jsonObj.route = `#topic/${url}`;
  }
}
