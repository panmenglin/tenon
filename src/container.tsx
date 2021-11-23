import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import root from 'react-shadow';
import retargetEvents from 'react-shadow-dom-retarget-events';

// utils
import { load, blockRender } from './load';

// styles
import './index.less';

// stores
import { globalState } from './index';

// types
import { History } from 'history';
import { TenonBlock } from './type';

type Props = {
  block: TenonBlock;
  style?: CSSProperties;
  history: History;
  data?: Record<string, string>;
  mode?: 'development' | 'production';
};

export const TenonContainer = (props: Props): ReactElement => {
  const { block, style, data, history, mode = 'production' } = props;

  const shadowDom: any = useRef(null);

  const [loaded, setLoaded] = useState(false);

  const asyncBlock =
    mode === 'development' && block.import && typeof block.import === 'string';

  /**
   * 更新加载状态
   */
  const updateLoaded = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);

  useEffect(() => {
    load({
      config: {
        ...block,
      },
      callback: updateLoaded,
      root: () => {
        return shadowDom?.current?.shadowRoot;
      },
    });
  }, []);

  useEffect(() => {
    if (shadowDom?.current) {
      retargetEvents(shadowDom?.current);
    }
  }, [shadowDom]);

  /**
   * 资源渲染
   */
  const componentRender = useCallback(
    (blockItem, _props) => {
      const RenderFn =
        blockItem.import && typeof blockItem.import === 'string'
          ? blockRender(blockItem.key)
          : blockItem.import;

      return blockItem.import && typeof blockItem.import === 'string' ? (
        RenderFn(
          shadowDom?.current?.shadowRoot.querySelectorAll('.render-root')[0],
          {
            history: history,
            ..._props,
            onGlobalStateChange: globalState.onChange,
            setGlobalState: globalState.set,
            getGlobalState: globalState.get,
          }
        )
      ) : (
        <RenderFn
          history={history}
          {..._props}
          onGlobalStateChange={globalState.onChange}
          setGlobalState={globalState.set}
          getGlobalState={globalState.get}
        />
      );
    },
    [history, shadowDom]
  );

  return (
    <div
      className={`block-container ${asyncBlock ? 'async-block' : ''}`}
      style={{
        height: !loaded ? '200px' : '100%',
        ...style,
      }}
    >
      {asyncBlock ? (
        <div className="devtool-block-info">
          {block.name} - {block.domain} / {block.import}
        </div>
      ) : null}

      {!loaded ? (
        <div className="spin spin-spinning">
          <span className="spin-dot spin-dot-spin">
            <i className="spin-dot-item"></i>
            <i className="spin-dot-item"></i>
            <i className="spin-dot-item"></i>
            <i className="spin-dot-item"></i>
          </span>
        </div>
      ) : null}

      {block.import && typeof block.import === 'string' ? (
        <root.div delegatesFocus={true} ref={shadowDom}>
          {/* vue $mount 方法会替换 dom 此处需要在 render-root 外包括 dom 以保证 react-dom 正常 remove */}
          <div>
            <div className="render-root">
              {loaded
                ? componentRender(block, {
                    ...data,
                  })
                : null}
            </div>
          </div>
        </root.div>
      ) : (
        <div className="render-root">
          {loaded
            ? componentRender(block, {
                ...data,
              })
            : null}
        </div>
      )}
    </div>
  );
};
