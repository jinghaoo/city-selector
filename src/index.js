import citySelector from './vue2-city-selector/index'

const components = [
    citySelector
]
  
const install = function(Vue) {
    if (install.installed) return
    components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    citySelector
}

export {
    citySelector
}