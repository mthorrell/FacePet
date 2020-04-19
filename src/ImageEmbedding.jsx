import React, { Component } from "react";
import * as tf from "@tensorflow/tfjs";

class ImageEmbedding extends Component {
  constructor(props) {
    super(props);

    this.cvs = null;
    this.setCanvas = (e) => (this.cvs = e);

    this.img = null;
    this.setImage = (e) => (this.img = e);

    this.calculateEmbedding = this.calculateEmbedding.bind(this);

    this.state = {
      src: props.src,
      embedding: [0.0, 0.0, 0.0, 0.0, 0.0],
      model: props.mdlref,
      link: props.link,
      dist: 100.0,
    };
  }

  image_to_canvas_to_tensor = () => {
    var ctx = this.cvs.getContext("2d");
    ctx.drawImage(this.img, 0, 0, 20, 20);

    var img_t_bw = this.tensor_grayscale(
      tf.browser.fromPixels(this.cvs)
    ).reshape([1, 20, 20, 1]);
    return img_t_bw;
  };

  async calculateEmbedding() {
    var img_t = this.image_to_canvas_to_tensor();
    const mdl = await this.state.model;
    this.setState({
      embedding: mdl.predict(img_t).arraySync()[0],
    });
    console.log("calcembed", mdl.predict(img_t).arraySync()[0]);
  }

  componentDidUpdate(props) {
    console.log("component updated", props);
    console.log("this props", this.props);
    if (this.props.src !== props.src) {
      this.setState({ src: this.props.src });
    }
  }

  render() {
    return (
      <div>
        <span>
          <a href={this.state.link} target="_blank">
            <img
              src={this.state.src}
              alt=""
              ref={this.setImage}
              width="100"
              crossOrigin=""
              onLoad={this.calculateEmbedding}
            />
          </a>
          {this.state.dist}
        </span>
        <canvas
          ref={this.setCanvas}
          width="20"
          height="20"
          style={{ display: "none" }}
        />
      </div>
    );
  }

  tensor_grayscale(x) {
    const rFactor = tf.scalar(0.299); // copies the values from torch
    const gFactor = tf.scalar(0.587);
    const bFactor = tf.scalar(0.114);

    // separate out each channel. x.shape[0] and x.shape[1] will give you
    // the correct dimensions regardless of image size
    var r = x.slice([0, 0, 0], [x.shape[0], x.shape[1], 1]);
    var g = x.slice([0, 0, 1], [x.shape[0], x.shape[1], 1]);
    var b = x.slice([0, 0, 2], [x.shape[0], x.shape[1], 1]);

    console.log("b", b.arraySync());

    // add all the tensors together, as they should all be the same dimensions.
    var gray = r.mul(rFactor).add(g.mul(gFactor)).add(b.mul(bFactor));
    var gray = gray.mul(tf.scalar(1.0 / 255.0));

    return gray;
  }
}

export default ImageEmbedding;
