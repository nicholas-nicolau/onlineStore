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
}
