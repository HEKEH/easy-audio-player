// @ts-nocheck
import { createElement } from 'react';
import { createRoot as createReactRoot } from 'react-dom/client';
import { createApp as createVueApp } from 'vue';

import ReactApp from './react';
import VueApp from './vue';
import './style/global.scss';

createVueApp(VueApp).mount('#vue-app');
createReactRoot(document.getElementById('react-app')!).render(
  createElement(ReactApp),
);
