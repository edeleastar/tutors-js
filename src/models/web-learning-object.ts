import { copyResource } from './loutils';
import { LearningObject } from './learningobjects';
import { readFile } from '../utils/futils';
import * as fs from 'fs';

export abstract class WebLearningObject extends LearningObject {
  protected constructor(parent: LearningObject, resourceId: string) {
    super(parent);
    this.link = readFile(resourceId);
  }
  publish(path: string): void {}
}

export class Video extends WebLearningObject {
  videoid: string;

  constructor(parent: LearningObject) {
    super(parent, 'videoid');
    super.reap('video');
    this.lotype = 'video';
    this.videoid = readFile('videoid');
  }
  publish(path: string): void {
    copyResource(this.folder!, path);
  }
}

export class PanelVideo extends WebLearningObject {
  videoid: string;

  constructor(parent: LearningObject) {
    super(parent, 'videoid');
    super.reap('panelvideo');
    this.lotype = 'panelvideo';
    this.videoid = readFile('videoid');
  }
  publish(path: string): void {
    copyResource(this.folder!, path);
  }
}

export class Git extends WebLearningObject {
  githubid?: string;
  videoid?: string;

  constructor(parent: LearningObject) {
    super(parent, 'githubid');
    super.reap('github');
    this.lotype = 'github';
    this.videoid = 'none';
    if (fs.existsSync('videoid')) {
      this.videoid = readFile('videoid');
    }
  }

  publish(path: string): void {
    copyResource(this.folder!, path);
  }
}

export class Web extends WebLearningObject {
  weburl?: string;

  constructor(parent: LearningObject) {
    super(parent, 'weburl');
    super.reap('web');
    this.lotype = 'web';
  }

  publish(path: string): void {
    copyResource(this.folder!, path);
  }
}
