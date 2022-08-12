export default class FilterJson {
  static filter(jsonObject, filterParameters) {
    jsonObject = this.getValue(jsonObject, filterParameters.path);
    switch (filterParameters.method) {
      case "equals":
        return (
          filterParameters.valueToFilter.toString() == jsonObject.toString()
        );
      case "contains":
        return jsonObject
          .toString()
          .toLowerCase()
          .includes(filterParameters.valueToFilter.toLowerCase());
    }
  }

  //get a value from json using a dynamic path
  static getValue(jsonObject, pathToKey) {
    if (typeof pathToKey == "string") {
      pathToKey = pathToKey.split(".");
    }
    pathToKey.forEach((element) => {
      jsonObject = jsonObject[`${element}`];
    });
    return jsonObject;
  }
}
