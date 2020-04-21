import React, { Component } from "react";
import "./App.css";
import Model from "./Model";
import Parray from "./parray.jsx";
import * as d3 from "d3";
import PetMatch from "./petmatch";

class App extends Component {
  constructor(props) {
    super(props);

    this.emb = null;
    this.inputReady = false;
    this.petsReady = false;
    this.model = new Model();
    this.parr = new Parray(props.pdata, this.handleEmb, this.model);
    this.refdata = props.pdata;
    this.zipdata = props.zipdata;

    this.zipref = undefined;
    this.zip = (e) => (this.zipref = e);

    this.state = {
      inputURL: null,
      pdata: props.pdata,
      dsty: "border",
      inputReady: false,
      petsReady: false,
      petsFound: false,
      nmatched: 20,
    };
  }

  imgUploaded = (e) => {
    this.setState({ inputURL: URL.createObjectURL(e.target.files[0]) });
  };

  handleLoad = async (e) => {
    var input_emb = await this.model.predict(e.target);
    this.emb = input_emb;
    this.inputReady = true;
    this.setState({ inputReady: true });
    this.run();
  };

  handleEmb = (e) => {
    this.petsReady = true;
    this.setState({ petsReady: true, pdata: this.parr.arr });
    this.run();
  };

  run = async () => {
    if (!this.petsReady | !this.inputReady) {
      return;
    }
    var op = this.find_distances(this.parr.embs, this.emb);

    var pets_distances = [];
    for (var i = 0; i < this.refdata.length; i++) {
      pets_distances.push({
        dist: await op[i],
        key: this.refdata[i]["key"],
        name: this.refdata[i]["name"],
        link: this.refdata[i]["link"],
        src: this.refdata[i]["src"],
      });
    }
    pets_distances.sort(function (x, y) {
      return d3.ascending(x.dist, y.dist);
    });
    this.setState({ pdata: pets_distances });
  };

  find_distances = (pets, img_emb) => {
    var dist_array = [];
    dist_array = pets.map((el) => this.emb_compares(img_emb, el));
    return dist_array;
  };

  emb_compares = async (img_emb, pet_emb) => {
    var pe = await pet_emb;

    var distance =
      Math.pow(pe[0] - img_emb[0], 2) +
      Math.pow(pe[1] - img_emb[1], 2) +
      Math.pow(pe[2] - img_emb[2], 2) +
      Math.pow(pe[3] - img_emb[3], 2) +
      Math.pow(pe[4] - img_emb[4], 2);

    return distance;
  };

  zipInput = (e) => {
    console.log("zipinput", this.zipref.value.substr(0, 3));
    var newdat = this.zipdata.filter((d) => {
      return d.searchzip.substr(0, 5) === this.zipref.value.substr(0, 5);
    });

    if (newdat.length === 0) {
      newdat = this.zipdata.filter((d) => {
        return d.searchzip.substr(0, 4) === this.zipref.value.substr(0, 4);
      });
    }

    if (newdat.length === 0) {
      newdat = this.zipdata.filter((d) => {
        return d.searchzip.substr(0, 3) === this.zipref.value.substr(0, 3);
      });
    }

    if (newdat.length === 0) {
      newdat = this.zipdata.filter((d) => {
        return d.searchzip.substr(0, 2) === this.zipref.value.substr(0, 2);
      });
    }

    if (newdat.length === 0) {
      newdat = this.zipdata.filter((d) => {
        return d.searchzip.substr(0, 1) === this.zipref.value.substr(0, 1);
      });
    }

    if (newdat.length > 0) {
      var nmatch = Math.min(20, newdat.length);
      newdat = this.getRandomSubarray(newdat, nmatch);

      this.refdata = newdat;
      this.setState({ petsReady: false, petsFound: true, nmatched: nmatch });
      this.parr = new Parray(newdat, this.handleEmb, this.model);
    } else {
      newdat = this.getRandomSubarray(this.zipdata, 20);

      this.refdata = newdat;
      this.setState({ petsReady: false, petsFound: false, nmatched: 20 });
      this.parr = new Parray(newdat, this.handleEmb, this.model);
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Face Ventura Pet Detector</h1>
          Use Facial Recognition to find shelter pets that look like you!
          <br /> <br /> Upload your photo:{" "}
          <input type="file" onChange={this.imgUploaded} />
          <br /> Input your zipcode:
          <span>
            <input type="text" size="6" maxLength="5" ref={this.zip} />
            <button onMouseUp={this.zipInput}>Refresh</button>
          </span>
          <div>
            {this.state.petsFound
              ? "Found nearby pets! Showing " +
                String(this.state.nmatched) +
                " pets."
              : "No nearby pets, showing " +
                String(this.state.nmatched) +
                " pets in the US."}
          </div>
          <br />
          <div className={this.state.petsReady ? "" : "loading"}>
            Loading Model and Data {this.state.petsReady ? "✅" : ""}
          </div>
          <br />
        </header>
        <div>
          <span style={{ display: this.state.inputReady ? "inline" : "none" }}>
            Matching{" "}
            <img
              src={this.state.inputURL}
              alt=""
              onLoad={this.handleLoad}
              width="15%"
            />{" "}
            with pets available for adoption.
          </span>
          <div>
            {this.state.pdata.map((p) => (
              <PetMatch
                info={p}
                inputSRC={this.state.inputURL}
                petready={this.state.petsReady}
                inputready={this.state.inputReady}
              />
            ))}
          </div>
        </div>
        <br />
        <br />
        <footer className="App-footer">
          Data retrieved from the petfinder.com API.
        </footer>
      </div>
    );
  }

  //Zip code information from
  //<a href="https://simplemaps.com/data/us-zips">
  //  https://simplemaps.com/data/us-zips
  //</a>
  //.

  getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      min = i - size,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }
}
//https://simplemaps.com/data/us-zips
export default App;
