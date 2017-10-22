import Vue from 'vue';
import App from './components/App.vue';

// eslint-disable-next-line no-new
new Vue({
  el: '#vue',
  render(createElement) {
    return createElement(App, {
      props: {},
    });
  },
});
