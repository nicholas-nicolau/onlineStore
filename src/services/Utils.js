import ApiResources from "./ApiResources";
import FilterJson from "./FilterJson";

export default class Utils {
  static async checkingForColisions(dataClass, dataId) {
    const nameRelationship = {
      categories: "category",
      measures: "measure",
    };
    let apiResponse = FilterJson.getValue(
      await ApiResources.getRequest("products"),
      "data.data"
    );
    let colisions = apiResponse.filter((element) => {
      return FilterJson.filter(element, {
        path: `attributes.${nameRelationship[dataClass]}-id`,
        valueToFilter: dataId,
        method: "equals",
      });
    });
    return colisions;
  }
}
