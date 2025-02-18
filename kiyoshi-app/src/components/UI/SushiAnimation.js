import React from 'react';
import '../../assets/sushiAnimation.css'; // Corrected path to the CSS file

const SushiAnimation = () => {
    return (
        <div className="content">
            <div className="sushi_container">
                <div id="sushi_1">
                    <div className="seaweed">
                        <div className="rice">
                            <div className="rice_grain_1"></div>
                            <div className="rice_grain_2"></div>
                            <div className="rice_grain_3"></div>
                            <div className="fish">
                                <div className="fish_lines_1"></div>
                                <div className="fish_lines_2"></div>
                            </div>
                            <div className="veggies">
                                <div className="veggie_1"></div>
                                <div className="veggie_2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sushi_2">
                    <div className="seaweed">
                        <div className="rice">
                            <div className="rice_grain_1"></div>
                            <div className="rice_grain_2"></div>
                            <div className="rice_grain_3"></div>
                            <div className="fish">
                                <div className="fish_lines_1"></div>
                                <div className="fish_lines_2"></div>
                            </div>
                            <div className="veggies">
                                <div className="veggie_1"></div>
                                <div className="veggie_2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="sushi_3">
                    <div className="seaweed">
                        <div className="rice">
                            <div className="rice_grain_1"></div>
                            <div className="rice_grain_2"></div>
                            <div className="rice_grain_3"></div>
                            <div className="fish">
                                <div className="fish_lines_1"></div>
                                <div className="fish_lines_2"></div>
                            </div>
                            <div className="veggies">
                                <div className="veggie_1"></div>
                                <div className="veggie_2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chopstick_1"></div>
            <div className="chopstick_2"></div>
        </div>
    );
};

export default SushiAnimation;
