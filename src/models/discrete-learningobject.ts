import * as fs from 'fs';

const glob = require('glob');
import { LearningObject } from './learningobjects';
import * as path from 'path';
import { copyResource } from '../utils/loutils';
import { readFile } from '../utils/futils';

export abstract class DiscreteLearningObject extends LearningObject {
  protected constructor(parent: LearningObject) {
    super(parent);
  }

  reap(pattern: string): void {
    this.link = 'error: missing ' + this.lotype;
    let resourceList = glob.sync(pattern).sort();
    if (resourceList.length > 0) {
      const resourceName = path.parse(resourceList[0]).name;
      super.reap(resourceName);
      this.link = resourceList[0];
    }
  }

  publish(path: string): void {
    copyResource(this.folder!, path);
  }
}

export class Talk extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = 'talk';
    this.reap('*.pdf');
    if (fs.existsSync('videoid')) {
      this.videoid = readFile('videoid');
    }
  }
  toJson(url: string, jsonObj: any) {
    super.toJson(url, jsonObj);
    jsonObj.pdf = `https://${url}/${this.link}`;
    jsonObj.route = `#talk/${url}/${this.link}`;
  }
}

export class PanelTalk extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = 'paneltalk';
    this.reap('*.pdf');
    if (fs.existsSync('videoid')) {
      this.videoid = readFile('videoid');
    }
  }
  toJson(url: string, jsonObj: any) {
    super.toJson(url, jsonObj);
    jsonObj.pdf = `https://${url}/${this.link}`;
    jsonObj.route = `#talk/${url}/${this.link}`;
  }
}

export class Archive extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = 'archive';
    this.reap('*.zip');
  }

  toJson(url: string, jsonObj: any) {
    super.toJson(url, jsonObj);
    jsonObj.pdf = `https://${url}/${this.link}`;
  }
}

export class Reference extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = 'reference';
    this.reap('*.pdf');
  }
}
