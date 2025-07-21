import React from 'react';
import { useCounterStore } from '../store';

const About: React.FC = () => {
  // 从 Zustand store 获取状态
  const { count, increment, decrement } = useCounterStore();

  return (
    <div style={{ padding: '20px' }}>
      <h1>关于我们</h1>
      <p>这是关于页面的内容</p>

      {/* 展示状态共享 */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        backgroundColor: '#f5f5f5'
      }}>
        <h3>状态共享演示</h3>
        <p>这里显示的计数器值与首页是同步的: <strong>{count}</strong></p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button
            onClick={increment}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            +1
          </button>
          <button
            onClick={decrement}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            -1
          </button>
        </div>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          在这个页面修改计数器，首页的值也会同步更新！
        </p>
      </div>
    </div>
  );
};

export default About; 