/* This component defines common control methods used by other views. Be noted
that this control has nothing to do with the control as in TD control */


import React from 'react';


class Control extends React.Component {
    updateAgent(attr, event) {
        let agent = this.state.agent;
        console.debug('updated ' + attr + ' to ' + event.target.value);
        agent[attr] = event.target.value;
        this.setState({agent: agent});

        if (attr === 'actingRate') {
            this.stopConsecutiveActions();
            this.startConsecutiveActions(agent.actingRate);
        }
    }

    updateEnv(attr, event) {
        let agent = this.state.agent;
        console.debug('updated ' + attr + ' to ' + event.target.value);
        // data type is an issue!
        agent.env[attr] = Number(event.target.value);
        // resetting is important, don't forget! it resets all states.
        // agent.reset() resets env, too.
        agent.env.reset();
        agent.reset();
        this.setState({agent: agent});
    }

    toggleLegend(key, event) {
        let legendsCtrl = this.state.legendsCtrl;
        legendsCtrl[key] = !legendsCtrl[key];
        this.setState(legendsCtrl: legendsCtrl);
    }

    startConsecutiveActions(actingRate) {
        let ar = actingRate === undefined? this.state.agent.actingRate: actingRate;
        // console.debug(ar);
        let intervalId = setInterval (() => {
            this.state.agent.act();
            this.setState({agent: this.state.agent});
        }, ar);
        this.setState({intervalId: intervalId});
    }

    stopConsecutiveActions() {
        if (this.inConsecutiveActions()) {
            clearInterval(this.state.intervalId);
            this.setState({intervalId: undefined});
        }
    }

    inConsecutiveActions() {
        // check if consecutive action mode is on
        return this.state.intervalId === undefined? false : true;
    }

    toggleConsecutiveActions() {
        // console.debug(this.state.intervalId);
        if (this.inConsecutiveActions()) {
            this.stopConsecutiveActions();
        } else {
            this.startConsecutiveActions();
        }
    }

    updateSelectedState(state) {
        if (this.state.selectedState !== null) {
            if (state.id === this.state.selectedState.id) {
                this.setState({selectedState: null});
                return
            }
        }
        this.setState({selectedState: state});
    }

    setSelectedStateAs(key) {
        let env = this.state.env;
        let st = this.state.selectedState;
        if (key === 'startingState') {
            st.isCliff = false;
            env.startingState = st;
        } else if (key === 'terminalState') {
            // set reward of old terminal to 0 so as to avoid stuck in old
            // terminalState taking advantage of plus reward
            env.terminalState.reward = 0;
            st.isCliff = false // terminal state cannot be cliff
            env.terminalState = st;
            env.terminalState.reward = 1;
        } else if (key === 'cliff') {
            if (st.id !== env.startingState.id && st.id !== env.terminalState.id)
                st.isCliff = !st.isCliff;
        }
        this.setState({env: env});
    }

    adjustSelectedReward(event) {
        let st = this.state.selectedState;
        st.reward = parseFloat(event.target.value);
        this.setState({selectedState: st});
    }

    handleUserCtrlButtonClick(action, event) {
        if (action === 'act') {
            this.state.agent.act();
        } else if (action === 'toggle') {
            this.toggleConsecutiveActions();
        } else if (action === 'learn') {
            this.state.agent.learnFromBatchEpisodes();
        } else if (action === 'reset') {
            this.state.agent.reset();
        }
        this.setState({agent: this.state.agent});
    }
}


export default Control;
