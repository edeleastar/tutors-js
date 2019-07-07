import * as fs from 'fs';
import * as path from 'path';
import { getHeader, getImageFile, getParentFolder, readYaml, withoutHeader } from '../utils/futils';
import { Properties } from '../utils/properties';

export abstract class LearningObject {
  parent?: LearningObject;
  course?: LearningObject;
  lotype: string;
  title?: string;
  img?: string;
  videoid?: string;
  link?: string;
  folder?: string;
  parentFolder?: string;
  objectivesMd?: string;
  hide = false;
  properties?: Properties;

  protected constructor(parent?: LearningObject) {
    if (parent) {
      this.parent = parent;
    }
    this.lotype = 'lo';
  }

  reap(pattern: string): void {
    this.folder = path.basename(process.cwd());
    this.parentFolder = getParentFolder();
    this.img = getImageFile(pattern);
    if (fs.existsSync('properties.yaml')) {
      this.properties = readYaml('properties.yaml')
    }
    if (fs.existsSync(pattern + '.md')) {
      this.title = getHeader(pattern + '.md');
      this.title = this.title + ' ';

      this.objectivesMd = withoutHeader(pattern + '.md');
    } else {
      this.title = pattern;
    }
  }

  abstract publish(path: string): void;

  toJson(url: string, jsonObj: any) {
    jsonObj.properties = this.properties;
    jsonObj.title = this.title;
    jsonObj.type = this.lotype;
    jsonObj.summary = this.objectivesMd;
    jsonObj.img = `https://${url}/${this.img}`;
    if (this.videoid) {
      jsonObj.video = `#video/${url}/${this.videoid}`;
    }
    jsonObj.id = this.folder;
    jsonObj.route = this.link;
    jsonObj.hide = this.hide;
  }
}

export abstract class CompositeLearningObject extends LearningObject {
  los: Array<LearningObject> = [];

  protected constructor(parent?: LearningObject) {
    super(parent);
  }
}
