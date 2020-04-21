class Parray {
  constructor(arr, fnc, mdlref) {
    this.model = mdlref;
    this.arr = arr;
    this.loadedCount = 0;
    this.embCount = 0;
    this.imgs = this.addImgs(arr);
    this.embs = [];
    this.cback = fnc;
  }

  addImgs(arr) {
    return arr.map((a) => this.createImg(a));
  }

  totalLoaded = () => {
    this.loadedCount = this.loadedCount + 1;
    if (this.loadedCount === this.arr.length) {
      this.embs = this.addEmbs(this.imgs);
    }
  };

  totalEmb = () => {
    this.embCount = this.embCount + 1;
    if (this.embCount === this.arr.length) {
      this.cback();
    }
  };

  createImg = (a) => {
    var img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = a.src + "?" + new Date().getTime();
    img.onload = this.totalLoaded;
    return img;
  };

  addEmbs = (imgs) => {
    return imgs.map((i) => this.getEmbs(i));
  };

  getEmbs = async (i) => {
    var emb = await this.model.predict(i);
    this.totalEmb();
    return emb;
  };
}

export default Parray;
