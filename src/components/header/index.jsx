import React from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd';

import LinkButton from '../link-button'
import { reqWeather } from '../../api'
import { fromateDate } from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


import './index.less'


class Header extends React.Component {


    state = {
        currentTime: fromateDate(Date.now()),
        dayPictureUrl: '', // 图片url
        weather: '' // 天气文本
    }
    /**
     * 退出登录
     */
    logout = (e) => {
        e.preventDefault() // 阻止 a 标签默认跳转事件
        // 显示确认提示
        Modal.confirm({
            title: '确认退出吗？',
            onOk: () => {
                console.log('ok')
                // 确定后，删除存储的用户信息
                // loacl中的
                storageUtils.removeUser()
                // 内存中的
                memoryUtils.user = {}
                // 跳转到登录页面
                this.props.history.replace()
            },
            onCancel() {
                console.log('cancel')
            }
        })
    }

    /**
     * 根据当前请求的path得到对应的title
     */
    getTitle = () => {
        let title = ''
        const path = this.props.location.pathname
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    /**
     * 获取天气信息显示
     */
    getWeather = async () => {
        const BMap = window.BMap
        const myCity = new BMap.LocalCity()
        // 获取城市名称
        myCity.get(async (result) => {
            // console.log(result.name) // 城市名称
            const { dayPictureUrl, weather } = await reqWeather(result.name)
            this.setState({
                dayPictureUrl,
                weather
            })
        })
    }


    componentDidMount() {
        // 启动 循环定时器
        this.intervalId = setInterval(() => {
            // 将 currentTile 更新为当前时间值
            this.setState({
                currentTime: fromateDate(Date.now())
            })
        }, 1000);
        // 发 jsonp 请求获取天气信息显示
        this.getWeather()
    }

    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }


    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        const user = memoryUtils.user
        // 得到当前需要显示的 title
        const title = this.getTitle()
        return (
            <div className="header">
                <div className="header-top">
                    欢迎，{user.username} &nbsp;&nbsp;

                    {/* 组件的标签体作为标签的children属性传入 */}
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * 包装成路由组件，使得 this.props 不是空对象
 */
export default withRouter(Header)