import React from 'react';

import * as MathJax from 'react-mathjax';

const I = (props) => <MathJax.Node inline>{props.children}</MathJax.Node>;

class Intro extends React.Component {
    render() {
        return (
<MathJax.Context>
    <div>
        <h4>Instruction:</h4>

        <p> <strong>Policy itertion</strong> is basically repeating <b>policy
        evaluation</b> and <b>policy improvement</b> until the policy
        converges. Policy evaluation, which notebly, itself is also an iterative
        computation, predicts the state-value funciton
        (<I>{String.raw`v_{\pi}`}</I>) under the current policy
        (<I>{String.raw`\pi`}</I>), while policy improvement updates policy
        from <I>{String.raw`\pi`}</I> to <I>{String.raw`\pi'`}</I>, which is
        guarranteed to be an improvement for all states unless converged. </p>

        <p>
          <strong>Value iteration</strong> is basically continuous update
          of value functions till convergene, the one step of policy
          update will result in the optimal policy
        </p>

        <p>More to be written, stay tuned. :)</p>

        <p><strong>Bellman optimality</strong> Equations of
        state-value function and action-value function for discrete
        and continuous state and action spaces, respectively:</p>

        <MathJax.Node>
            {String.raw`
                \begin{align*}
                v_*(s)
                &= \max_{a} \mathbb{E}\big[R_{t + 1} + \gamma v_*(S_{t + 1}) | S_t = s, A_t = a \big] \\
                &= \max_{a} \sum_{s',r} p(s', r| s, a)\big[r + \gamma v_*(s') \big] \\
                \\
                q_*(s,a)
                &= \mathbb{E}\big[R_{t + 1} + \gamma \max_{a'} q_*(S_{t + 1}, a') | S_t = s, A_t = a \big] \\
                &= \sum_{s',r} p(s', r| s, a)\big[r + \gamma \max_{a'} q_*(s') \big]
                \end{align*}
            `}
        </MathJax.Node>

        <p>Definition of <strong>state-value function</strong> (<MathJax.Node
        inline>{String.raw`v_{\pi}`}</MathJax.Node>)</p>

        <MathJax.Node>
            {String.raw`
                \begin{align*}
                v_{\pi}(s)
                &\doteq \mathbb{E}_{\pi} \big[G_t | S_t=s \big] \\
                &= \mathbb{E}_{\pi}\big[R_{t+1} + \gamma G_{t+1} | S_t = s \big] \\
                &= \mathbb{E}_{\pi}\big[R_{t+1} + \gamma v_{\pi}(S_{t+1}) | S_t = s \big] \\
                &= \sum_a \pi(a|s) \sum_{s', r} p(s',r|s,a)\big[r + \gamma v_{\pi}(s') \big]
                \end{align*}
            `}
        </MathJax.Node>

        <p>Iterative <strong>policy evaluation</strong>: using <strong>Bellman
        equation</strong> for <MathJax.Node
        inline>{String.raw`v_{\pi}`}</MathJax.Node> as an update
        rule:</p>

        <MathJax.Node>
            {String.raw`
                \begin{align}
                v_{k+1}(s)
                &\doteq \mathbb{E}\big[R_{t + 1} + \gamma v_{k}(S_{t+1})|S_t =s \big] \\
                &= \sum_{a} \pi(a|s) \sum_{s', r} p(s',r|s,a)\big[r + \gamma v_k(s') \big]
                \end{align}
            `}
        </MathJax.Node>

        <p>This is exactly what the "Policy evaluation (one sweep)" button does for all states.</p>

        <p>Definition of <strong>action-value function</strong> (<MathJax.Node
        inline>{String.raw`q_{\pi}`}</MathJax.Node>)</p>

        <MathJax.Node>
            {String.raw`
                \begin{align*}
                q_{\pi}(s,a)
                &\doteq \mathbb{E}_{\pi} \big[R_{t+1} + \gamma v_{\pi}(S_{t+1})| S_t=s, A_t=a \big] \\
                &= \sum_{s', r} p(s',r|s,a)\big[r + \gamma v_{\pi}(s') \big]
                \end{align*}
            `}
        </MathJax.Node>

        <p>Policy improvement theorem:</p>

        <p>If</p>

        <MathJax.Node>
            {String.raw`q_{\pi}(s, \pi'(s)) \ge v_{\pi}(s)`}
        </MathJax.Node>

        <p>Then,</p>

        <MathJax.Node>
            {String.raw`v_{\pi'}(s) \ge v_{\pi}(s)`}
        </MathJax.Node>

        <p>Suppose the new policy (<MathJax.Node
        inline>{String.raw`\pi'`}</MathJax.Node>) after improvement is
        greedy, then,</p>

        <MathJax.Node>
            {String.raw`
                \begin{align*}
                v_{\pi'}(s)
                &= \max_{a} \mathbb{E} \big[R_{t+1} + \gamma v_{\pi'}(S_{t+1}) | S_t=s, A_t=a\big] \\
                &= \max_{a} \sum_{s', r} p(s',r|s,a)\big[r + \gamma v_{\pi'}(s')\big]
                \end{align*}
            `}
        </MathJax.Node>


    </div>
</MathJax.Context>
        );
    }
}


export default Intro;


// <p>In general, value itertion is much slower that policy iteration. In other words, policy converges much faster than value functions. In the case of gridword, the former takes over 100 iteration while the later takes less than 10.</p>
