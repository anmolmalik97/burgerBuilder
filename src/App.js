import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route,Switch,withRouter,Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import {connect} from 'react-redux';
import * as actions from './store/actions/index';
import AsyncComponent from './hoc/AsyncComponent/AsyncComponent';

const asyncCheckout = AsyncComponent(() => {
  return import('./containers/Checkout/Checkout')
})

const asyncOrders = AsyncComponent(() => {
  return import('./containers/Orders/Orders')
})

const asyncAuth = AsyncComponent(() => {
  return import('./containers/Auth/Auth')
})

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  
  render() {
    let routes = (
        <Switch>
          <Route path  = '/' exact component = {BurgerBuilder} />
          <Route path = '/auth' component = {asyncAuth}/>
          <Redirect to = '/' />
        </Switch>
      );
    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path  = '/' exact component = {BurgerBuilder} />
          <Route path  = '/orders' exact component = {asyncOrders} />
          <Route path = '/logout' component = {Logout}/>
          <Route path = '/checkout' component = {asyncCheckout}/>
          <Route path = '/auth' component = {asyncAuth}/>
          <Redirect to = '/' />
        </Switch>
      )
    }

    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    isAuthenticated:  state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
