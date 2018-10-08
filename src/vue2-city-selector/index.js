import CitySelector from './src/city-selector.vue';

CitySelector.install = function (Vue) {
  Vue.component(CitySelector.name, CitySelector);
};

export default CitySelector;
