import React from 'react';
import { useCounterStore } from '../store';

const Home: React.FC = () => {
  // 使用 Zustand store
  const { count, increment, decrement, reset, setCount } = useCounterStore();

  return (
    <div style={{ padding: '20px' }}>
      <h1>首页</h1>
      <p>欢迎来到React应用首页</p>

      {/* Zustand 计数器示例 */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Zustand 状态管理示例</h2>
        <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>
          计数器: {count}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={increment}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            增加 (+1)
          </button>

          <button
            onClick={decrement}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            减少 (-1)
          </button>

          <button
            onClick={reset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重置
          </button>

          <button
            onClick={() => setCount(10)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            设置为10
          </button>
        </div>

        <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
          这个计数器使用 Zustand 进行状态管理，状态会在组件间共享。
        </p>
      </div>
    </div>
  );
};

export default Home; 