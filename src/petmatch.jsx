import React, { Component } from "react";
import "./petmatch.css";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

class PetMatch extends Component {
  constructor(props) {
    super(props);

    this.dv = undefined;
    this.mainDiv = (e) => (this.dv = e);

    this.state = {
      mouseOver: false,
    };
  }

  mov = () => {
    this.setState({ mouseOver: true });
  };

  mlef = () => {
    this.setState({ mouseOver: false });
  };

  render() {
    const info = this.props.info;
    const inputSRC = this.props.inputSRC;
    const petready = this.props.petready;
    const inputready = this.props.inputready;
    const bothready = petready & inputready;

    return (
      <div
        className={this.state.mouseOver ? "mover" : "normal"}
        onMouseOver={this.mov}
        onMouseLeave={this.mlef}
        ref={this.mainDiv}
      >
        <FacebookShareButton
          url="https://mthorrell.github.io/FacePet"
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            display: petready & this.state.mouseOver ? "" : "none",
          }}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url="https://mthorrell.github.io/FacePet"
          style={{
            position: "absolute",
            bottom: "5px",
            right: "40px",
            display: petready & this.state.mouseOver ? "" : "none",
          }}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <h2 style={{ display: petready ? "" : "none" }}>{String(info.name)}</h2>
        <span>
          <img
            className="inRow"
            src={inputSRC}
            alt=""
            style={{
              display: inputready ? "inline" : "none",
            }}
          />
          <img
            className="inRow"
            alt={petready ? info.name : ""}
            crossOrigin="anonymous"
            src={info.src + "?" + new Date().getTime()}
            style={{ display: petready ? "" : "none" }}
          />
        </span>

        <div>
          <div>
            <span
              style={{
                display: bothready ? "inline" : "none",
              }}
            >
              Distance: {info.dist.toFixed(2)}
            </span>
          </div>
          <span>
            {petready ? (
              <a href={info.link} target="_blank" rel="noopener noreferrer">
                {" "}
                See more of {String(info.name)}
              </a>
            ) : (
              "LOADING PET"
            )}
          </span>
        </div>
      </div>
    );
  }
}

export default PetMatch;
