import { Course } from '../models/course';
import { LearningObject } from '../models/learningobjects';
import { writeFile } from '../utils/futils';
import { Topic } from '../models/topic';
import { Unit } from '../models/unit';

export class JsonView {
  constructor(private path: string, private course: Course) {}

  route(lo: LearningObject, url: string): string {
    let route = '';
    switch (lo.lotype) {
      case 'topic':
        route = `#${lo.lotype}/${url}`;
        break;
      case 'video':
        route = `#video/${url}/${lo.videoid}`;
        break;
    }
    return route;
  }

  base(json: any, lo: LearningObject, url: string): void {
    json.properties = lo.properties;

    json.title = lo.title;
    json.type = lo.lotype;
    json.summary = lo.objectivesMd;
    json.img = `https://${url}/${lo.img}`;
    if (lo.videoid) {
      json.video = `#video/${url}/${lo.videoid}`;
    }
    json.id = lo.folder;
    json.route = this.route(lo, url);
  }

  unit(loJson: any, unit: Unit, url: string) {
    loJson.los = [];
    let unitJson: any = {};
    unit.los.forEach(lo => {
      this.base(unitJson, lo, url + unit.folder + '/' + lo.folder);
      loJson.los.push(unitJson);
    });
  }

  topic(topic: Topic, url: string): any {
    let topicJson: any = {};
    this.base(topicJson, topic, url);
    topicJson.los = [];
    topic.los.forEach(lo => {
      let loJson: any = {};
      this.base(loJson, lo, url + topic.folder + '/' + lo.folder);
      if (lo.lotype == 'unit') {
        this.unit(loJson, lo as Unit, url);
      }
      topicJson.los.push(loJson);
    });
    return topicJson;
  }

  publish(): void {
    let courseUrl = this.course!.properties!.courseurl;
    let baseCourseUrl = courseUrl.substring(courseUrl.indexOf('//') + 2);

    let courseJson: any = {};
    this.base(courseJson, this.course, courseUrl);
    courseJson.los = [];
    this.course.los.forEach(lo => {
      courseJson.los.push(this.topic(lo as Topic, baseCourseUrl));
    });

    writeFile(this.path, 'course.json', JSON.stringify(courseJson));
  }
}
