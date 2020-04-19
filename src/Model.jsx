import * as tf from "@tensorflow/tfjs";

class Model {
  constructor(props) {
    this.model = tf.loadLayersModel("model/model.json");
  }

  predict = async (image) => {
    const mdl = await this.model;
    image.crossOrigin = "";
    var cvs = document.createElement("canvas");
    cvs.width = 20;
    cvs.height = 20;

    var ctx = cvs.getContext("2d");
    ctx.drawImage(image, 0, 0, 20, 20);

    var img_t_bw = this.tensor_grayscale(tf.browser.fromPixels(cvs)).reshape([
      1,
      20,
      20,
      1,
    ]);

    var output = mdl.predict(img_t_bw).arraySync()[0];
    return output;
  };

  tensor_grayscale(x) {
    const rFactor = tf.scalar(0.299); // copies the values from torch
    const gFactor = tf.scalar(0.587);
    const bFactor = tf.scalar(0.114);

    // separate out each channel. x.shape[0] and x.shape[1] will give you
    // the correct dimensions regardless of image size
    var r = x.slice([0, 0, 0], [x.shape[0], x.shape[1], 1]);
    var g = x.slice([0, 0, 1], [x.shape[0], x.shape[1], 1]);
    var b = x.slice([0, 0, 2], [x.shape[0], x.shape[1], 1]);

    // add all the tensors together, as they should all be the same dimensions.
    var gray = r.mul(rFactor).add(g.mul(gFactor)).add(b.mul(bFactor));
    var gray = gray.mul(tf.scalar(1.0 / 255.0));

    return gray;
  }
}

export default Model;
