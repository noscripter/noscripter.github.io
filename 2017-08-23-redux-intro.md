<!DOCTYPE html>
<html lang="en" class="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Content-Language" content="en">
    <link rel="stylesheet" type="text/css" href="./css/github-syntax-highlight.css">
    <link rel="stylesheet" type="text/css" href="./css/github-markdown.css">
    <style>
      .markdown-body {
        min-width: 200px;
        margin: 0 auto;
        padding: 30px;
      }
    </style>
  </head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="repository-with-sidebar repo-container new-discussion-timeline with-full-navigation">
        <div id="js-repo-pjax-container" class="repository-content context-loader-container">
          <div id="readme" class="boxed-group flush clearfix announce instapaper_body md">
            <article class="markdown-body"><h2>React 工程实践之 Redux 入门</h2>
<h3>为什么要用 redux</h3>
<ul>
<li>使用对象来描述应用状态</li>
<li>使用 pure function 来管理应用状态变化</li>
<li>应用状态可回溯</li>
<li>应用状态可预测</li>
</ul>
<p>总结一下，使用 redux 需要解决的是 React 应用中复杂状态管理的问题。</p>
<p><code>pure function</code>是满足下面两个条件的函数：</p>
<ol>
<li>输入相同参数总是得到相同的输出结果；</li>
<li>函数执行后不会修改输入参数的值。</li>
</ol>
<blockquote>
<p>参考：
<a href="https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367">https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367</a>
<a href="https://en.wikipedia.org/wiki/Pure_function">https://en.wikipedia.org/wiki/Pure_function</a></p>
</blockquote>
<h3>redux 的原理</h3>
<pre><code class="language-javascript"><span class="hljs-pi">'use strict'</span>;

<span class="hljs-keyword">const</span> counter = (state = { value: <span class="hljs-number">0</span> }, action) =&gt; {
  <span class="hljs-keyword">switch</span> (action.type) {
    <span class="hljs-keyword">case</span> <span class="hljs-string">'INCREMENT'</span>:
      <span class="hljs-keyword">return</span> { value: state.value + <span class="hljs-number">1</span> };
    <span class="hljs-keyword">case</span> <span class="hljs-string">'DECREMENT'</span>:
      <span class="hljs-keyword">return</span> { value: state.value - <span class="hljs-number">1</span> };
    <span class="hljs-keyword">default</span>:
      <span class="hljs-keyword">return</span> state;
  }
};

<span class="hljs-comment">/**
 * mock redux using class
 */</span>
<span class="hljs-keyword">export</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">ReduxCounter</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">Component</span> </span>{
  state = counter(<span class="hljs-literal">undefined</span>, {});

  dispatch(action) {
    <span class="hljs-keyword">this</span>.setState(prevState =&gt; counter(prevState, action));
  }

  increment = () =&gt; {
    <span class="hljs-keyword">this</span>.dispatch({ type: <span class="hljs-string">'INCREMENT'</span> });
  }

  decrement = () =&gt; {
    <span class="hljs-keyword">this</span>.dispatch({ type: <span class="hljs-string">'DECREMENT'</span> });
  }

  render() {
    <span class="hljs-keyword">return</span> (
      <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-title">div</span>&gt;</span>
        {this.state.value}
        <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">onClick</span>=<span class="hljs-value">{this.increment}</span>&gt;</span>+<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-title">button</span> <span class="hljs-attribute">onClick</span>=<span class="hljs-value">{this.decrement}</span>&gt;</span>-<span class="hljs-tag">&lt;/<span class="hljs-title">button</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-title">div</span>&gt;</span>
    )</span>;
  }
}
</code></pre>
<p>几个核心的概念：</p>
<ul>
<li>所有的状态变化都通过 reducer 执行（例如上例的 dispatch）</li>
<li>reducer 函数都是 pure function（例如上面的 counter 函数）</li>
<li>状态变化都通过 action 对象来描述（例如：<code>{ type: 'INCREMENT' }</code>）</li>
</ul>
<p>redux 原则</p>
<ul>
<li>应用的所有状态都存储在一个 store 里
<ul>
<li>store 是 redux 里用来存储应用状态数的 JavaScript 对象</li>
</ul>
</li>
<li>状态只读
<ul>
<li>所有状态改变都通过 action 触发
<ul>
<li>action 是描述状态变化的 JavaScript 对象</li>
</ul>
</li>
</ul>
</li>
<li>状态变化通过 pure function 执行
<ul>
<li>可以通过 action 来预测状态变化</li>
<li>状态变化是确定的</li>
</ul>
</li>
</ul>
<h3>redux vs flux</h3>
<p>flux 的模式可以描述为：<code>(state, action) =&gt; state</code>。</p>
<p>区别在于， flux 通过事件机制来实现，而 redux 则采用了 pure function。</p>
<p>在 redux 中不能修改数据，每次状态变化都要返回一个新的数据对象。</p>
<p>建议使用<a href="https://facebook.github.io/immutable-js">immutable-js</a>来实现。</p>
<p>通过 pure function 和不可变数据（immutable-js），可以减少重绘和重新计算带来的性能损耗，虽然可能因为对象分配造成一些内容消耗。</p>
<blockquote>
<p>参考：<a href="https://github.com/reactjs/redux/issues/328#issuecomment-125035516">https://github.com/reactjs/redux/issues/328#issuecomment-125035516</a></p>
</blockquote>
<h3>一图胜千言</h3>
<p><img src="https://img.alicdn.com/tfs/TB1uXFOXgoQMeJjy0FlXXa8CXXa-1440-1080.gif" alt=""></p>
<blockquote>
<p>来源:<a href="https://github.com/reactjs/redux/issues/653#issuecomment-216844781">https://github.com/reactjs/redux/issues/653#issuecomment-216844781</a></p>
</blockquote>
<h3>实践</h3>
<p>了解上面这些基础概念了，let's get our hands dirty!</p>
<p>示例：<a href="http://redux.js.org/docs/introduction/Examples.html">http://redux.js.org/docs/introduction/Examples.html</a></p>
</article>
          </div>
        </div>
      </div>
    </div>
  </div>


</body>
</html>
