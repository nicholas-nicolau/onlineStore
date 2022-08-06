export default class FilterJson {
  static filter(jsonObject, filterParameters) {
    jsonObject = this.getValue(jsonObject, filterParameters.path);
    switch (filterParameters.method) {
      case "equals":
        return filterParameters.valueToFilter == jsonObject;
      case "contains":
        return jsonObject
          .toLowerCase()
          .includes(filterParameters.valueToFilter.toLowerCase());
    }
  }

  //get a value from json using a dynamic path
  static getValue(jsonObject, pathToKey) {
    pathToKey.forEach((element) => {
      jsonObject = jsonObject[element];
    });
    return jsonObject;
  }
}
