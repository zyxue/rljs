import DPAgent from './agents/DPAgent';
import TDAgent from './agents/TDAgent';
import DQNAgent from './agents/DQNAgent';


let RL = {
    DPAgent: DPAgent,
    TDAgent: TDAgent,
    DQNAgent: DQNAgent

    // global.SimpleReinforceAgent = SimpleReinforceAgent;
    // global.RecurrentReinforceAgent = RecurrentReinforceAgent;
    // global.DeterministPG = DeterministPG;
};

export default RL;
