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

  static async updatingProducts(paramaterObject, typeOfUpdating, idToDelete) {
    let names = {
      categories: "category",
      measures: "measure",
      categoriesPT: "categoria",
      measuresPT: "unidade de medida",
    };
    let products = FilterJson.getValue(
      await ApiResources.getRequest("products"),
      "data.data"
    );
    let productsId = Object.keys(paramaterObject);
    products = products.filter((product) => productsId.includes(product.id));
    for (let i = 0; i < products.length; i++) {
      products[i]["attributes"][names[typeOfUpdating] + "-id"] =
        paramaterObject[products[i].id];
    }

    let responses = products.map(async (element) => {
      this.product = {
        name: element.attributes.name,
        category_id: element.attributes["category-id"],
        measure_id: element.attributes["measure-id"],
        stock: element.attributes.stock,
        value: element.attributes.value,
        highlight: element.attributes.highlight,
        details: element.attributes.details,
      };
      await ApiResources.patchRequest(
        `products/${element.id}`,
        "product",
        this.product
      );
    });
    await Promise.all(responses);
    await ApiResources.deleteRequest(`${typeOfUpdating}/${idToDelete}`);
    window.alert(
      `Produtos atualizados e ${
        names[typeOfUpdating + "PT"]
      } excluída com sucesso`
    );
  }
}
