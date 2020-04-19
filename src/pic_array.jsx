import React, { Component } from "react";

class Pic_array extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input_src: null,
      pics: [{ key: 0, src: "", dist: "", link: "", name: "", emb: null }],
      nloaded: 0,
      mdlref: props.mdlref,
    };
  }

  updateData = (props) => {
    console.log(props);
    this.setState({
      pics: props,
      nloaded: 0,
    });
  };

  imgLoaded = (e, p, i) => {
    this.setState({ nloaded: this.state.nloaded + 1 });
    var emb = this.state.mdlref.predi(e.target);

    p.emb = emb;
  };

  render() {
    return (
      <div>
        {this.state.pics.map((p, i) => (
          <div>
            <img
              src={p.src}
              width="200"
              crossOrigin=""
              onLoad={(e) => this.imgLoaded(e, p, i)}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default Pic_array;
