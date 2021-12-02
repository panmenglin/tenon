import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from 'react';
import root from 'react-shadow';
import retargetEvents from 'react-shadow-dom-retarget-events';

// tenon
import { globalState } from './index';
import { load, blockLifeCycle } from './load';

// styles
import './index.less';

// types
import { TenonBlock } from './type';

type Props = {
  block: TenonBlock;
  style?: CSSProperties;
  data?: Record<string, string>;
  mode?: 'development' | 'production';
};

export const TenonContainer = (props: Props): ReactElement => {
  const { block, style, data, mode = 'production' } = props;

  const shadowDom: any = useRef(null);
  const blockRoot: any = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [curBlock, setCurBlock] = useState<TenonBlock | null>();

  const asyncBlock =
    mode === 'development' && block.import && typeof block.import === 'string';

  /**
   * 更新加载状态
   */
  const updateLoaded = useCallback(() => {
    setLoaded(true);
  }, [setLoaded]);

  useEffect(() => {
    if (JSON.stringify(block) === JSON.stringify(curBlock)) {
      return;
    }
    setCurBlock(block);
  }, [block, curBlock]);

  useLayoutEffect(() => {
    if (shadowDom?.current) {
      retargetEvents(shadowDom?.current);
    }
  }, [shadowDom]);

  useLayoutEffect(() => {
    load({
      config: {
        ...block,
      },
      callback: updateLoaded,
      root: () => new Promise(resolve => {
        setTimeout(() => {
          resolve(shadowDom?.current?.shadowRoot);
        })
      })
    });
  }, [curBlock, shadowDom.current]);

  /**
   * 异步调用渲染方法
   */
  const asyncRenderFn = useCallback(
    async (blockItem, _props) => {
      const RenderFn = blockLifeCycle(blockItem.key).mount;
      // unmount
      try {
        // vue2 $mount 方法会替换 dom unmount 时晴空 blockRoot 重新添加 div.render-root
        blockRoot.current.innerHTML = '';
        const renderRoot = document.createElement('div');
        renderRoot.className = 'render-root';
        blockRoot.current.appendChild(renderRoot);
      } catch (error) {}

      await RenderFn(
        shadowDom?.current?.shadowRoot.querySelectorAll('.render-root')[0],
        {
          ..._props,
          onGlobalStateChange: globalState.onChange,
          setGlobalState: globalState.set,
          getGlobalState: globalState.get,
        }
      );
    },
    [curBlock]
  );

  /**
   * 资源渲染
   */
  const componentRender = useCallback(
    (blockItem, _props) => {
      const isAsync =
        blockItem.import && typeof blockItem.import === 'string' ? true : false;

      if (isAsync) {
        asyncRenderFn(blockItem, _props);
        return null;
      }

      const RenderFn = blockItem.import;
      return (
        <RenderFn
          {..._props}
          onGlobalStateChange={globalState.onChange}
          setGlobalState={globalState.set}
          getGlobalState={globalState.get}
        />
      );
      // );
    },
    [curBlock]
  );

  return useMemo(
    () => (
      <div
        className={`block-container ${asyncBlock ? 'async-block' : ''}`}
        style={{
          height: !loaded ? '200px' : '100%',
          ...style,
        }}
      >
        {asyncBlock ? (
          <div className="devtool-block-info">
            {curBlock?.name} / {curBlock?.import}
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

        {curBlock?.import && typeof curBlock?.import === 'string' ? (
          <root.div delegatesFocus={true} ref={shadowDom}>
            {/* vue2 $mount 方法会替换 dom 此处需要在 render-root 外包括 dom 以保证 react-dom 正常 remove */}
            <div ref={blockRoot}>
              <div className="render-root">
                {loaded
                  ? componentRender(curBlock, {
                      ...data,
                    })
                  : null}
              </div>
            </div>
          </root.div>
        ) : (
          <div className="render-root">
            {loaded
              ? componentRender(curBlock, {
                  ...data,
                })
              : null}
          </div>
        )}
      </div>
    ),
    [curBlock, loaded]
  );
};
