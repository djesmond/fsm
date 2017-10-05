import Vue from 'vue';
import App from './components/App.vue';

new Vue({
  el: '#vue',
  render(createElement) {
    return createElement(App, {
        props: {
           
        },
    });
},
});