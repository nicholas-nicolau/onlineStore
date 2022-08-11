import axios from "axios";

export default class ApiResources {
  resolvedPromise;
  static async getRequest(requestType) {
    await axios
      .get(`http://127.0.0.1:3000/${requestType}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        this.resolvedPromise = response;
      });
    return this.resolvedPromise;
  }
  static async patchRequest(url, objectName, object) {
    let options = {
      headers: {
        Accept: "multipart/form-data",
      },
    };
    let body = {};
    body[objectName] = object;
    await axios
      .put(`http://127.0.0.1:3000/${url}`, body, options)
      .then((response) => {
        this.resolvedPromise = response;
      });
    return this.resolvedPromise;
  }
  static async deleteRequest(url) {
    let options = {
      headers: {
        Accept: "application/json",
      },
    };
    await axios
      .delete(`http://127.0.0.1:3000/${url}`, options)
      .then((response) => {
        this.resolvedPromise = response;
      });
    return this.resolvedPromise;
  }
  static async postRequest(url, objectName, object) {
    let options = {
      headers: {
        Accept: "multipart/form-data",
      },
    };
    let body = {};
    body[objectName] = object;
    await axios
      .post(`http://127.0.0.1:3000/${url}`, body, options)
      .then((response) => {
        this.resolvedPromise = response;
      });
    return this.resolvedPromise;
  }
}
