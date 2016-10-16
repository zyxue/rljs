import React from 'react'
import { Link } from 'react-router'

import './App.css';


const NavLink = React.createClass({
    render() {
        return <Link {...this.props} activeClassName="active"/>
    }
});


export default React.createClass({
    render() {
        return (
            <div>
                <h1>RLjs examples</h1>
                <nav>
                    <ul role="navigation" className="nav nav-pills">
                        <li><NavLink to="/gridworld-dp">GridWorld DP</NavLink></li>
                        <li><NavLink to="/gridworld-td">GridWorld TD</NavLink></li>
                    </ul>
                </nav>
                <br/>
                {this.props.children}
            </div>
        )
    }
});
