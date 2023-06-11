type ICallback = () => any;

export class Controller {
  observerList = [] as Array<ICallback>;

  attach(observer: ICallback) {
    this.observerList.push(observer);
  }

  abort() {
    while (this.observerList.length) {
      const callback = this.observerList.pop();
      callback();
    }
  }
}
