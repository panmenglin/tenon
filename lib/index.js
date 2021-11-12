"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalState = exports.TenonContainer = void 0;
const global_state_1 = require("./global-state");
const container_1 = require("./container");
Object.defineProperty(exports, "TenonContainer", { enumerable: true, get: function () { return container_1.TenonContainer; } });
const globalState = (0, global_state_1.initGlobalState)();
exports.globalState = globalState;
exports.default = {
    TenonContainer: container_1.TenonContainer,
    globalState,
};
