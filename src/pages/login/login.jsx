import React from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message, Layout } from 'antd'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqLogin } from '../../api/index'
import logo from '../../assets/images/logo.png'
import './login.less'

const Item = Form.Item

const { Footer, Header, Content } = Layout;

class Login extends React.Component {
    handleSubmit = (e) => {
        // 阻止事件的默认行为：阻止表单的提交
        e.preventDefault();
        // alert('发送登录的ajax请求')

        // 取出输入的相关数据
        // const form = this.props.form
        // const values = form.getFieldsValue()
        // const username = form.getFieldValue('username');
        // const password = form.getFieldValue('password');
        // console.log(values, username, password);

        // 对表单所有字段进行统一的验证
        this.props.form.validateFields(async (err, { username, password }) => {
            if (!err) {
                const result = await reqLogin(username, password)
                if (result.status === 0) {
                    // 将 user 信息保存到 local
                    const user = result.data
                    // localStorage.setItem('user_key', JSON.stringify(user))
                    storageUtils.saveUser(user)
                    // 保存到内存中
                    memoryUtils.user = user

                    // 跳转到管理界面
                    message.success('登录成功')
                    this.props.history.replace('/')
                } else {
                    message.error(result.msg)
                }
            }
        })
    };

    /**
     * 对密码进行自定义验证
     */
    validatePwd = (rule, value, callback) => {
        value = value.trim()
        if (!value) {
            callback('密码必须输入')
        } else if (value.length < 4) {
            callback('密码不能小于4位')
        } else if (value.length > 12) {
            callback('密码不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback() // 验证通过
        }

    }
    render() {

        // 读取保存的 user，如果存在，直接跳转到管理界面
        const user = memoryUtils.user
        if (user._id) {
            // this.props.history.replace('/login') // 事件回调函数中进行路由跳转
            return <Redirect to="/" /> // 自动跳转到指定的路由路径
        }

        const { getFieldDecorator } = this.props.form
        return (
            <div className="login">
                <Layout style={{ height: '100%', background: 'none' }}>
                    {/* <Header> */}
                    <div className="login-header">
                        <img src={logo} alt="" />
                        <h1>后台管理系统</h1>
                    </div>
                    {/* </Header> */}
                    <Content>
                        <div className="login-content">
                            <h1>用户登录</h1>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Item>
                                    {
                                        getFieldDecorator('username', { // 配置对象：属性名是一些特定的名称
                                            initialValue: '',// 初始值
                                            rules: [ // 声明式验证：使用插件已定义好的规则进行验证
                                                { required: true, whitespace: true, message: '用户名必须输入' },
                                                { min: 4, message: '用户名不能小于4位' },
                                                { max: 12, message: '用户名不能大于12位' },
                                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                            ],
                                        })(
                                            <Input
                                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                placeholder="用户名"
                                            />
                                        )
                                    }
                                </Item>
                                <Item>
                                    {
                                        getFieldDecorator('password', {
                                            initialValue: '',// 初始值
                                            rules: [
                                                { validator: this.validatePwd }
                                            ],
                                        })(
                                            <Input
                                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                type="password"
                                                placeholder="密码"
                                            />
                                        )
                                    }
                                </Item>
                                <Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        登 录
                            </Button>
                                </Item>
                            </Form>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: 'rgba(0, 0, 0, 0.5)' }}>
                        <div>推荐使用谷歌浏览器，可以获得更佳页面操作体验</div>
                        <div>© 2018 - {new Date().getFullYear()} 小城版权所有 <a href="http://www.beian.miit.gov.cn/" target="_blank">粤ICP备19149052号</a></div>
                    </Footer>
                </Layout>
            </div>
        )
    }
}

const WrapperForm = Form.create()(Login)

export default WrapperForm

/**
 用户名/密码的的合法性要求
  1). 必须输入
  2). 必须大于等于4位
  3). 必须小于等于12位
  4). 必须是英文、数字或下划线组成
 */

/**
 组件：组件类，本质就是一个构造函数，定义组件： class 组件/ function 组件
 组件对象：组件类的实例，也就是构造函数的实例  <MyComp></MyComp>
 */