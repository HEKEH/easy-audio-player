// vite.config.mts
import { resolve } from "path";
import { defineConfig } from "file:///Users/hekai/Desktop/projects/github/easy-audio-player/node_modules/.pnpm/vite@5.4.10_@types+node@22.9.0/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/hekai/Desktop/projects/github/easy-audio-player/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.10_vue@3.5.12/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///Users/hekai/Desktop/projects/github/easy-audio-player/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.1_vite@5.4.10_vue@3.5.12/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hekai/Desktop/projects/github/easy-audio-player/packages/demo";
var vite_config_default = defineConfig(({ mode }) => {
  const alias = {
    "~": resolve(__vite_injected_original_dirname, "./src/"),
    "@": resolve(__vite_injected_original_dirname, "./")
  };
  return {
    server: {
      port: 7080,
      watch: {
        ignored: [
          "!**/node_modules/easy-audio-player-vue/dist/**",
          "!**/node_modules/easy-audio-player-shared/dist/**"
        ]
      }
    },
    plugins: [vue(), vueJsx()],
    resolve: {
      alias
    },
    build: {
      minify: mode === "production"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2hla2FpL0Rlc2t0b3AvcHJvamVjdHMvZ2l0aHViL2Vhc3ktYXVkaW8tcGxheWVyL3BhY2thZ2VzL2RlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oZWthaS9EZXNrdG9wL3Byb2plY3RzL2dpdGh1Yi9lYXN5LWF1ZGlvLXBsYXllci9wYWNrYWdlcy9kZW1vL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvaGVrYWkvRGVza3RvcC9wcm9qZWN0cy9naXRodWIvZWFzeS1hdWRpby1wbGF5ZXIvcGFja2FnZXMvZGVtby92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBBbGlhc09wdGlvbnMsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgYWxpYXM6IEFsaWFzT3B0aW9ucyA9IHtcbiAgICAnfic6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvJyksXG4gICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vJyksXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHBvcnQ6IDcwODAsXG4gICAgICB3YXRjaDoge1xuICAgICAgICBpZ25vcmVkOiBbXG4gICAgICAgICAgJyEqKi9ub2RlX21vZHVsZXMvZWFzeS1hdWRpby1wbGF5ZXItdnVlL2Rpc3QvKionLFxuICAgICAgICAgICchKiovbm9kZV9tb2R1bGVzL2Vhc3ktYXVkaW8tcGxheWVyLXNoYXJlZC9kaXN0LyoqJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbdnVlKCksIHZ1ZUpzeCgpXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhcyxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgICB9LFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdZLFNBQVMsZUFBZTtBQUN4WixTQUF1QixvQkFBb0I7QUFDM0MsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUhuQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLFFBQXNCO0FBQUEsSUFDMUIsS0FBSyxRQUFRLGtDQUFXLFFBQVE7QUFBQSxJQUNoQyxLQUFLLFFBQVEsa0NBQVcsSUFBSTtBQUFBLEVBQzlCO0FBRUEsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUFBLElBQ3pCLFNBQVM7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUSxTQUFTO0FBQUEsSUFDbkI7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
