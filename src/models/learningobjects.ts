import * as fs from 'fs';
import * as path from 'path';
import { getHeader, getImageFile, getParentFolder, readPropsFromTree, withoutHeader } from '../utils/futils';
import { Properties } from './properties';

export abstract class LearningObject {
  parent?: LearningObject;
  course?: LearningObject;
  lotype: string;
  title?: string;
  img?: string;
  link?: string;
  folder?: string;
  parentFolder?: string;
  objectivesMd?: string;
  properties?: Properties;
  jsonProperties?: string;

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
    this.properties = readPropsFromTree();
    if (this.properties.courseurl) {
      let domain = this.properties.courseurl.substring(this.properties.courseurl.indexOf('//') + 2);
      this.properties.basecourseurl = domain;
    }
    if (fs.existsSync('properties.yaml')) {
      this.jsonProperties = JSON.stringify(this.properties);
    } else {
      this.jsonProperties = '{}';
    }
    if (fs.existsSync(pattern + '.md')) {
      this.title = getHeader(pattern + '.md');
      this.title = this.title + ' ';

      this.objectivesMd = withoutHeader(pattern + '.md');
      this.objectivesMd = this.objectivesMd.replace(/(\r\n|\n|\r)/gm, '');
      this.objectivesMd = this.objectivesMd.replace(/\"/g, "'");
      this.objectivesMd = this.objectivesMd.replace(/\t/g, ' ');
    } else {
      this.title = pattern;
    }
  }

  abstract publish(path: string): void;
}

export abstract class CompositeLearningObject extends LearningObject {
  los: Array<LearningObject> = [];

  protected constructor(parent?: LearningObject) {
    super(parent);
  }
}
