import { initGlobalState } from './global-state';
import { TenonContainer } from './container'

import type { TenonBlock } from './type';

const globalState = initGlobalState()

export { TenonContainer, TenonBlock, globalState }

export default {
  TenonContainer,
  globalState,
}