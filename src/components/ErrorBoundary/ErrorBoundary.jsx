import PropTypes from 'prop-types'
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  static propTypes = {
    downgrade: PropTypes.node, //触发错误后显示的元素
  }
  static defaultProps = {
    downgrade: null,
  }
  constructor(props) {
    super(props)
    this.state = {
      catched: false, //是否已触发错误
    }
  }
  render() {
    const {
      state: { catched },
      props: { downgrade, children },
    } = this
    return catched ? downgrade : children
  }
  static getDerivedStateFromError(e) {
    console.error(e)
    return { catched: true }
  }
}
