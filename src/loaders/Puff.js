import React from 'react';
import Stepper from 'stepperjs';
import bezierEasing from 'bezier-easing';

const spread = bezierEasing(0.165, 0.84, 0.44, 1);
const fadeOut = bezierEasing(0.3, 0.61, 0.355, 1);

class Puff extends React.Component {
    constructor(props) {
        super(props);

        const spreadOption = {
            duration: props.duration,
            easing: spread,
            loop: true
        };

        const fadeOutOption = {
            duration: props.duration,
            easing: fadeOut,
            loop: true
        };

        this.stepperSpread = new Stepper(spreadOption);
        this.stepperSpread2 = new Stepper(spreadOption);
        this.stepperFadeOut = new Stepper(fadeOutOption);
        this.stepperFadeOut2 = new Stepper(fadeOutOption);
        this.stepperDelay = new Stepper();
        this.stepperDelay.option('duration', props.duration / 2);
    }

    componentDidMount() {
        const {c1, c2} = this.refs;

        this.stepperSpread.on('update', (n) => c1.setAttribute('r', n * 20));
        this.stepperSpread2.on('update', (n) => c2.setAttribute('r', n * 20));
        this.stepperFadeOut.on('update', (n) => c1.style.strokeOpacity = 1 - n);
        this.stepperFadeOut2.on('update', (n) => c2.style.strokeOpacity = 1 - n);
        this.stepperDelay.on('update', (n) => {
            if (n === 1) {
                this.stepperSpread2.start();
                this.stepperFadeOut2.start();
                this.stepperDelay.stop();
            }
        });

        this.stepperSpread.start();
        this.stepperFadeOut.start();
        this.stepperDelay.start();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.duration !== this.props.duration) {
            const {c1, c2} = this.refs;

            c1.setAttribute('r', 0);
            c2.setAttribute('r', 0);
            c1.style.strokeOpacity = 0;
            c2.style.strokeOpacity = 0;

            this.stepperSpread.option('duration', this.props.duration);
            this.stepperSpread2.option('duration', this.props.duration);
            this.stepperFadeOut.option('duration', this.props.duration);
            this.stepperFadeOut2.option('duration', this.props.duration);
            this.stepperDelay.option('duration', this.props.duration / 2);

            this.stepperSpread.stop();
            this.stepperFadeOut.stop();
            this.stepperSpread2.stop();
            this.stepperFadeOut2.stop();
            this.stepperSpread.start();
            this.stepperFadeOut.start();
            this.stepperDelay.start();
        }
    }

    componentWillUnmount() {
        this.stepperSpread.stop();
        this.stepperSpread2.stop();
        this.stepperFadeOut.stop();
        this.stepperFadeOut2.stop();
        this.stepperSpread.off();
        this.stepperSpread2.off();
        this.stepperFadeOut.off();
        this.stepperFadeOut2.off();
        this.stepperSpread = null;
        this.stepperSpread2 = null;
        this.stepperFadeOut = null;
        this.stepperFadeOut2 = null;
    }

    render() {
        const strokeWidth = this.props.strokeWidth;
        const viewBoxSize = 42 + strokeWidth;

        return (
            <div ref="target" className="preloader-icon__puff" style={{height: '100%'}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} stroke={this.props.strokeColor}>
                    <g fill="none" strokeWidth={strokeWidth}>
                        <circle ref="c1" cx="22" cy="22" r="0" style={{strokeOpacity: 0}}/>
                        <circle ref="c2" cx="22" cy="22" r="0" style={{strokeOpacity: 0}}/>
                    </g>
                </svg>
            </div>
        );
    }
}

export default Puff;
