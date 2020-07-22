# React学习笔记

## 有趣的点

- JSX使用小括号包住，防止自动插入分号导致的bug
  ```jsx
  const ele = (
    <A>
      <B />
      <C />
    <A>
  )
  // 其实等价于下面的写法，只是下面的写法A标签没有对齐，不够美观，但是如果直接上面那样但是去掉小括号的话，在一些情况下会出现问题
  const ele = <A>
    <B />
    <C />
  <A>
  ```
- JSX支持双引号括起的字符串类型属性，也支持花括号括起的JS表达式，这可以是任何类型的值
  ```jsx
  <Element str="onlyStringValue" all={anyValue} />
  ```
- JSX中的属性名使用小驼峰命名
- 定义组件的两种方式：函数和类，注意组件名必须大写开头，表示一个React组件
  ```jsx
  // 函数方式
  const Ele1 = (props) => {
    return (
      <h1>{props.title}</h1>
    )
  }

  // 类方式
  class Ele2 extends Component {
    render () {
      return (
        <h1>{this.props.title}</h1>
      )
    }
  }
  ```
- `setState`方法
  ```jsx
  class C extends Component {
    constructor (props) {
      super(props)
      this.state = {
        count: 0
      }
    }
    componentDidMount () {
      this.setState({
        count: 1
      })
      // 错误做法。上面对count的更新并不会马上反映到this.state上，所以下面的this.state.count还是0。
      this.setState({
        count: this.state.count + 1
      })
      // 正确做法。使用函数的形式保证之前的更新都完成后才更新
      this.setState((prevState, props) => ({
        count: prevState.count + 1
      }))
    }
  }
  ```
- 传递回调的两种方式
  ```jsx
  class C extends Component {
    constructor (props) {
      super(props)
      // 手动调用bind确保handler1回调里面的this指向组件实例
      this.handler1 = this.handler1.bind(this)
    }
    handler1 () {

    }
    // 使用最新的属性初始化语法器进行自动绑定
    handler2 = () => {

    }
    render () {
      return (
        <Foo handler1={this.handler1} handler2={this.handler2}
      )
    }
  }
  ```
- 组件数组中的key必须是唯一的
- 受控组件：将html中的select标签转化为一个受控组件
  ```jsx
  class Selector extends Component {
    static propTypes = {
      selectList: PropTypes.arrayOf({
        value: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        selected: PropTypes.boolean
      }),
      onChange: PropTypes.func.isRequired
    }
    constructor (props) {
      super(props)
      this.state = {
        selected: null
      }
    }
    componentDidMount () {
      this.setState({
        selected: this.getSelected(props.selectList)
      })
    }
    componentDidUpdate (prevProps) {
      if (prevProps.selectList !== this.props.selectList) {
        this.setState({
          selected: this.getSelected(this.props.selectList)
        })
      }
    }
    getSelected (selectList) {
      if (!selectList) {
        return null
      }
      return selectList.find((item) => item.selected)
    }
    onChange = (event) => {
      const selected = this.props.selectList.find((item) => item.value === event.target.value)
      this.setState({
        selected: selected
      }, () => {
        this.props.onChange(selected)
      })
    }
    render () {
      const {
        selectList
      } = this.props
      const {
        selected
      } = this.state

      if (!selectList) {
        return null
      }

      return (
        <select
          value={selected ? selected.value : ''}
          onChange={this.onChange}>
          {selectList.map((item) => (
            <option value={item.value}>{item.name}</option>
          ))}
        </select>
      )
    }
  }
  ```
- 只能在持有状态的组件中修改该状态，这样可以缩小出bug的范围
- props.children
  ```jsx
  const A = (props) => {
    return (
      <div>{props.children}</div>
    )
  }
  const B = () => {
    return (
      <A>
        <h1>title</h1>
        <p>content</p>
      </A>
    )
  }
  ```
- 显式写上属性值`true`
  ```jsx
  <A flag>
  // 上面的写法等价于下面的写法，但是下面的写法更清晰易懂
  <A flag={true}>
  ```
- 一般不要使用扩展语法`...`扩展组件的`props`到子组件，不够清楚传递了啥
  ```jsx
  <A {...this.props}>
  ```
- 渲染到标签中的`false`、`null`、`undefined`和`true`会被模版引擎忽略
- 继承至PureComponent的组件会对props和state做一个浅比较来决定组件是否需要重新render，当props和state中的属性浅比较没有改变时，`shouldComponentUpdate`返回`false`
- 使用索引作为key的问题：[例子](https://codepen.io/pen?&editable=true&editors=0010)（导致的问题：排序时输入框没有跟着排序）
- `React.Fragment`支持返回多个元素，而不需要包在一个数组里面返回（数组的话还需要设置key属性）。`<>`上不能设置key属性，如果需要设置key时，使用`<React.Fragment>`
  ```jsx
  const A = () => {
    return (
      <>
        <B />
        <C />
      </>
    )
    // 等价于
    return (
      <React.Fragment>
        <B />
        <C />
      </React.Fragment>
    )
  }
  ```
- `ReactDOM.createPortal(child, container)`可以将渲染的元素挂载到其他的DOM上
- 使用babel插件babel-plugin-transform-react-jsx-source可以展示组件报错的位置
- ErrorBoundary
  ```jsx
  class ErrorBoundary extends React.Component {
    /**
     * @param error - 错误实例
     * @param info - 包含componentStack属性展示组件堆栈
     **/
    componentDidCatch(error, info) {
      logErrorToMyService(error, info);
    }
    render () {
      return this.props.children
    }
  }
  ```
- 高阶组件（HOC）
- render prop模式，即本组件的内容通过调用调用者传入的一个prop方法返回渲染的内容。`react-motion`库中使用了这种方法
- `getDerivedStateFromProps`
- 模块react-test-renderer可以渲染组件到虚拟DOM那一层，不依赖react-dom或者react-native

## 参考

- [官方网站](https://reactjs.org)
- [中文翻译网站](https://react.docschina.org)
- [React v16.3 版本新生命周期函数浅析及升级方案](https://github.com/AlanWei/blog/issues/10)