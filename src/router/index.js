import { createRouter, createWebHistory } from "vue-router";
import ProuctsView from "../views/PoductsView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import HomeView from "../views/HomeView.vue";
import ProductsEditView from "../views/ProductEditView.vue";
import CategoryEditView from "../views/CategoryEditView.vue";
import MeasuresView from "../views/MeasuresView.vue";
import MeasureEditView from "../views/MeasureEditView.vue";
import ColisionView from "../views/ColisionView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/products",
    name: "products",
    component: ProuctsView,
  },
  {
    path: "/categories",
    name: "categories",
    component: CategoriesView,
  },
  {
    path: "/measures",
    name: "measures",
    component: MeasuresView,
  },
  {
    path: "/products/:productId/edit",
    name: "editViewProduct",
    component: ProductsEditView,
    props: true,
  },
  {
    path: "/categories/:categoryId/edit",
    name: "editViewCategory",
    component: CategoryEditView,
    props: true,
  },
  {
    path: "/measures/:measureId/edit",
    name: "editViewMeasure",
    component: MeasureEditView,
    props: true,
  },
  {
    path: "/products/new",
    name: "newProduct",
    component: ProductsEditView,
    props: true,
  },
  {
    path: "/categories/new",
    name: "newCategory",
    component: CategoryEditView,
    props: true,
  },
  {
    path: "/measures/new",
    name: "newMeasure",
    component: MeasureEditView,
    props: true,
  },
  {
    path: "/categories/colision/:categoryName",
    name: "colisionCategory",
    component: ColisionView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
